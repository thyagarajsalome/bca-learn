import { useParams, Link } from 'react-router-dom';
import { COURSES, FUTURE_TOPICS } from '../data';
import { ArrowLeft, PlayCircle, FileText, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CourseDetail({ type }: { type: 'bca' | 'future' }) {
  const { id } = useParams();

  const item = type === 'bca' 
    ? COURSES.find(c => c.id === id)
    : FUTURE_TOPICS.find(f => f.id === id);

  if (!item) {
    return (
      <div className="bg-bg text-white min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-display font-bold mb-4">Course not found</h1>
        <Link to="/" className="text-accent2 hover:underline">← Back to Home</Link>
      </div>
    );
  }

  const isFuture = type === 'future';
  const accentColor = isFuture ? (item as any).color : '#6366f1';

  return (
    <div className="bg-bg text-white min-h-screen flex flex-col">
      {/* We pass empty onSearchOpen for now, or you can implement search on this page too */}
      <Navbar onSearchOpen={() => {}} />

      <main className="flex-1 pt-28 pb-20 px-6 max-w-7xl mx-auto w-full">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors text-sm">
            <ArrowLeft size={16} /> Back to Library
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="mb-10">
              <span className="text-6xl block mb-6">{item.emoji}</span>
              <h1 className="font-display font-extrabold text-4xl md:text-5xl mb-4">{item.title}</h1>
              <p className="text-muted text-lg leading-relaxed">{item.desc}</p>
            </div>

            <div className="mb-10">
              <h2 className="font-display font-bold text-2xl mb-6 flex items-center gap-3">
                <span className="text-accent2">📚</span> Course Modules
              </h2>
              <div className="flex flex-col gap-4">
                {item.topics.map((topic, idx) => (
                  <div key={idx} className="bg-surface border border-border rounded-2xl p-5 hover:border-accent2 transition-all cursor-pointer group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-accent2 transition-colors">
                          {idx + 1}. {topic}
                        </h3>
                        <p className="text-sm text-muted">Includes 3 lessons • 45 mins</p>
                      </div>
                      {/* Fake completion circle */}
                      {idx === 0 ? (
                        <CheckCircle2 className="text-green-500" size={24} />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-border" />
                      )}
                    </div>
                    
                    {/* Mock lessons inside module */}
                    <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
                      <Link to={`/lesson/${type}/${id}/${idx}/0`} className="flex items-center gap-3 text-sm text-muted hover:text-accent2 transition-colors">
                        <PlayCircle size={16} className="text-accent2" /> Video Lecture (15m)
                      </Link>
                      <Link to={`/lesson/${type}/${id}/${idx}/1`} className="flex items-center gap-3 text-sm text-muted hover:text-blue-400 transition-colors">
                        <FileText size={16} className="text-blue-400" /> Study Notes
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-1">
            <div className="bg-surface border border-border rounded-2xl p-6 sticky top-28">
              <div className="mb-6">
                <div className="h-2 bg-surface2 rounded-full overflow-hidden mb-2">
                  <div className="h-full rounded-full transition-all" style={{ width: `${item.progress}%`, background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)` }} />
                </div>
                <div className="flex justify-between text-xs text-muted">
                  <span>{item.progress}% Completed</span>
                  <span>{item.lessons} Total Lessons</span>
                </div>
              </div>

              <Link 
                to={`/lesson/${type}/${id}/0/0`}
                className="flex items-center justify-center w-full py-4 rounded-xl text-white font-bold mb-6 transition-all hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)`, boxShadow: `0 4px 20px ${accentColor}44` }}
              >
                {item.progress > 0 ? 'Continue Learning' : 'Start Course'}
              </Link>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted">Track:</span>
                  <span className="font-semibold">{isFuture ? 'Future Learning' : 'BCA Curriculum'}</span>
                </div>
                {!isFuture && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted">Semesters:</span>
                    <span className="font-semibold">{(item as Course).sem.map(s => s.replace('sem','Sem ')).join(', ')}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted">Cost:</span>
                  <span className="font-semibold text-green-400">100% Free</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-sm font-semibold mb-3">Tags</p>
                <div className="flex gap-2 flex-wrap">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-1 bg-surface2 text-muted rounded uppercase tracking-wider">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
