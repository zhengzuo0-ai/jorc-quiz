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
    <div className="max-w-3xl mx-auto">
      <h1
        className="text-2xl font-semibold mb-6"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--navy-dark)' }}
      >
        概念学习 Concepts
      </h1>

      {[
        { label: 'JORC Code 2012', items: jorcChapters },
        { label: 'Gold Exploration', items: goldChapters },
      ].map(group => (
        <div key={group.label} className="mb-8">
          <h2
            className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: 'var(--text-muted)' }}
          >
            {group.label}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {group.items.map(ch => {
              const isRead = readSet.has(ch.id);
              const record = readRecords.find(r => r.chapterId === ch.id);
              return (
                <Link
                  key={ch.id}
                  to={`/concepts/${ch.id}`}
                  className="flex items-start gap-3 rounded-xl p-4 transition-all duration-200"
                  style={{
                    background: 'var(--white)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--gold)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                  }}
                >
                  <span
                    className="mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 text-xs"
                    style={{
                      borderColor: isRead ? 'var(--gold)' : 'var(--border)',
                      background: isRead ? 'var(--gold-dim)' : 'transparent',
                      color: isRead ? 'var(--gold)' : 'transparent',
                    }}
                  >
                    ✓
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {ch.name}
                    </div>
                    <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{ch.nameEn}</div>
                    {record && (
                      <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
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
    async function load() {
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
    }
    load();
  }, [chapterId]);

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        to="/concepts"
        className="inline-flex items-center gap-1 text-sm font-medium mb-5 transition-colors duration-200"
        style={{ color: 'var(--gold)' }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--gold-light)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--gold)'; }}
      >
        ← 返回目录 Back to list
      </Link>

      {chapter && (
        <div className="mb-5">
          <h1
            className="text-2xl font-semibold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--navy-dark)' }}
          >
            {chapter.name}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{chapter.nameEn}</p>
        </div>
      )}

      {loading && <p style={{ color: 'var(--text-muted)' }} className="text-sm">加载中...</p>}
      {error && <p style={{ color: 'var(--error)' }} className="text-sm">{error}</p>}

      {!loading && !error && (
        <article
          className="concept-prose rounded-xl p-6 md:p-8"
          style={{
            background: 'var(--white)',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          }}
        >
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
