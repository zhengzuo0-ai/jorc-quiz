# JORC Quiz — Complete Implementation Spec

> **Purpose**: Self-contained spec for autonomous agents (OpenClaw/Dispatch) to build and deploy a mining knowledge quiz app.
> **Output**: Working React app deployed on Vercel, source on GitHub at `zhengzuo0-ai/jorc-quiz`.

---

## 1. Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4 + `@tailwindcss/vite` |
| Routing | react-router-dom v7 |
| Database | Supabase (PostgreSQL) |
| Hosting | Vercel |
| Markdown | react-markdown + remark-gfm |

### Dependencies to install

```bash
npm install react-router-dom @supabase/supabase-js react-markdown remark-gfm
npm install -D tailwindcss @tailwindcss/vite
```

---

## 2. Project Structure

```
jorc-quiz/
├── public/
│   ├── data/                    # Question JSON files (one per chapter)
│   │   ├── jorc-01.json
│   │   ├── ...
│   │   └── gold-13.json
│   └── concepts/               # Concept review markdown (one per chapter)
│       ├── jorc-01.md
│       └── ...
├── scripts/
│   ├── scrape-examveda.ts      # Scrape mining MCQs from Examveda
│   ├── scrape-gkseries.ts      # Scrape mining MCQs from GKSeries
│   └── generate-questions.ts   # AI-generate JORC/gold-specific questions
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types.ts                # All type definitions
│   ├── data/
│   │   └── chapters.ts         # Chapter metadata registry
│   ├── lib/
│   │   ├── storage.ts          # localStorage wrapper with namespace
│   │   ├── supabase.ts         # Supabase client + sync
│   │   └── spaced-repetition.ts # SM-2 algorithm
│   ├── hooks/
│   │   ├── useQuestions.ts     # Load + shuffle questions for a chapter
│   │   ├── useProgress.ts     # Track answers, calculate stats
│   │   └── useErrorBook.ts    # Error book with spaced repetition
│   ├── components/
│   │   ├── Layout.tsx          # App shell: sidebar nav + content area
│   │   ├── ChapterList.tsx     # Chapter picker grouped by domain
│   │   ├── QuestionCard.tsx    # Single question: stem + 4 options + explanation
│   │   ├── ProgressBar.tsx     # Simple bar showing X/Y
│   │   └── Timer.tsx           # Countdown timer for exam mode
│   └── pages/
│       ├── Home.tsx            # Dashboard: domain cards + overall stats
│       ├── Practice.tsx        # Chapter-based practice session
│       ├── Exam.tsx            # Timed cross-chapter exam
│       ├── Review.tsx          # Error book review session
│       └── Concepts.tsx        # Concept reader per chapter
├── index.html
├── vite.config.ts
├── tailwind.config.ts          # Only if needed for v4
├── tsconfig.json
├── package.json
├── vercel.json
├── .env.example
└── supabase-schema.sql
```

---

## 3. Type Definitions (`src/types.ts`)

```typescript
export interface Question {
  id: string;                    // "jorc-05-014"
  chapterId: string;             // "jorc-05"
  domain: 'jorc' | 'gold';
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correct: 'A' | 'B' | 'C' | 'D';
  explanation: string;           // 3-5 sentences, must teach something
  key_concept: string;           // One-line summary
  source: string;                // "JORC Code 2012, Clause 21" or "Examveda"
  difficulty: 1 | 2 | 3;        // 1=recall, 2=application, 3=scenario
}

export interface Chapter {
  id: string;                    // "jorc-05"
  domain: 'jorc' | 'gold';
  name: string;                  // Chinese name
  nameEn: string;                // English name
  description: string;           // One-line description
  questionCount: number;         // Expected question count
}

export interface AnswerRecord {
  questionId: string;
  chapterId: string;
  correct: boolean;
  selectedAnswer: 'A' | 'B' | 'C' | 'D';
  answeredAt: number;            // Date.now()
}

export interface ErrorEntry {
  questionId: string;
  chapterId: string;
  wrongCount: number;
  lastWrong: number;
  nextReview: number;            // Timestamp for next review
  intervalDays: number;          // Current interval
  easeFactor: number;            // SM-2 ease factor (starts at 2.5)
  mastered: boolean;
}

export interface ChapterStats {
  chapterId: string;
  total: number;
  correct: number;
  accuracy: number;              // 0-100
}
```

