# PMH Mining — 矿业知识学习平台

Bilingual (Chinese/English) mining knowledge learning platform with quiz, spaced repetition, and comprehensive reference content. Built for business professionals entering the gold mining industry.

## Features

- **33 Bilingual Concept Chapters** — JORC Code (12), Gold Technical (13), Industry Analysis (8), all with verified source citations, PMH context, and self-check questions
- **1,485 Quiz Questions** across 33 chapters (45 per chapter) with difficulty indicators
- **Spaced Repetition** (SM-2 algorithm) — wrong answers auto-enter error book with scheduled reviews
- **Timed Exam Mode** — configurable domain, question count, and time limit
- **Progress Tracking** — streak counter, weak chapter alerts, per-chapter accuracy
- **Study Plan** — structured learning path for beginners
- **Learning Notes** — daily journal for recording study progress

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | react-router-dom v7 |
| Markdown | react-markdown + remark-gfm |
| Testing | Vitest (19 tests) |
| Hosting | Vercel |

## Getting Started

```bash
npm install
npm run dev        # Start dev server
npm run build      # Production build
npm test           # Run tests
npm run lint       # ESLint check
```

## License

Private project for PMH (Paramount Mining Holdings).
