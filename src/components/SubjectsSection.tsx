import { useState } from 'react';
import type { Course } from '../types';
import { COURSES } from '../data';

const BADGE_STYLES = {
  blue:  'bg-accent/15 text-accent2',
  green: 'bg-green-500/15 text-green-400',
  gold:  'bg-yellow-500/15 text-yellow-400',
  red:   'bg-red-500/15 text-red-400',
};

const FILTERS = ['all','sem1','sem2','sem3','sem4'];

interface SubjectsSectionProps {
  onOpenCourse: (id: string) => void;
}

export default function SubjectsSection({ onOpenCourse }: SubjectsSectionProps) {
  const [active, setActive] = useState('all');

  const visible = COURSES.filter(c => active === 'all' || c.sem.includes(active));

  return (
    <section id="subjects" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-accent/10 border border-accent/25 text-accent2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            📖 Core Subjects
          </span>
          <h2 className="font-display font-bold text-4xl mb-3">BCA Subject Library</h2>
          <p className="text-muted max-w-lg mx-auto">All 27 official IGNOU BCA courses, organized by semester. Click any course to explore topics and lessons.</p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {FILTERS.map(f => (
            <button key={f}
              onClick={() => setActive(f)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${
                active === f
                  ? 'bg-accent border-accent text-white shadow-lg shadow-accent/30'
                  : 'border-border text-muted hover:border-accent hover:text-accent2'
              }`}>
              {f === 'all' ? 'All Subjects' : f.replace('sem', 'Sem ')}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {visible.map(course => (
            <CourseCard key={course.id} course={course} onClick={() => onOpenCourse(course.id)} />
          ))}
        </div>

        {visible.length === 0 && (
          <p className="text-center text-muted py-16">No courses found.</p>
        )}
      </div>
    </section>
  );
}

function CourseCard({ course, onClick }: { course: Course; onClick: () => void }) {
  return (
    <article
      onClick={onClick}
      className="bg-surface border border-border rounded-2xl p-6 cursor-pointer card-hover hover:border-accent group relative overflow-hidden"
      aria-label={course.title}
    >
      {/* subtle bg gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-accent/5 pointer-events-none" />

      <div className="flex items-start justify-between mb-5">
        <span className="text-4xl leading-none">{course.emoji}</span>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${BADGE_STYLES[course.badge]}`}>
            {course.sem[0].replace('sem','Sem ')}
          </span>
          {course.isLab && (
            <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">Lab</span>
          )}
        </div>
      </div>

      <p className="text-[10px] font-mono text-muted mb-1">{course.code}</p>
      <h3 className="font-display font-bold text-base mb-2 leading-snug group-hover:text-accent2 transition-colors">{course.title}</h3>
      <p className="text-muted text-xs leading-relaxed mb-4 line-clamp-2">{course.desc}</p>

      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-1.5 flex-wrap">
          {course.tags.slice(0, 2).map(t => (
            <span key={t} className="text-[10px] px-2 py-0.5 bg-surface2 text-muted rounded">{t}</span>
          ))}
        </div>
        <span className="text-accent2 text-sm group-hover:translate-x-1 transition-transform">→</span>
      </div>

      {/* Progress */}
      <div>
        <div className="h-1 bg-surface2 rounded-full overflow-hidden">
          <div className="progress-fill" style={{ width: `${course.progress}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-muted mt-1.5">
          <span>{course.lessons} lessons</span>
          <span>{course.progress}% done</span>
        </div>
      </div>
    </article>
  );
}