---

## 4. Chapter Registry (`src/data/chapters.ts`)

### Domain A: JORC Code 2012 (12 chapters)

| id | name | nameEn | description |
|---|---|---|---|
| jorc-01 | 三大原则 | Transparency, Materiality, Competence | JORC 的基础哲学框架 |
| jorc-02 | 胜任人 (CP) | Competent Person | 定义、资质要求、法律责任 |
| jorc-03 | 资源量与储量分类 | Resource vs Reserve Framework | 分类体系、Figure 1、CRIRSCO 对齐 |
| jorc-04 | 勘探目标与结果报告 | Exploration Targets & Results | Clauses 17-19, 报告要求 |
| jorc-05 | 矿产资源量 | Mineral Resources | Inferred/Indicated/Measured 定义与转换条件 |
| jorc-06 | 矿石储量 | Ore Reserves | Probable/Proved, Modifying Factors |
| jorc-07 | 技术研究 | Technical Studies | Scoping/PFS/DFS 要求与报告 |
| jorc-08 | Table 1 采样与数据 | Sampling Techniques & Data | 采样方法、QA/QC、数据验证 |
| jorc-09 | Table 1 勘探结果 | Reporting Exploration Results | 报告格式、重要性判断 |
| jorc-10 | Table 1 资源量估算 | Resource Estimation & Reporting | 估算方法、分类标准 |
| jorc-11 | Table 1 储量估算 | Reserve Estimation & Reporting | 储量计算、Modifying Factors 报告 |
| jorc-12 | ASIC 监管与合规 | ASIC Guidance & Compliance | 澳洲监管、GN31、常见违规 |

### Domain B: Gold Exploration & Operations (13 chapters)

| id | name | nameEn | description |
|---|---|---|---|
| gold-01 | 黄金基础 | Gold Fundamentals | 性质、品位单位（g/t, ppb）、计量 |
| gold-02 | 矿床类型 | Deposit Types | Orogenic, Epithermal, Porphyry, Carlin, Alluvial |
| gold-03 | 西非金矿地质 | West Africa Gold Geology | Birimian 绿岩带、Man Shield、主要金矿带 |
| gold-04 | 勘探流程 | Exploration Pipeline | Desktop → 踏勘 → 系统勘探 → 钻探 → FS |
| gold-05 | 勘探方法 | Exploration Methods | 地球化学、地球物理、遥感、填图 |
| gold-06 | 资源量估算 | Resource Estimation | 克里金法、反距离加权、块体模型 |
| gold-07 | 采矿方法 | Mining Methods | Open Pit, Underground, ASM 对比 |
| gold-08 | 选矿冶金 | Gold Processing | 重选、CIL/CIP、浮选、堆浸、冶炼 |
| gold-09 | 矿山经济学 | Mine Economics | AISC、NPV、IRR、敏感性分析 |
| gold-10 | 法律与监管 | Legal & Regulatory | 许可证体系、权利金、JV 结构、ESG |
| gold-11 | 黄金价值链 | Gold Value Chain | Doré → 精炼 → LBMA → 市场 |
| gold-12 | Junior Mining | Junior Mining Strategy | 生命周期、融资方式、JV vs 自主开发 |
| gold-13 | 钻探技术 | Drilling | RC vs Diamond Core, 规划、QA/QC、成本 |

---

## 5. Question Sources & Generation Strategy

### Tier 1: Scrape existing MCQs (mining geology, general)

These provide a base of ~300-500 questions for gold-domain chapters:

