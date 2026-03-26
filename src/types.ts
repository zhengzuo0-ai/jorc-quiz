export interface Question {
  id: string;
  chapterId: string;
  domain: 'jorc' | 'gold';
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correct: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  key_concept: string;
  source: string;
  difficulty: 1 | 2 | 3;
}

export interface Chapter {
  id: string;
  domain: 'jorc' | 'gold';
  name: string;
  nameEn: string;
  description: string;
  questionCount: number;
}

export interface AnswerRecord {
  questionId: string;
  chapterId: string;
  correct: boolean;
  selectedAnswer: 'A' | 'B' | 'C' | 'D';
  answeredAt: number;
}

export interface ErrorEntry {
  questionId: string;
  chapterId: string;
  wrongCount: number;
  lastWrong: number;
  nextReview: number;
  intervalDays: number;
  easeFactor: number;
  mastered: boolean;
}

export interface ChapterStats {
  chapterId: string;
  total: number;
  correct: number;
  accuracy: number;
}
