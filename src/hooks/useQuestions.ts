import { useState, useEffect } from 'react';
import type { Question } from '../types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function useQuestions(chapterId: string | undefined) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chapterId) return;
    setLoading(true);
    setError(null);
    fetch(`/data/${chapterId}.json`)
      .then(res => {
        if (!res.ok) throw new Error('No questions available');
        return res.json();
      })
      .then((data: Question[]) => {
        setQuestions(shuffle(data));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setQuestions([]);
        setLoading(false);
      });
  }, [chapterId]);

  return { questions, loading, error };
}

export function useMultiChapterQuestions(chapterIds: string[], count: number) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (chapterIds.length === 0) return;
    setLoading(true);
    Promise.all(
      chapterIds.map(id =>
        fetch(`/data/${id}.json`)
          .then(res => (res.ok ? res.json() : []))
          .catch(() => [])
      )
    ).then((results: Question[][]) => {
      const all = results.flat();
      setQuestions(shuffle(all).slice(0, count));
      setLoading(false);
    });
  }, [chapterIds.join(','), count]);

  return { questions, loading };
}