| Source | URL Pattern | Topics Covered | Target Chapters |
|--------|------------|---------------|----------------|
| Examveda | `examveda.com/mining-engineering/practice-mcq-question-on-mining-geology/` | Mining geology, drilling, blasting, metal mining, economics | gold-01,02,05,07,08,09 |
| GKSeries | `gkseries.com/mcq-on-mining-engineering/` | Sampling, ore evaluation, mining methods | gold-06,07,08 |
| GATE Papers | Various (minestudy.in, mineportal.in) | Technical mining MCQ | gold-04,05,06,07,08,09,13 |

**Scraping approach**: Write Node.js scripts in `scripts/` that fetch HTML, parse question/options/answer, map to the closest chapter, and output JSON. Include a `source` field crediting the origin.

### Tier 2: Generate from source materials (JORC-specific, gold-specific)

For chapters where no existing MCQs exist (all JORC chapters, gold-03, gold-10, gold-11, gold-12):

**Source materials** (located at `/reference-materials/` — copy these into the repo or reference by path):
- `JORC_code_2012.pdf` → jorc-01 through jorc-11
- `jorc_qa_sep_2013.pdf` → jorc-02, jorc-04, jorc-05, jorc-06
- `gn31_reporting_on_mining_activities.pdf` → jorc-12
- `mining-reporting-faqs.pdf` → jorc-12
- Training transcript → jorc-02, jorc-08
- `15-gold-mining-exploration-guide-EN.md` → gold-01 through gold-12
- `13-gold-mining-complete-guide.md` → gold-01,02,07,08
- `09-cdi-mining-legal-framework.md` → gold-10

**Generation script** (`scripts/generate-questions.ts`):
- Uses Anthropic Claude API (model: `claude-sonnet-4-20250514`)
- Reads source material section for each chapter
- Generates questions at difficulty ratio: 30% level 1, 40% level 2, 30% level 3
- Each question must have a 3-5 sentence explanation that teaches the concept
- Outputs to `public/data/{chapterId}.json`
- Rate limit: 1 request per second

**Generation prompt template**:
```
You are creating quiz questions for a mining professional studying {topic}.

Source material:
{relevant_section}

Generate {N} multiple-choice questions (4 options, one correct).

Difficulty levels:
- Level 1 (30%): Definitions, basic recall. "What is..."
- Level 2 (40%): Application. "In this scenario, which..."
- Level 3 (30%): Judgment/scenario. "A company reports X. What concern..."

Requirements:
- Each explanation must TEACH, not just restate the answer
- Reference specific JORC clause numbers where applicable
- Use industry-standard terminology
- Options should be plausible (no obviously wrong answers)

Output JSON array:
[{ "id": "{chapterId}-001", "chapterId": "{chapterId}", "domain": "{domain}", "question": "...", "options": {"A":"..","B":"..","C":"..","D":".."}, "correct": "A", "explanation": "...", "key_concept": "...", "source": "...", "difficulty": 1 }]
```

### Target question counts per chapter

- JORC chapters: 25-35 each → ~330 total
- Gold chapters: 15-30 each → ~295 total
- **Total: ~625 questions**

### Fallback

If scraping or generation falls short, include at minimum **10 hand-written sample questions per chapter** so the app is functional. These are provided in Phase 1.

---

## 6. UI/UX Specification

### Design Principles
- **No gamification**: No badges, streaks, celebrations, confetti, character popups, motivational messages
- **Efficiency first**: Keyboard navigation, minimal clicks, fast transitions
- **Information dense**: Show stats as plain numbers, not decorative charts
- **Clean and readable**: Good typography, sufficient contrast, no visual noise

### Color Palette
- Background: `#fafafa` (light gray)
- Card: `#ffffff` with subtle border
- Correct answer: `#22c55e` (green-500) background tint
- Wrong answer: `#ef4444` (red-500) background tint
- Primary accent: `#2563eb` (blue-600)
- Text: `#1f2937` (gray-800)
- Secondary text: `#6b7280` (gray-500)

