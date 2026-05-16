import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle2, ChevronDown, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '../lib/supabase';
import { useCourseStore } from '../store/courses'; // <-- Import the new store

export default function LessonPlayer() {
  const { track, id, moduleIdx, lessonIdx } = useParams();
  
  // Pull live data from Supabase via Zustand
  const { courses, futureTopics, fetchCourses, loading } = useCourseStore();

  // If a user navigates here directly via URL, fetch courses if they aren't loaded
  useEffect(() => {
    if (courses.length === 0 && futureTopics.length === 0) {
      fetchCourses();
    }
  }, [courses.length, futureTopics.length, fetchCourses]);

  const course = track === 'future' 
    ? futureTopics.find(f => f.id === id)
    : courses.find(c => c.id === id);

  const [openModules, setOpenModules] = useState<number[]>([Number(moduleIdx) || 0]);
  const [dbLesson, setDbLesson] = useState<{ content?: string; title?: string } | null>(null);
  const [loadingLesson, setLoadingLesson] = useState(true);

  useEffect(() => {
    async function fetchLesson() {
      setLoadingLesson(true);
      const { data } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', id)
        .eq('module_idx', parseInt(moduleIdx || '0'))
        .eq('lesson_idx', parseInt(lessonIdx || '0'))
        .maybeSingle();
      
      setDbLesson(data);
      setLoadingLesson(false);
    }
    if (id) fetchLesson();
  }, [id, moduleIdx, lessonIdx]);

  if (loading) {
    return (
      <div className="bg-bg text-white min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-accent2" size={40} />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-bg text-white min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Course not found</h1>
        <Link to="/" className="text-accent2 hover:underline">← Back to Home</Link>
      </div>
    );
  }

  const toggleModule = (idx: number) => {
    setOpenModules(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  const accentColor = track === 'future' ? '#10b981' : '#6366f1';
  
  // Safety fallbacks for database arrays
  const topics = course.topics || [];
  const progress = course.progress || 0;

  return (
    <div className="bg-bg text-white min-h-screen flex flex-col overflow-hidden h-screen">
      {/* Top Navigation */}
      <nav className="h-16 border-b border-border bg-surface flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link to={`/${track === 'future' ? 'future' : 'course'}/${id}`} className="p-2 -ml-2 rounded-lg text-muted hover:text-white hover:bg-surface2 transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div className="w-px h-6 bg-border" />
          <h1 className="font-display font-bold text-sm truncate max-w-md hidden md:block">
            {course.title}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-muted font-medium bg-surface2 px-3 py-1.5 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
            {progress}% Completed
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Area: Markdown Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-8 md:p-12 max-w-5xl mx-auto w-full">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-8 pb-6 border-b border-border">
              Module {Number(moduleIdx) + 1}: {topics[Number(moduleIdx)] || 'Introduction'}
            </h2>
            
            <div className="animate-fade-up">
              {loadingLesson ? (
                <div className="flex flex-col items-center justify-center py-32 text-muted">
                  <Loader2 size={48} className="animate-spin mb-4 text-accent" />
                  <p>Loading lesson content...</p>
                </div>
              ) : dbLesson?.content ? (
                <div className="prose prose-invert prose-accent max-w-none pb-20">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {dbLesson.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="text-center py-20 bg-surface border border-border rounded-2xl">
                  <FileText size={48} className="mx-auto text-muted mb-4 opacity-50" />
                  <h3 className="text-xl font-bold mb-2">Content Not Available</h3>
                  <p className="text-muted">The instructor has not added markdown notes for this lesson yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Area: Playlist Sidebar */}
        <div className="w-80 lg:w-96 bg-surface border-l border-border flex flex-col shrink-0 overflow-hidden">
          <div className="p-4 border-b border-border bg-surface flex items-center justify-between shrink-0">
            <h3 className="font-bold text-sm">Course Content</h3>
            <span className="text-xs text-muted">1 / {topics.length || 0}</span>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {topics.length === 0 && (
              <p className="text-muted text-sm text-center p-6">No modules available.</p>
            )}
            {topics.map((topic, mIdx) => {
              const isOpen = openModules.includes(mIdx);
              const isActiveModule = mIdx === Number(moduleIdx);
              
              return (
                <div key={mIdx} className="border-b border-border">
                  <button 
                    onClick={() => toggleModule(mIdx)}
                    className={`w-full flex items-start justify-between p-4 text-left transition-colors hover:bg-surface2 ${isOpen ? 'bg-surface2/50' : ''}`}
                  >
                    <div className="pr-4">
                      <h4 className={`text-sm font-semibold mb-1 ${isActiveModule ? 'text-white' : 'text-muted'}`}>
                        {mIdx + 1}. {topic}
                      </h4>
                      <p className="text-[10px] text-muted">Reading Materials</p>
                    </div>
                    <ChevronDown size={16} className={`text-muted transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="bg-bg py-2">
                      <Link 
                        to={`/lesson/${track}/${id}/${mIdx}/0`}
                        className={`flex items-start gap-3 px-4 py-2.5 hover:bg-surface2 transition-colors group ${isActiveModule && Number(lessonIdx) === 0 ? 'bg-accent/10 border-l-2 border-accent' : 'border-l-2 border-transparent'}`}
                      >
                        <FileText size={16} className={`mt-0.5 shrink-0 ${isActiveModule && Number(lessonIdx) === 0 ? 'text-accent2' : 'text-muted group-hover:text-white'}`} />
                        <div>
                          <p className={`text-xs ${isActiveModule && Number(lessonIdx) === 0 ? 'text-white font-medium' : 'text-muted group-hover:text-white'}`}>
                            Lesson Content
                          </p>
                          <p className="text-[10px] text-muted mt-0.5">Reading</p>
                        </div>
                        {mIdx === 0 && <CheckCircle2 size={14} className="text-green-500 ml-auto" />}
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}