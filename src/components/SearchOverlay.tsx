import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useCourseStore } from '../store/courses'; // <-- Import the new store

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  onOpenCourse: (id: string) => void;
  onOpenFuture: (id: string) => void;
}

export default function SearchOverlay({ open, onClose, onOpenCourse, onOpenFuture }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Pull live data from Supabase via Zustand
  const { courses, futureTopics } = useCourseStore();

  useEffect(() => {
    if (open) { 
      setTimeout(() => {
        setQuery('');
        inputRef.current?.focus();
      }, 50); 
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const q = query.toLowerCase().trim();
  
  // Filter through dynamic courses (using ?. to prevent crashes on empty data)
  const bca = q ? courses.filter(s =>
    s.title.toLowerCase().includes(q) || 
    s.tags?.some(t => t.toLowerCase().includes(q)) || 
    s.topics?.some(t => t.toLowerCase().includes(q))
  ) : [];
  
  const future = q ? futureTopics.filter(s =>
    s.title.toLowerCase().includes(q) || 
    s.tags?.some(t => t.toLowerCase().includes(q)) || 
    s.topics?.some(t => t.toLowerCase().includes(q))
  ) : [];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-bg/96 backdrop-blur-xl flex flex-col items-center px-6 pt-20 pb-10"
         onClick={(e) => e.target === e.currentTarget && onClose()}>
      {/* Input */}
      <div className="w-full max-w-2xl relative mb-8 animate-fade-up">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search subjects, topics, lessons…"
          className="w-full bg-surface border border-border rounded-2xl py-4 pl-12 pr-12 text-lg text-white outline-none focus:border-accent transition-colors"
          autoComplete="off"
        />
        <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* Results */}
      <div className="w-full max-w-2xl flex flex-col gap-3 overflow-y-auto max-h-[60vh]">
        {!q && <p className="text-muted text-center text-sm py-8">Start typing to search across BCA courses and Future Learning topics…</p>}
        {q && !bca.length && !future.length && (
          <p className="text-muted text-center text-sm py-8">No results for "<strong className="text-white">{query}</strong>"</p>
        )}
        
        {bca.map(s => (
          <button key={s.id} onClick={() => { onClose(); onOpenCourse(s.id); }}
            className="text-left bg-surface border border-border rounded-xl px-5 py-4 hover:border-accent transition-colors group">
            <p className="font-semibold text-sm group-hover:text-accent2 transition-colors">{s.emoji || '📚'} {s.title}</p>
            <p className="text-muted text-xs mt-1">🎓 {s.sem?.map(x => x.replace('sem','Semester ')).join(', ')} · {s.topics?.length || 0} modules</p>
          </button>
        ))}
        
        {future.map(s => (
          <button key={s.id} onClick={() => { onClose(); onOpenFuture(s.id); }}
            className="text-left bg-surface border border-border rounded-xl px-5 py-4 hover:border-accent transition-colors group">
            <p className="font-semibold text-sm group-hover:text-accent2 transition-colors">{s.emoji || '🚀'} {s.title}</p>
            <p className="text-muted text-xs mt-1">🚀 Future Learning · {s.topics?.length || 0} modules</p>
          </button>
        ))}
      </div>
    </div>
  );
}