### Layout (`Layout.tsx`)
- **Desktop**: Fixed left sidebar (240px) with nav links + collapsible chapter list. Main content area.
- **Mobile**: Bottom tab bar (Home, Practice, Review, Exam). No sidebar.
- Nav items: Home, 练习 (Practice), 错题本 (Review), 模考 (Exam), 概念 (Concepts)

### Home Page (`Home.tsx`)
```
┌─────────────────────────────────────┐
│  JORC Quiz                          │
│                                     │
│  ┌──────────┐  ┌──────────────────┐ │
│  │ JORC Code│  │ Gold Exploration │ │
│  │ 12 章    │  │ 13 章            │ │
│  │ 已做 45% │  │ 已做 12%         │ │
│  └──────────┘  └──────────────────┘ │
│                                     │
│  总进度: 142/625 · 正确率 73%       │
│                                     │
│  待复习错题: 8 道                    │
│                                     │
│  各章正确率:                         │
│  jorc-01 ████████░░ 80% (20/25)    │
│  jorc-02 ██████░░░░ 60% (18/30)    │
│  ...                                │
└─────────────────────────────────────┘
```

### Practice Page (`Practice.tsx`)
1. User selects a chapter from ChapterList
2. Loads questions for that chapter, shuffles order
3. Shows QuestionCard one at a time
4. Top bar: `12/25 · 正确 9 (75%)` plain text
5. After all questions: summary with wrong questions listed

### QuestionCard Behavior
```
┌─────────────────────────────────────┐
│ Q12/25                    jorc-05   │
│                                     │
│ According to JORC Code 2012, which  │
│ of the following is NOT required    │
│ for a Mineral Resource to be        │
│ classified as "Indicated"?          │
│                                     │
│ [A] Geological evidence sufficient  │
│     to assume continuity            │
│ [B] Reasonable prospects for        │
│     eventual economic extraction    │
│ [C] A completed Feasibility Study   │ ← highlighted red (wrong pick)
│ [D] Sampling data at appropriate    │ ← highlighted green (correct)
│     spacing                         │
│                                     │
│ ─── Explanation ─────────────────── │
│ A Feasibility Study is NOT required │
│ for Indicated Resources. Per Clause │
│ 23, Indicated requires geological   │
│ evidence sufficient to assume       │
│ continuity but not certainty...     │
│                                     │
│ Key concept: Indicated = continuity │
│ assumed, not confirmed              │
│                                     │
│             [Next →] or press Enter │
└─────────────────────────────────────┘
```

**Keyboard shortcuts**:
- `1/2/3/4` or `A/B/C/D` — select answer
- `Enter` or `Space` — next question (after answering)
- `Esc` — quit session (with confirmation)

**Behavior**:
- Click option → immediately show correct/wrong + show explanation
- Wrong answers auto-saved to error book
- No delay, no animation beyond basic color transition

### Exam Page (`Exam.tsx`)
- Configure: select domains (JORC/Gold/Both), question count (25/50/75), time limit (30/60/90 min)
- During exam: QuestionCard + countdown timer top-right + question navigator (grid of numbered circles)
- Can skip and come back to questions
- Timer runs out → auto-submit
- Results page: score, time taken, list of wrong questions with explanations

### Review Page (Error Book) (`Review.tsx`)
- List all error entries, sorted by `nextReview` date (soonest first)
- Show: question preview (first 60 chars), chapter, wrong count, next review date
- Filter by: domain, chapter, due today / all
- Click "开始复习" → quiz session with only error book questions
- After correct answer in review: update SM-2 intervals
- After 3 consecutive correct reviews → mark as mastered, remove from active list

### Concepts Page (`Concepts.tsx`)
- Left: chapter list (same as Practice)
- Right: rendered markdown content for selected chapter
- Bottom: "开始刷题 →" button linking to Practice for that chapter

---

## 7. Spaced Repetition — SM-2 Algorithm (`src/lib/spaced-repetition.ts`)

