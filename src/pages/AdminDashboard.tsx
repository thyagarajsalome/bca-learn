import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/auth';
import { COURSES, FUTURE_TOPICS } from '../data';
import { Lock, Save, FileText, Loader2, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  
  // Form State
  const [courseId, setCourseId] = useState(COURSES[0].id);
  const [moduleIdx, setModuleIdx] = useState('0');
  const [lessonIdx, setLessonIdx] = useState('0');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Check if user is admin
  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      setIsAdmin(data?.role === 'admin');
    }
    checkAdmin();
  }, [user]);

  const [deleting, setDeleting] = useState(false);

  // Load existing lesson content when selection changes
  useEffect(() => {
    async function fetchLesson() {
      if (!isAdmin) return;
      setMessage('');
      const { data } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .eq('module_idx', parseInt(moduleIdx))
        .eq('lesson_idx', parseInt(lessonIdx))
        .maybeSingle();
      
      if (data) {
        setTitle(data.title);
        setContent(data.content || '');
      } else {
        setTitle('');
        setContent('');
      }
    }
    fetchLesson();
  }, [courseId, moduleIdx, lessonIdx, isAdmin]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    setDeleting(true);
    setMessage('');
    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('course_id', courseId)
        .eq('module_idx', parseInt(moduleIdx))
        .eq('lesson_idx', parseInt(lessonIdx));

      if (error) throw error;
      setMessage('Lesson deleted successfully!');
      setTitle('');
      setContent('');
    } catch (err: unknown) {
      setMessage(`Error: ${(err as Error).message}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      // Check if it already exists
      const { data: existing } = await supabase
        .from('lessons')
        .select('id')
        .eq('course_id', courseId)
        .eq('module_idx', parseInt(moduleIdx))
        .eq('lesson_idx', parseInt(lessonIdx))
        .maybeSingle();

      let error;
      if (existing) {
        const res = await supabase
          .from('lessons')
          .update({ title, content })
          .eq('id', existing.id);
        error = res.error;
      } else {
        const res = await supabase
          .from('lessons')
          .insert({
            course_id: courseId,
            module_idx: parseInt(moduleIdx),
            lesson_idx: parseInt(lessonIdx),
            title,
            content
          });
        error = res.error;
      }

      if (error) throw error;
      setMessage('Lesson saved successfully!');
    } catch (err: unknown) {
      setMessage(`Error: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  if (isAdmin === null) {
    return <div className="min-h-screen bg-bg flex items-center justify-center text-white"><Loader2 className="animate-spin" size={32} /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-bg text-white flex flex-col items-center justify-center">
        <Lock size={48} className="text-red-400 mb-4" />
        <h1 className="text-3xl font-display font-bold">Access Denied</h1>
        <p className="text-muted mt-2">You do not have permission to view this page. You must be an Admin.</p>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-bg text-white flex flex-col">
      <Navbar onSearchOpen={() => {}} />
      
      <main className="flex-1 pt-28 pb-20 px-6 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-accent2/20 flex items-center justify-center text-accent2">
            <Lock size={20} />
          </div>
          <h1 className="text-3xl font-display font-bold">Admin Portal: Manage Lessons</h1>
        </div>

        <form onSubmit={handleSave} className="bg-surface border border-border p-6 rounded-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase mb-2">Select Course</label>
              <select 
                value={courseId} 
                onChange={e => setCourseId(e.target.value)}
                className="w-full bg-surface2 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent2"
              >
                <optgroup label="BCA Official">
                  {COURSES.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </optgroup>
                <optgroup label="Future Learning">
                  {FUTURE_TOPICS.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
                </optgroup>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted uppercase mb-2">Module Index (0-based)</label>
              <input 
                type="number" min="0" value={moduleIdx} onChange={e => setModuleIdx(e.target.value)}
                className="w-full bg-surface2 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted uppercase mb-2">Lesson Index (0-based)</label>
              <input 
                type="number" min="0" value={lessonIdx} onChange={e => setLessonIdx(e.target.value)}
                className="w-full bg-surface2 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent2"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase mb-2">Lesson Title</label>
            <input 
              type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g., Introduction to Arrays"
              className="w-full bg-surface2 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent2"
            />
          </div>



          <div>
            <label className="block text-xs font-semibold text-muted uppercase mb-2">Markdown Content (Notes & Text)</label>
            <textarea 
              value={content} onChange={e => setContent(e.target.value)}
              rows={15}
              placeholder="# Introduction\n\nWrite your lesson content here using Markdown formatting..."
              className="w-full bg-surface2 border border-border rounded-xl p-4 text-sm font-mono focus:outline-none focus:border-accent2 custom-scrollbar"
            />
            <p className="text-xs text-muted mt-2 flex items-center gap-1"><FileText size={12}/> Supports full GitHub Flavored Markdown (Headers, Code blocks, Lists, Tables).</p>
          </div>

          {message && (
            <div className={`p-4 rounded-xl text-sm font-semibold ${message.includes('Error') ? 'bg-red-400/10 text-red-400' : 'bg-green-400/10 text-green-400'}`}>
              {message}
            </div>
          )}

          <div className="flex gap-4">
            <button 
              type="submit" disabled={saving || deleting}
              className="flex-1 py-4 rounded-xl text-white font-bold transition-all hover:-translate-y-0.5 disabled:opacity-50 flex justify-center items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Save Lesson Content</>}
            </button>

            <button 
              type="button" 
              onClick={handleDelete}
              disabled={saving || deleting}
              className="py-4 px-6 rounded-xl text-red-400 font-bold transition-all hover:bg-red-400/10 disabled:opacity-50 flex justify-center items-center gap-2 border border-red-400/20"
            >
              {deleting ? <Loader2 size={18} className="animate-spin" /> : <><Trash2 size={18} /> Delete</>}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
