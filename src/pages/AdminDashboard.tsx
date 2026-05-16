import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/auth';
import { useCourseStore } from '../store/courses';
import { Lock, Save, FileText, Loader2, Trash2, Plus, BookOpen } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const { courses, futureTopics, fetchCourses } = useCourseStore();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'courses' | 'lessons'>('courses');
  
  // Course Form State
  const [cId, setCId] = useState('');
  const [cTitle, setCTitle] = useState('');
  const [cType, setCType] = useState('bca');
  const [cTopics, setCTopics] = useState(''); // Comma separated topics
  
  // Lesson Form State
  const [courseId, setCourseId] = useState('');
  const [moduleIdx, setModuleIdx] = useState('0');
  const [lessonIdx, setLessonIdx] = useState('0');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function checkAdmin() {
      if (!user) return setIsAdmin(false);
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      setIsAdmin(data?.role === 'admin');
    }
    checkAdmin();
    fetchCourses();
  }, [user]);

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const topicArray = cTopics.split(',').map(t => t.trim()).filter(Boolean);
      const { error } = await supabase.from('courses').upsert({
        id: cId,
        title: cTitle,
        type: cType,
        topics: topicArray,
        emoji: '📚', // Default emoji
        description: 'New Course'
      });
      if (error) throw error;
      setMessage('Course saved! You can now add lessons to it.');
      fetchCourses();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: existing } = await supabase.from('lessons')
        .select('id').eq('course_id', courseId).eq('module_idx', parseInt(moduleIdx)).eq('lesson_idx', parseInt(lessonIdx)).maybeSingle();

      if (existing) {
        await supabase.from('lessons').update({ title, content }).eq('id', existing.id);
      } else {
        await supabase.from('lessons').insert({
          course_id: courseId, module_idx: parseInt(moduleIdx), lesson_idx: parseInt(lessonIdx), title, content
        });
      }
      setMessage('Lesson saved successfully!');
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (isAdmin === null) return <div className="min-h-screen bg-bg flex items-center justify-center"><Loader2 className="animate-spin text-white" size={32} /></div>;
  if (!isAdmin) return <div className="min-h-screen bg-bg text-white flex flex-col items-center justify-center"><Lock size={48} className="text-red-400 mb-4" /><h1 className="text-3xl font-display font-bold">Access Denied</h1></div>;

  const allCourses = [...courses, ...futureTopics];

  return (
    <div className="min-h-screen bg-bg text-white flex flex-col">
      <Navbar onSearchOpen={() => {}} />
      <main className="flex-1 pt-28 pb-20 px-6 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-display font-bold mb-6">Admin Portal</h1>
        
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button onClick={() => {setActiveTab('courses'); setMessage('');}} className={`px-6 py-3 rounded-xl font-bold ${activeTab === 'courses' ? 'bg-accent text-white' : 'bg-surface2 text-muted'}`}>1. Manage Courses</button>
          <button onClick={() => {setActiveTab('lessons'); setMessage('');}} className={`px-6 py-3 rounded-xl font-bold ${activeTab === 'lessons' ? 'bg-accent text-white' : 'bg-surface2 text-muted'}`}>2. Manage Lessons</button>
        </div>

        {message && <div className="mb-6 p-4 rounded-xl text-sm font-semibold bg-green-400/10 text-green-400">{message}</div>}

        {/* Tab 1: Course Builder */}
        {activeTab === 'courses' && (
          <form onSubmit={handleSaveCourse} className="bg-surface border border-border p-6 rounded-2xl space-y-4">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><BookOpen size={20}/> Create or Edit Course Structure</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted uppercase mb-2">Course ID (e.g., BCS11)</label>
                <input required type="text" value={cId} onChange={e => setCId(e.target.value)} className="w-full bg-surface2 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent2" />
              </div>
              <div>
                <label className="block text-xs text-muted uppercase mb-2">Course Title</label>
                <input required type="text" value={cTitle} onChange={e => setCTitle(e.target.value)} className="w-full bg-surface2 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent2" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-muted uppercase mb-2">Type</label>
              <select value={cType} onChange={e => setCType(e.target.value)} className="w-full bg-surface2 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent2">
                <option value="bca">BCA Official Subject</option>
                <option value="future">Future Learning Track</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-muted uppercase mb-2">Modules / Topics (Comma Separated)</label>
              <textarea required value={cTopics} onChange={e => setCTopics(e.target.value)} placeholder="Introduction, Hardware, Software, Networking..." className="w-full bg-surface2 border border-border rounded-xl p-4 text-sm focus:border-accent2" />
              <p className="text-xs text-muted mt-1">This defines the structured order of your modules. "Introduction" will be Index 0, "Hardware" Index 1, etc.</p>
            </div>

            <button type="submit" disabled={saving} className="w-full py-4 mt-4 rounded-xl text-white font-bold bg-accent hover:bg-accent2 transition-all flex justify-center items-center gap-2">
              {saving ? <Loader2 size={18} className="animate-spin" /> : <><Plus size={18} /> Save Course Structure</>}
            </button>
          </form>
        )}

        {/* Tab 2: Lesson Editor */}
        {activeTab === 'lessons' && (
          <form onSubmit={handleSaveLesson} className="bg-surface border border-border p-6 rounded-2xl space-y-4">
             <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText size={20}/> Add Lesson Content</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-muted uppercase mb-2">Select Course</label>
                <select required value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full bg-surface2 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent2">
                  <option value="">-- Choose --</option>
                  {allCourses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted uppercase mb-2">Module Index</label>
                <input required type="number" min="0" value={moduleIdx} onChange={e => setModuleIdx(e.target.value)} className="w-full bg-surface2 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent2" />
              </div>
              <div>
                <label className="block text-xs text-muted uppercase mb-2">Lesson Index</label>
                <input required type="number" min="0" value={lessonIdx} onChange={e => setLessonIdx(e.target.value)} className="w-full bg-surface2 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent2" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-muted uppercase mb-2">Lesson Title</label>
              <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-surface2 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent2" />
            </div>

            <div>
              <label className="block text-xs text-muted uppercase mb-2">Markdown Content</label>
              <textarea value={content} onChange={e => setContent(e.target.value)} rows={10} className="w-full bg-surface2 border border-border rounded-xl p-4 text-sm font-mono focus:border-accent2" />
            </div>

            <button type="submit" disabled={saving} className="w-full py-4 mt-4 rounded-xl text-white font-bold bg-accent hover:bg-accent2 transition-all flex justify-center items-center gap-2">
              {saving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Save Lesson Content</>}
            </button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}