```typescript
export function calculateNextReview(entry: ErrorEntry, wasCorrect: boolean): ErrorEntry {
  if (wasCorrect) {
    const newInterval = entry.intervalDays === 1 ? 1
      : entry.intervalDays === 2 ? 6
      : Math.round(entry.intervalDays * entry.easeFactor);
    const newEase = Math.max(1.3, entry.easeFactor + 0.1);
    return {
      ...entry,
      intervalDays: newInterval,
      easeFactor: newEase,
      nextReview: Date.now() + newInterval * 86400000,
      mastered: entry.wrongCount <= 1 && newInterval >= 21,
    };
  } else {
    return {
      ...entry,
      intervalDays: 1,
      easeFactor: Math.max(1.3, entry.easeFactor - 0.2),
      wrongCount: entry.wrongCount + 1,
      lastWrong: Date.now(),
      nextReview: Date.now() + 86400000, // tomorrow
      mastered: false,
    };
  }
}

export function isDueForReview(entry: ErrorEntry): boolean {
  return !entry.mastered && entry.nextReview <= Date.now();
}
```

---

## 8. Storage Layer (`src/lib/storage.ts`)

```typescript
const PREFIX = 'jorc_quiz_';

export const storage = {
  get<T>(key: string, fallback: T): T {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  },
  set(key: string, value: unknown): void {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  },
  remove(key: string): void {
    localStorage.removeItem(PREFIX + key);
  },
};
```

Keys used:
- `answers` — `AnswerRecord[]`
- `errorBook` — `ErrorEntry[]`
- `lastSync` — timestamp

---

## 9. Supabase Schema (`supabase-schema.sql`)

```sql
-- Users (anonymous, identified by device UUID)
create table users (
  id uuid default gen_random_uuid() primary key,
  device_id text unique not null,
  sync_code text unique default encode(gen_random_bytes(3), 'hex'),
  created_at timestamptz default now()
);

-- Answer history
create table answers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade,
  question_id text not null,
  chapter_id text not null,
  correct boolean not null,
  selected_answer text not null,
  answered_at timestamptz default now()
);

-- Error book
create table error_book (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade,
  question_id text unique not null,
  chapter_id text not null,
  wrong_count int default 1,
  last_wrong timestamptz default now(),
  next_review timestamptz,
  interval_days float default 1,
  ease_factor float default 2.5,
  mastered boolean default false
);

-- Indexes
create index idx_answers_user on answers(user_id);
create index idx_answers_chapter on answers(user_id, chapter_id);
create index idx_error_book_user on error_book(user_id);
create index idx_error_book_review on error_book(user_id, mastered, next_review);
```

### Sync Logic (`src/lib/supabase.ts`)

- On app load: if localStorage empty, pull from Supabase
- On answer/error book update: debounced write to Supabase (3s delay)
- Sync code: 6-char hex code for cross-device sync. Enter code on new device → pull data
- All Supabase operations wrapped in try/catch. Silent failures — localStorage is always primary.

---

## 10. Environment Variables

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

`.env.example` includes these with placeholder values.

---

## 11. Vite Config (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

---

## 12. Vercel Config (`vercel.json`)

```json
{
  "rewrites": [
    { "source": "/((?!data|concepts|assets).*)", "destination": "/index.html" }
  ]
}
```

This ensures SPA routing works while `/data/*.json` and `/concepts/*.md` are served as static files.

---

## 13. Implementation Order

### Phase 1: Core Scaffold (do this first)
1. Set up Vite + Tailwind + React Router + TypeScript config
2. Create `src/types.ts` and `src/data/chapters.ts` with all 25 chapters
3. Create `src/lib/storage.ts`
4. Create `Layout.tsx` with sidebar + routing
5. Create `QuestionCard.tsx` with full interaction (select → show answer → show explanation → next)
6. Create `Home.tsx` with chapter list and basic stats
7. Create `Practice.tsx` that loads questions and runs a quiz session
8. Write 5 sample questions per domain (10 total) in `public/data/jorc-01.json` and `public/data/gold-01.json` for testing
9. Verify: app runs, can select chapter, answer questions, see explanations

