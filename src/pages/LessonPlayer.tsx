import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, PlayCircle, FileText, CheckCircle2, ChevronDown, MessageSquare, Download, Share2, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '../lib/supabase';
import { COURSES, FUTURE_TOPICS } from '../data';

export default function LessonPlayer() {
  const { track, id, moduleIdx, lessonIdx } = useParams();
  
  const course = track === 'future' 
    ? FUTURE_TOPICS.find(f => f.id === id)
    : COURSES.find(c => c.id === id);

  const [activeTab, setActiveTab] = useState('overview');
  const [openModules, setOpenModules] = useState<number[]>([Number(moduleIdx) || 0]);
  const [dbLesson, setDbLesson] = useState<any>(null);
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
        .single();
      
      setDbLesson(data);
      setLoadingLesson(false);
    }
    if (id) fetchLesson();
  }, [id, moduleIdx, lessonIdx]);

  if (!course) {
    return <div className="p-20 text-center text-white">Course not found.</div>;
  }

  const toggleModule = (idx: number) => {
    setOpenModules(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  const accentColor = track === 'future' ? (course as any).color : '#6366f1';

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
            {course.progress}% Completed
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Area: Video Player & Tabs */}
        <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
          
          {/* Video Player Placeholder */}
          <div className="bg-black w-full aspect-video relative group flex items-center justify-center border-b border-border shrink-0">
            {/* Fake video background */}
            <div className="absolute inset-0 bg-gradient-to-br from-surface to-bg opacity-50" />
            
            <button className="relative z-10 w-20 h-20 bg-accent/90 rounded-full flex items-center justify-center text-white transform group-hover:scale-110 transition-all shadow-[0_0_40px_rgba(99,102,241,0.5)]">
              <PlayCircle size={40} className="ml-1" />
            </button>
            
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="h-1 bg-surface2/50 w-full rounded-full overflow-hidden mr-4">
                <div className="h-full bg-accent w-1/3 rounded-full" />
              </div>
              <span className="text-xs font-mono">05:24 / 15:00</span>
            </div>
          </div>

          {/* Content Area Below Video */}
          <div className="p-6 max-w-4xl mx-auto w-full">
            <h2 className="font-display font-bold text-2xl mb-4">
              Module {Number(moduleIdx) + 1}: {course.topics[Number(moduleIdx)] || 'Introduction'}
            </h2>
            
            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-border mb-6">
              {['overview', 'notes', 'q&a', 'downloads'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-semibold capitalize transition-all border-b-2 ${
                    activeTab === tab 
                      ? 'text-accent2 border-accent2' 
                      : 'text-muted border-transparent hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="text-muted text-sm leading-relaxed min-h-[300px]">
              {activeTab === 'overview' && (
                <div className="animate-fade-up">
                  {loadingLesson ? (
                    <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin" /></div>
                  ) : dbLesson?.content ? (
                    <div className="prose prose-invert prose-accent max-w-none mb-8">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {dbLesson.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <>
                      <p className="mb-4">In this lesson, we will cover the foundational aspects of {course.topics[Number(moduleIdx)]}. You'll learn the key concepts, see practical examples, and understand how it applies to real-world scenarios.</p>
                      <h4 className="text-white font-bold mb-2">Learning Objectives:</h4>
                      <ul className="list-disc pl-5 space-y-1 mb-6">
                        <li>Understand the core principles.</li>
                        <li>Apply basic techniques to solve problems.</li>
                        <li>Recognize common pitfalls and best practices.</li>
                      </ul>
                    </>
                  )}
                  
                  <div className="flex gap-3 pt-6 border-t border-border mt-8">
                    <button className="flex items-center gap-2 bg-surface2 px-4 py-2 rounded-lg text-white hover:bg-surface border border-border">
                      <Share2 size={16} /> Share
                    </button>
                    <button className="flex items-center gap-2 bg-surface2 px-4 py-2 rounded-lg text-white hover:bg-surface border border-border">
                      <MessageSquare size={16} /> Ask a Question
                    </button>
                  </div>
                </div>
              )}
              {activeTab === 'notes' && (
                <div className="animate-fade-up bg-surface border border-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
                    <h4 className="text-white font-bold flex items-center gap-2"><FileText size={18}/> Official Study Notes</h4>
                    <button className="text-accent2 hover:underline flex items-center gap-1 text-xs"><Download size={14}/> Download PDF</button>
                  </div>
                  {loadingLesson ? (
                    <div className="flex items-center justify-center py-10"><Loader2 className="animate-spin" /></div>
                  ) : dbLesson?.content ? (
                    <div className="prose prose-invert prose-accent max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {dbLesson.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <>
                      <p className="font-mono text-xs opacity-70 mb-4">// Notes placeholder for {course.topics[Number(moduleIdx)]}</p>
                      <p>1. Always start with the definition.<br/>2. Look at the properties.<br/>3. Memorize the syntax.</p>
                    </>
                  )}
                </div>
              )}
              {activeTab === 'q&a' && (
                <div className="animate-fade-up text-center py-10">
                  <MessageSquare size={40} className="mx-auto mb-4 opacity-20" />
                  <p>No questions yet. Be the first to ask!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Area: Playlist Sidebar */}
        <div className="w-80 lg:w-96 bg-surface border-l border-border flex flex-col shrink-0 overflow-hidden">
          <div className="p-4 border-b border-border bg-surface flex items-center justify-between shrink-0">
            <h3 className="font-bold text-sm">Course Content</h3>
            <span className="text-xs text-muted">1 / {course.topics.length}</span>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {course.topics.map((topic, mIdx) => {
              const isOpen = openModules.includes(mIdx);
              const isActiveModule = mIdx === Number(moduleIdx);
              
              return (
                <div key={mIdx} className="border-b border-border">
                  {/* Module Header */}
                  <button 
                    onClick={() => toggleModule(mIdx)}
                    className={`w-full flex items-start justify-between p-4 text-left transition-colors hover:bg-surface2 ${isOpen ? 'bg-surface2/50' : ''}`}
                  >
                    <div className="pr-4">
                      <h4 className={`text-sm font-semibold mb-1 ${isActiveModule ? 'text-white' : 'text-muted'}`}>
                        {mIdx + 1}. {topic}
                      </h4>
                      <p className="text-[10px] text-muted">2 lessons • 30m</p>
                    </div>
                    <ChevronDown size={16} className={`text-muted transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Module Lessons */}
                  {isOpen && (
                    <div className="bg-bg py-2">
                      {/* Lesson 1: Video */}
                      <Link 
                        to={`/lesson/${track}/${id}/${mIdx}/0`}
                        className={`flex items-start gap-3 px-4 py-2.5 hover:bg-surface2 transition-colors group ${isActiveModule && Number(lessonIdx) === 0 ? 'bg-accent/10 border-l-2 border-accent' : 'border-l-2 border-transparent'}`}
                      >
                        <PlayCircle size={16} className={`mt-0.5 shrink-0 ${isActiveModule && Number(lessonIdx) === 0 ? 'text-accent2' : 'text-muted group-hover:text-white'}`} />
                        <div>
                          <p className={`text-xs ${isActiveModule && Number(lessonIdx) === 0 ? 'text-white font-medium' : 'text-muted group-hover:text-white'}`}>
                            1. Video Lecture
                          </p>
                          <p className="text-[10px] text-muted mt-0.5">15:00</p>
                        </div>
                        {mIdx === 0 && <CheckCircle2 size={14} className="text-green-500 ml-auto" />}
                      </Link>

                      {/* Lesson 2: Notes */}
                      <Link 
                        to={`/lesson/${track}/${id}/${mIdx}/1`}
                        className={`flex items-start gap-3 px-4 py-2.5 hover:bg-surface2 transition-colors group ${isActiveModule && Number(lessonIdx) === 1 ? 'bg-accent/10 border-l-2 border-accent' : 'border-l-2 border-transparent'}`}
                      >
                        <FileText size={16} className={`mt-0.5 shrink-0 ${isActiveModule && Number(lessonIdx) === 1 ? 'text-accent2' : 'text-muted group-hover:text-white'}`} />
                        <div>
                          <p className={`text-xs ${isActiveModule && Number(lessonIdx) === 1 ? 'text-white font-medium' : 'text-muted group-hover:text-white'}`}>
                            2. Study Notes
                          </p>
                          <p className="text-[10px] text-muted mt-0.5">10 min read</p>
                        </div>
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
