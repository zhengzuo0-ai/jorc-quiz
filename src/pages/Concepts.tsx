import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { chapters, jorcChapters, goldChapters, industryChapters } from '../data/chapters';
import { storage } from '../lib/storage';

export default function Concepts() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [readChapters, setReadChapters] = useState<string[]>(() =>
    storage.get<string[]>('read_concepts', [])
  );

  const markAsRead = useCallback((id: string) => {
    setReadChapters(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      storage.set('read_concepts', next);
      return next;
    });
  }, []);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!chapterId) return;
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(`/concepts/${chapterId}.md`);
        if (!res.ok) throw new Error('not found');
        const text = await res.text();
        if (!cancelled) {
          setContent(text);
          setError(false);
          setLoading(false);
          markAsRead(chapterId);
        }
      } catch {
        if (!cancelled) {
          setContent('');
          setError(true);
          setLoading(false);
        }
      }
    };

    setLoading(true);
    load();
    return () => { cancelled = true; };
  }, [chapterId, markAsRead]);

  // Chapter list view
  if (!chapterId) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-semibold text-gray-800 mb-2">知识学习 Concepts</h1>
        <p className="text-sm text-gray-500 mb-1">中英文对照的矿业知识讲解，配合练习使用效果更佳</p>
        <p className="text-xs text-gray-400 mb-6">已阅读 {readChapters.length}/{chapters.length} 章</p>

        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-600 mb-2">JORC Code</h2>
          <div className="flex flex-col gap-1">
            {jorcChapters.map(ch => (
              <Link
                key={ch.id}
                to={`/concepts/${ch.id}`}
                className="flex items-center justify-between bg-white rounded border border-gray-200 px-4 py-3 hover:border-blue-400 transition-colors"
              >
                <div>
                  <div className="text-sm text-gray-800">{ch.name}</div>
                  <div className="text-xs text-gray-500">{ch.nameEn}</div>
                </div>
                <span className="text-xs">{readChapters.includes(ch.id) ? <span className="text-green-500">已读</span> : <span className="text-gray-400">→</span>}</span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium text-gray-600 mb-2">Gold Exploration</h2>
          <div className="flex flex-col gap-1">
            {goldChapters.map(ch => (
              <Link
                key={ch.id}
                to={`/concepts/${ch.id}`}
                className="flex items-center justify-between bg-white rounded border border-gray-200 px-4 py-3 hover:border-blue-400 transition-colors"
              >
                <div>
                  <div className="text-sm text-gray-800">{ch.name}</div>
                  <div className="text-xs text-gray-500">{ch.nameEn}</div>
                </div>
                <span className="text-xs">{readChapters.includes(ch.id) ? <span className="text-green-500">已读</span> : <span className="text-gray-400">→</span>}</span>
              </Link>
            ))}
          </div>
        </div>

        {industryChapters.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-medium text-gray-600 mb-2">Industry Knowledge 行业知识</h2>
            <div className="flex flex-col gap-1">
              {industryChapters.map(ch => (
                <Link
                  key={ch.id}
                  to={`/concepts/${ch.id}`}
                  className="flex items-center justify-between bg-white rounded border border-gray-200 px-4 py-3 hover:border-blue-400 transition-colors"
                >
                  <div>
                    <div className="text-sm text-gray-800">{ch.name}</div>
                    <div className="text-xs text-gray-500">{ch.nameEn}</div>
                  </div>
                  <span className="text-xs">{readChapters.includes(ch.id) ? <span className="text-green-500">已读</span> : <span className="text-gray-400">→</span>}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const chapter = chapters.find(c => c.id === chapterId);

  if (loading) {
    return <div className="text-center text-gray-500 mt-12">加载中...</div>;
  }

  if (error || !content) {
    return (
      <div className="max-w-2xl mx-auto text-center mt-12">
        <p className="text-gray-500 mb-2">{chapter?.name ?? chapterId}</p>
        <p className="text-sm text-gray-400 mb-4">概念讲解内容即将上线</p>
        <div className="flex gap-3 justify-center">
          <Link to="/concepts" className="text-blue-600 text-sm hover:underline">← 返回章节列表</Link>
          <Link to={`/practice/${chapterId}`} className="text-blue-600 text-sm hover:underline">去做题 →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link to="/concepts" className="text-sm text-gray-500 hover:text-blue-600">← 返回章节</Link>
        <Link to={`/practice/${chapterId}`} className="text-sm text-blue-600 hover:underline">去做题 →</Link>
      </div>

      <article className="prose max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>
    </div>
  );
}