### Phase 2: Persistence + Error Book
1. Create `src/hooks/useProgress.ts` — track all answers in localStorage
2. Create `src/hooks/useErrorBook.ts` — auto-save wrong answers
3. Create `src/lib/spaced-repetition.ts` — SM-2 implementation
4. Create `Review.tsx` (error book page) — list errors, start review session
5. Update `Home.tsx` to show real stats from localStorage
6. Verify: wrong answers appear in error book, review updates intervals

### Phase 3: Exam Mode + Stats
1. Create `Timer.tsx` component
2. Create `Exam.tsx` with config panel → timed quiz → results page
3. Create `ProgressBar.tsx`
4. Add per-chapter accuracy stats to Home page
5. Verify: exam mode works end-to-end with timer

### Phase 4: Question Content
1. Write scraper scripts for Examveda and GKSeries (if viable)
2. Write `generate-questions.ts` using Claude API
3. Generate all 25 chapters of questions
4. Generate concept review markdown for each chapter in `public/concepts/`
5. Create `Concepts.tsx` page with markdown rendering
6. Verify: all chapters have questions, concept pages render

### Phase 5: Supabase + Deploy
1. Create Supabase project and run `supabase-schema.sql`
2. Implement `src/lib/supabase.ts` with sync logic
3. Add sync code feature (generate on first use, enter on new device)
4. Set up Vercel project, add env vars
5. Deploy and test end-to-end
6. Push to GitHub `zhengzuo0-ai/jorc-quiz`

---

## 14. Sample Questions (for Phase 1 testing)

### `public/data/jorc-01.json` (5 questions)

```json
[
  {
    "id": "jorc-01-001",
    "chapterId": "jorc-01",
    "domain": "jorc",
    "question": "Which of the following is NOT one of the three overarching principles of the JORC Code 2012?",
    "options": {
      "A": "Transparency",
      "B": "Materiality",
      "C": "Profitability",
      "D": "Competence"
    },
    "correct": "C",
    "explanation": "The three overarching principles of the JORC Code are Transparency, Materiality, and Competence (Clause 4). Profitability is not a JORC principle. Transparency requires that the reader is provided with sufficient information. Materiality requires all relevant information to be reported. Competence requires that the report is based on work by a suitably qualified and experienced person.",
    "key_concept": "JORC's three principles: Transparency, Materiality, Competence",
    "source": "JORC Code 2012, Clause 4",
    "difficulty": 1
  },
  {
    "id": "jorc-01-002",
    "chapterId": "jorc-01",
    "domain": "jorc",
    "question": "Under the JORC Code, the Principle of Materiality requires that a Public Report contains:",
    "options": {
      "A": "All geological data collected during exploration",
      "B": "All information that investors and their advisers would reasonably require and expect to find",
      "C": "Only positive exploration results",
      "D": "A minimum of 50 pages of technical detail"
    },
    "correct": "B",
    "explanation": "Clause 5 states that materiality requires the Public Report to contain all information that investors and their professional advisers would reasonably require, and reasonably expect to find, for the purpose of making a reasoned and balanced judgement. It does not mean dumping all data, nor cherry-picking only positive results.",
    "key_concept": "Materiality = what a reasonable investor would need to make a balanced judgement",
    "source": "JORC Code 2012, Clause 5",
    "difficulty": 2
  },
  {
    "id": "jorc-01-003",
    "chapterId": "jorc-01",
    "domain": "jorc",
    "question": "A company publishes exploration results but omits drill holes that returned no significant mineralization. Which JORC principle is most directly violated?",
    "options": {
      "A": "Competence",
      "B": "Transparency",
      "C": "Materiality",
      "D": "Both B and C"
    },
    "correct": "D",
    "explanation": "Omitting negative drill results violates both Transparency (the reader cannot see the full picture) and Materiality (negative results are information a reasonable investor needs). Clause 19 explicitly warns against cherry-picking results. A common compliance failure is reporting only high-grade intercepts while hiding barren holes.",
    "key_concept": "Cherry-picking results violates both Transparency and Materiality",
    "source": "JORC Code 2012, Clauses 4-5, 19",
    "difficulty": 3
  },
  {
    "id": "jorc-01-004",
    "chapterId": "jorc-01",
    "domain": "jorc",
    "question": "The JORC Code 2012 applies to Public Reports relating to:",
    "options": {
      "A": "Only Mineral Resources",
      "B": "Only Ore Reserves",
      "C": "Exploration Results, Mineral Resources, and Ore Reserves",
      "D": "All geological reports including internal company memos"
    },
    "correct": "C",
    "explanation": "The JORC Code applies to all Public Reports of Exploration Results, Mineral Resources, and Ore Reserves (Clause 1). It does NOT apply to internal company documents — only reports prepared for informing investors or potential investors. The three categories form a progression from early-stage results through to economic deposits.",
    "key_concept": "JORC covers three categories: Exploration Results, Mineral Resources, Ore Reserves",
    "source": "JORC Code 2012, Clause 1",
    "difficulty": 1
  },
  {
    "id": "jorc-01-005",
    "chapterId": "jorc-01",
    "domain": "jorc",
    "question": "The Principle of Competence under JORC Code ensures that:",
    "options": {
      "A": "The company has enough capital to complete the project",
      "B": "The Public Report is based on work of a person with relevant experience and professional qualifications",
      "C": "The laboratory conducting assays is ISO-certified",
      "D": "The company has a minimum 5-year track record in mining"
    },
    "correct": "B",
    "explanation": "Competence (Clause 4) means the Public Report is based on work that is the responsibility of a suitably qualified and experienced person — the Competent Person. This is about individual professional accountability, not corporate financial capacity or lab certification. The CP must be a member of a recognised professional organisation.",
    "key_concept": "Competence = qualified individual (CP) takes responsibility, not company credentials",
    "source": "JORC Code 2012, Clause 4",
    "difficulty": 1
  }
]
```

