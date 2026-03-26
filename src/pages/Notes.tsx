import { useState, useCallback } from 'react';
import { storage } from '../lib/storage';

interface Note {
  id: string;
  date: string;
  content: string;
  createdAt: number;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(() =>
    storage.get<Note[]>('notes', [])
  );
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const addNote = useCallback(() => {
    if (!draft.trim()) return;
    const note: Note = {
      id: `note-${Date.now()}`,
      date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      content: draft.trim(),
      createdAt: Date.now(),
    };
    setNotes(prev => {
      const next = [note, ...prev];
      storage.set('notes', next);
      return next;
    });
    setDraft('');
  }, [draft]);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => {
      const next = prev.filter(n => n.id !== id);
      storage.set('notes', next);
      return next;
    });
  }, []);

  const startEdit = useCallback((note: Note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  }, []);

  const saveEdit = useCallback(() => {
    if (!editingId || !editContent.trim()) return;
    setNotes(prev => {
      const next = prev.map(n => n.id === editingId ? { ...n, content: editContent.trim() } : n);
      storage.set('notes', next);
      return next;
    });
    setEditingId(null);
    setEditContent('');
  }, [editingId, editContent]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      addNote();
    }
  }, [addNote]);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold text-gray-800 mb-2">学习笔记</h1>
      <p className="text-sm text-gray-500 mb-4">记录每天的学习心得和关键知识点</p>

      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="今天学到了什么？记录关键概念、疑问或心得..."
          className="w-full text-sm text-gray-700 placeholder-gray-400 resize-none border-0 focus:ring-0 outline-none min-h-[80px]"
          rows={3}
        />
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-400">Ctrl+Enter 保存</span>
          <button
            onClick={addNote}
            disabled={!draft.trim()}
            className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-40"
          >
            保存笔记
          </button>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="text-sm text-gray-400 text-center mt-8">
          还没有笔记，开始记录你的学习历程吧
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notes.map(note => (
            <div key={note.id} className="bg-white rounded-lg border border-gray-200 px-4 py-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500 font-medium">{note.date}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(note)}
                    className="text-xs text-gray-400 hover:text-blue-600"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-xs text-gray-400 hover:text-red-500"
                  >
                    删除
                  </button>
                </div>
              </div>
              {editingId === note.id ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    className="w-full text-sm text-gray-700 border border-gray-200 rounded p-2 resize-none focus:outline-none focus:border-blue-400"
                    rows={3}
                  />
                  <div className="flex gap-2 mt-2">
                    <button onClick={saveEdit} className="text-xs px-3 py-1 bg-blue-600 text-white rounded">保存</button>
                    <button onClick={() => setEditingId(null)} className="text-xs px-3 py-1 border border-gray-200 rounded text-gray-600">取消</button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{note.content}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
