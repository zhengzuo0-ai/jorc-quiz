import { useState, useEffect, useRef } from 'react';
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
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!chapterId) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    let cancelled = false;

    const fetchData = async () => {
      try {
        const res = await fetch(`/data/${chapterId}.json`, { signal: controller.signal });
        if (!res.ok) throw new Error('No questions available');
        const data: Question[] = await res.json();
        if (!cancelled) {
          setQuestions(shuffle(data));
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled && !(err instanceof DOMException && err.name === 'AbortError')) {
          setError((err as Error).message);
          setQuestions([]);
          setLoading(false);
        }
      }
    };

    setLoading(true);
    setError(null);
    fetchData();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [chapterId]);

  return { questions, loading, error };
}

export function useMultiChapterQuestions(chapterIds: string[], count: number) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const keyRef = useRef('');

  useEffect(() => {
    const key = `${chapterIds.join(',')}_${count}`;
    if (chapterIds.length === 0 || key === keyRef.current) return;
    keyRef.current = key;

    let cancelled = false;

    const fetchAll = async () => {
      if (!cancelled) setLoading(true);
      const results = await Promise.all(
        chapterIds.map(id =>
          fetch(`/data/${id}.json`)
            .then(res => (res.ok ? res.json() : []))
            .catch(() => [])
        )
      );
      if (!cancelled) {
        const all = (results as Question[][]).flat();
        setQuestions(shuffle(all).slice(0, count));
        setLoading(false);
      }
    };

    fetchAll();

    return () => { cancelled = true; };
  }, [chapterIds, count]);

  return { questions, loading };
}
