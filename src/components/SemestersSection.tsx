import { SEMESTERS, COURSES } from '../data';

interface SemestersSectionProps {
  onOpenCourse: (id: string) => void;
}

export default function SemestersSection({ onOpenCourse }: SemestersSectionProps) {
  return (
    <section id="semesters" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-accent/10 border border-accent/25 text-accent2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            🗓️ Semester Plan
          </span>
          <h2 className="font-display font-bold text-4xl mb-3">BCA Semester-wise Syllabus</h2>
          <p className="text-muted max-w-lg mx-auto">Navigate the complete BCA curriculum semester by semester. Click any course to explore.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {SEMESTERS.map(sem => {
            const courses = sem.subjects.map(id => COURSES.find(c => c.id === id)).filter(Boolean);
            const theory = courses.filter(c => !c!.isLab);
            const labs   = courses.filter(c => c!.isLab);
            return (
              <div key={sem.num} className="bg-surface border border-border rounded-2xl p-6 hover:border-accent/50 transition-colors">
                {/* Semester Header */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-display font-black text-lg"
                       style={{ background: sem.bg, color: sem.color }}>
                    {sem.num}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg">Semester {sem.num}</h3>
                    <p className="text-muted text-sm">{sem.label} · {courses.length} courses</p>
                  </div>
                </div>

                {/* Theory Courses */}
                {theory.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Theory</p>
                    <div className="flex flex-col gap-2">
                      {theory.map(c => (
                        <button key={c!.id} onClick={() => onOpenCourse(c!.id)}
                          className="flex items-center gap-3 bg-surface2 hover:bg-accent/8 rounded-xl px-3 py-2.5 text-sm text-left transition-colors group">
                          <span className="text-base">{c!.emoji}</span>
                          <span className="flex-1 font-medium text-xs leading-snug group-hover:text-accent2 transition-colors">{c!.title}</span>
                          <span className="text-[10px] font-mono text-muted">{c!.code}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lab Courses */}
                {labs.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Practicals / Labs</p>
                    <div className="flex flex-col gap-2">
                      {labs.map(c => (
                        <button key={c!.id} onClick={() => onOpenCourse(c!.id)}
                          className="flex items-center gap-3 bg-green-500/5 hover:bg-green-500/10 border border-green-500/15 rounded-xl px-3 py-2.5 text-sm text-left transition-colors group">
                          <span className="text-base">{c!.emoji}</span>
                          <span className="flex-1 font-medium text-xs leading-snug group-hover:text-green-400 transition-colors">{c!.title}</span>
                          <span className="text-[10px] font-mono text-muted">{c!.code}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
