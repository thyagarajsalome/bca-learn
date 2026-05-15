import type { Course, FutureTopic } from '../types';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ModalProps {
  course?: Course | null;
  future?: FutureTopic | null;
  onClose: () => void;
}

export default function Modal({ course, future, onClose }: ModalProps) {
  const navigate = useNavigate();
  const item = course || future;
  if (!item) return null;

  const isFuture = !!future;
  const semLabel = !isFuture && course
    ? course.sem.map(s => s.replace('sem', 'Semester ')).join(' · ')
    : '🚀 Future Learning Track';
  const accentColor = isFuture ? future!.color : '#6366f1';

  return (
    <div className="fixed inset-0 z-[150] bg-bg/85 backdrop-blur-md flex items-center justify-center p-6"
         onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-animate bg-surface border border-border rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-8 relative">
        {/* Top accent bar for future topics */}
        {isFuture && (
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
               style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)` }} />
        )}

        <button onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-white hover:bg-surface2 p-2 rounded-lg transition-all">
          <X size={18} />
        </button>

        <div className="text-5xl mb-4">{item.emoji}</div>
        <h2 className="font-display font-bold text-2xl mb-2">{item.title}</h2>
        <p className="text-muted text-sm mb-1">
          📅 {semLabel} &nbsp;|&nbsp; 📖 {item.lessons} Lessons
        </p>
        {!isFuture && course && (
          <p className="text-muted text-xs mb-4">
            Course Code: <span className="text-accent2 font-mono font-semibold">{course.code}</span>
            {course.isLab && <span className="ml-2 bg-green-500/15 text-green-400 text-xs px-2 py-0.5 rounded-full">Lab</span>}
          </p>
        )}

        <p className="text-muted text-sm leading-relaxed mb-6">{item.desc}</p>

        <h3 className="font-display font-bold text-base mb-3">📋 Topics Covered</h3>
        <div className="flex flex-col gap-2 mb-6">
          {item.topics.map((t, i) => (
            <div key={i} className="flex items-center gap-3 bg-surface2 rounded-xl px-4 py-2.5 text-sm">
              <span className="text-accent2 font-bold">→</span>
              {t}
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex gap-2 flex-wrap mb-6">
          {item.tags.map(tag => (
            <span key={tag} className="text-xs bg-surface2 text-muted px-3 py-1 rounded-lg">{tag}</span>
          ))}
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            className="px-6 py-3 rounded-full text-white font-semibold text-sm transition-all hover:-translate-y-0.5"
            style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)`, boxShadow: `0 4px 20px ${accentColor}44` }}
            onClick={() => {
              onClose();
              navigate(isFuture ? `/future/${item.id}` : `/course/${item.id}`);
            }}
          >
            Start Learning →
          </button>
          <button onClick={onClose}
            className="px-6 py-3 rounded-full border border-border text-muted hover:text-white hover:border-accent2 font-semibold text-sm transition-all">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