### `public/data/gold-01.json` (5 questions)

```json
[
  {
    "id": "gold-01-001",
    "chapterId": "gold-01",
    "domain": "gold",
    "question": "What is the standard unit for reporting gold grade in hard-rock deposits?",
    "options": {
      "A": "Parts per billion (ppb)",
      "B": "Grams per tonne (g/t)",
      "C": "Troy ounces per ton (oz/t)",
      "D": "Percentage (%)"
    },
    "correct": "B",
    "explanation": "Grams per tonne (g/t) is the international standard for reporting gold grades in hard-rock deposits, equivalent to parts per million (ppm). Troy ounces per ton is sometimes used in North America but g/t is the JORC/CRIRSCO standard. Parts per billion (ppb) is used for soil geochemistry samples, not resource grades. Percentage is used for base metals like copper, not gold.",
    "key_concept": "Gold grade standard unit: g/t (= ppm). 1 g/t gold = 1 ppm",
    "source": "Industry standard, JORC reporting convention",
    "difficulty": 1
  },
  {
    "id": "gold-01-002",
    "chapterId": "gold-01",
    "domain": "gold",
    "question": "A gold deposit has a grade of 5 g/t. How many troy ounces of gold does 1 tonne of ore contain?",
    "options": {
      "A": "0.05 oz",
      "B": "0.16 oz",
      "C": "0.50 oz",
      "D": "1.61 oz"
    },
    "correct": "B",
    "explanation": "1 troy ounce = 31.1035 grams. So 5 grams / 31.1035 = 0.1607 troy ounces per tonne. The conversion factor is: g/t ÷ 31.1035 = oz/t. This is a fundamental conversion every mining professional should know by heart. A 5 g/t deposit is considered high-grade for open pit and very good for underground.",
    "key_concept": "g/t to oz/t conversion: divide by 31.1035",
    "source": "Fundamental gold industry conversion",
    "difficulty": 2
  },
  {
    "id": "gold-01-003",
    "chapterId": "gold-01",
    "domain": "gold",
    "question": "Which property of gold makes it particularly amenable to gravity separation in mineral processing?",
    "options": {
      "A": "Its yellow color",
      "B": "Its high specific gravity (19.3)",
      "C": "Its resistance to oxidation",
      "D": "Its malleability"
    },
    "correct": "B",
    "explanation": "Gold's extremely high specific gravity of 19.3 (compared to most rock minerals at 2.5-3.0) creates a large density differential that makes gravity separation highly effective. This is why panning works and why gravity circuits are often the first step in gold processing plants. Free gold particles settle much faster than waste minerals in water-based separation.",
    "key_concept": "Gold SG = 19.3, enabling gravity separation from gangue (SG 2.5-3.0)",
    "source": "Gold metallurgy fundamentals",
    "difficulty": 1
  },
  {
    "id": "gold-01-004",
    "chapterId": "gold-01",
    "domain": "gold",
    "question": "In exploration geochemistry, a soil sample returning 150 ppb Au would be considered:",
    "options": {
      "A": "Background level, not anomalous",
      "B": "A strong anomaly warranting follow-up",
      "C": "Ore grade material ready for mining",
      "D": "Impossible — gold cannot be detected at ppb levels"
    },
    "correct": "B",
    "explanation": "150 ppb (0.15 ppm or 0.15 g/t) in a soil sample is typically a strong geochemical anomaly. Background gold in soil is usually 1-5 ppb. Anything above 50-100 ppb is generally considered anomalous and warrants follow-up sampling or trenching. Note: soil grades are NOT ore grades — the underlying bedrock needs drilling to determine if economic mineralization exists. Modern labs can detect gold down to 1 ppb using fire assay or BLEG methods.",
    "key_concept": "Soil Au >50-100 ppb = anomalous; background is 1-5 ppb; soil grade ≠ ore grade",
    "source": "Exploration geochemistry practice",
    "difficulty": 2
  },
  {
    "id": "gold-01-005",
    "chapterId": "gold-01",
    "domain": "gold",
    "question": "What is the 'nugget effect' in gold geostatistics, and why does it matter?",
    "options": {
      "A": "The tendency for gold nuggets to increase resource estimates",
      "B": "High short-range grade variability due to coarse gold particles, making estimation difficult",
      "C": "The premium price commanded by visible gold specimens",
      "D": "A legal requirement to report nuggets separately in JORC Table 1"
    },
    "correct": "B",
    "explanation": "The nugget effect refers to high grade variability at very short distances, caused by the erratic distribution of coarse gold particles. This is a fundamental geostatistical challenge: two samples taken 1 meter apart can show wildly different grades. It makes resource estimation difficult because standard interpolation methods assume some spatial continuity. Deposits with strong nugget effects require larger sample volumes, closer drill spacing, or screen fire assay to improve grade reliability.",
    "key_concept": "Nugget effect = erratic short-range grade variability from coarse gold; requires larger samples",
    "source": "Geostatistics, resource estimation fundamentals",
    "difficulty": 3
  }
]
```

---

## 15. What NOT to Build

Explicitly excluded features — do not implement these:
- Achievement/badge system
- Streak counters or daily login rewards
- Celebration animations or confetti
- Character/mascot popups
- Motivational quotes or encouraging messages
- Social features (leaderboards, sharing)
- Sound effects
- Dark mode (can add later if needed)
- User accounts with email/password (anonymous device-based only)
- Payment/premium features

---

## 16. Acceptance Criteria

The app is "done" when:
1. All 25 chapters are defined and displayed in the UI
2. Each chapter has at least 10 questions (ideally 20-30)
3. Practice mode works: select chapter → answer questions → see explanations
4. Wrong answers automatically enter the error book
5. Error book shows due items and allows review with SM-2 scheduling
6. Exam mode works: configure → timed session → results
7. Concepts page renders markdown for each chapter
8. Stats show per-chapter accuracy on the home page
9. Data persists in localStorage across sessions
10. Supabase sync works (write answers, pull on new device with sync code)
11. Deployed on Vercel and accessible via URL
12. Keyboard navigation works (1/2/3/4 to select, Enter to advance)
