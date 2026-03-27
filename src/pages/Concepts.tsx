import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { chapters } from '../data/chapters';
import { storage } from '../lib/storage';

interface ConceptReadRecord {
  chapterId: string;
  lastRead: number;
  readCount: number;
}

function getReadRecords(): ConceptReadRecord[] {
  return storage.get<ConceptReadRecord[]>('conceptReads', []);
}

function markAsRead(chapterId: string) {
  const records = getReadRecords();
  const existing = records.find(r => r.chapterId === chapterId);
  if (existing) {
    existing.lastRead = Date.now();
    existing.readCount += 1;
  } else {
    records.push({ chapterId, lastRead: Date.now(), readCount: 1 });
  }
  storage.set('conceptReads', records);
}

function ChapterListView() {
  const jorcChapters = chapters.filter(c => c.domain === 'jorc');
  const goldChapters = chapters.filter(c => c.domain === 'gold');
  const readRecords = getReadRecords();
  const readSet = new Set(readRecords.map(r => r.chapterId));

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-800 mb-4">概念学习 Concepts</h1>

      {[
        { label: 'JORC Code 2012', items: jorcChapters, color: 'blue' },
        { label: 'Gold Exploration', items: goldChapters, color: 'amber' },
      ].map(group => (
        <div key={group.label} className="mb-6">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            {group.label}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {group.items.map(ch => {
              const isRead = readSet.has(ch.id);
              const record = readRecords.find(r => r.chapterId === ch.id);
              return (
                <Link
                  key={ch.id}
                  to={`/concepts/${ch.id}`}
                  className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <span
                    className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 text-xs ${
                      isRead
                        ? 'border-green-500 bg-green-50 text-green-600'
                        : 'border-gray-300 text-transparent'
                    }`}
                  >
                    ✓
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">
                      {ch.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">{ch.nameEn}</div>
                    {record && (
                      <div className="text-xs text-gray-400 mt-0.5">
                        已读 {record.readCount} 次 · {new Date(record.lastRead).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function ConceptViewer({ chapterId }: { chapterId: string }) {
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const chapter = chapters.find(c => c.id === chapterId);

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`/concepts/${chapterId}.md`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.text();
      })
      .then(text => {
        setMarkdown(text);
        markAsRead(chapterId);
      })
      .catch(() => setError('无法加载内容 / Content not found'))
      .finally(() => setLoading(false));
  }, [chapterId]);

  return (
    <div>
      <Link
        to="/concepts"
        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mb-4"
      >
        ← 返回目录 Back to list
      </Link>

      {chapter && (
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-gray-800">{chapter.name}</h1>
          <p className="text-sm text-gray-500">{chapter.nameEn}</p>
        </div>
      )}

      {loading && <p className="text-gray-500 text-sm">加载中...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!loading && !error && (
        <article className="concept-prose bg-white border border-gray-200 rounded-lg p-4 md:p-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        </article>
      )}
    </div>
  );
}

export default function Concepts() {
  const { chapterId } = useParams<{ chapterId: string }>();

  if (chapterId) {
    return <ConceptViewer chapterId={chapterId} />;
  }
  return <ChapterListView />;
}
