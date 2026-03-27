# JORC Quiz — Mining Knowledge Platform

A bilingual (Chinese/English) mining knowledge learning platform with quiz, spaced repetition, and comprehensive reference content. Built for business professionals entering the gold mining industry.

## Features

- **31 Bilingual Concept Chapters** — JORC Code, gold exploration, processing, trading, industry analysis, country-specific regulations (Mali/Laos), all with verified source citations
- **682 Quiz Questions** across 25 chapters with difficulty indicators
- **Spaced Repetition** (SM-2 algorithm) — wrong answers auto-enter the error book with scheduled reviews based on forgetting curves
- **Timed Exam Mode** — configurable domain, question count, and time limit with per-chapter accuracy breakdown
- **Daily Streak & Progress Tracking** — streak counter, weak chapter alerts, smart learning recommendations
- **Learning Notes** — daily journal for recording study progress
- **200+ Term Glossary** — bilingual mining terminology reference
- **5-Week Learning Path** — structured guide for business-background beginners

## Knowledge Coverage

| Module | Chapters | Sources |
|---|---|---|
| JORC Code | 8 | jorc.org, ASX, AusIMM |
| Gold Technical | 13 | 911Metallurgist, Mining Pedia, USGS, WGC |
| Industry Analysis | 6 | Newmont 10-K, Barrick, B2Gold, Endeavour FY-2024 |
| Country Regulations | 2 | UNCTAD, Lexology, Lao Official Gazette |
| Reference | 2 | Glossary + Learning Path |

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | react-router-dom v7 |
| Markdown | react-markdown + remark-gfm |
| Testing | Vitest (21 tests) |
| Hosting | Vercel |

## Getting Started

```bash
npm install
npm run dev        # Start dev server
npm run build      # Production build
npm run test       # Run tests
npm run lint       # ESLint check
```

## Project Structure

```
src/
├── pages/          # Home, Practice, Review, Exam, Concepts, Notes
├── components/     # QuestionCard, ChapterList, ProgressBar, Timer, Layout
├── hooks/          # useQuestions, useProgress, useErrorBook
├── lib/            # storage, spaced-repetition (+ tests)
├── data/           # Chapter metadata registry
└── types.ts        # TypeScript definitions

public/
├── data/           # 682 quiz questions (JSON, one file per chapter)
└── concepts/       # 31 bilingual markdown knowledge chapters
```

## License

Private project for PMH (Paramount Mining Holdings).
