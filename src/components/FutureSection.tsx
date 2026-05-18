import type { Course } from '../types';
import { useCourseStore } from '../store/courses';

interface FutureSectionProps {
  onOpen: (id: string) => void;
}

export default function FutureSection({ onOpen }: FutureSectionProps) {
  const { futureTopics } = useCourseStore();

  return (
    <section id="future" className="py-24 bg-gradient-to-b from-surface to-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-accent/10 border border-accent/25 text-accent2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            🚀 Future Learning
          </span>
          <h2 className="font-display font-bold text-4xl mb-3">Beyond BCA – Practical Career Skills</h2>
          <p className="text-muted max-w-lg mx-auto">Industry-ready topics to master after (or alongside) your BCA degree. Tools real developers use every day.</p>
        </div>

        {/* Track badge */}
        <div className="flex items-center gap-4 bg-gradient-to-r from-accent/10 to-accent2/5 border border-accent/20 rounded-2xl px-6 py-4 mb-10 flex-wrap">
          <span className="bg-gradient-to-r from-accent to-accent2 text-white text-xs font-bold px-4 py-1.5 rounded-full">⭐ Career Track</span>
          <span className="text-muted text-sm">{futureTopics.length} Topics · 100% Free</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {futureTopics.map(topic => (
            <FutureCard key={topic.id} topic={topic} onClick={() => onOpen(topic.id)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FutureCard({ topic, onClick }: { topic: Course; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-surface border border-border rounded-2xl p-6 cursor-pointer card-hover hover:border-accent/50 fl-card-border relative overflow-hidden group"
      aria-label={topic.title}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-4xl">{topic.emoji || '🚀'}</span>
        <span className="text-xs font-semibold text-accent2 bg-accent/10 border border-accent/20 px-3 py-1 rounded-full">
          {topic.topics?.length || 0} modules
        </span>
      </div>

      <h3 className="font-display font-bold text-base mb-2 group-hover:text-accent2 transition-colors">{topic.title}</h3>
      <p className="text-muted text-xs leading-relaxed mb-4 line-clamp-2">{topic.desc || 'Future learning track'}</p>

      <div className="flex gap-1.5 flex-wrap mb-4">
        {topic.tags && topic.tags.slice(0, 3).map(t => (
          <span key={t} className="text-[10px] px-2 py-0.5 bg-surface2 text-muted rounded">{t}</span>
        ))}
      </div>

      {/* Color progress bar */}
      <div>
        <div className="h-1 bg-surface2 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all bg-accent" style={{ width: `${topic.progress || 0}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-muted mt-1.5">
          <span>{topic.progress || 0}% complete</span>
          <span className="group-hover:text-accent2 transition-colors">Explore →</span>
        </div>
      </div>
    </button>
  );
}