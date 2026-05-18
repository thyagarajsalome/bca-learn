import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/auth';
import { useCourseStore } from '../store/courses';
import { 
  Lock, Save, FileText, Loader2, Trash2, Plus, 
  BookOpen, LayoutDashboard, Image as ImageIcon, 
  Settings, LogOut, UploadCloud
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, signOut } = useAuthStore();
  const { courses, futureTopics, fetchCourses } = useCourseStore();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'courses' | 'lessons'>('dashboard');
  
  // Course State
  const [cId, setCId] = useState('');
  const [cTitle, setCTitle] = useState('');
  const [cType, setCType] = useState('bca');
  const [cTopics, setCTopics] = useState(''); 
  const [cEmoji, setCEmoji] = useState('📚');
  const [cDesc, setCDesc] = useState('');
  const [cImageUrl, setCImageUrl] = useState('');
  
  // Lesson State
  const [courseId, setCourseId] = useState('');
  const [moduleIdx, setModuleIdx] = useState('0');
  const [lessonIdx, setLessonIdx] = useState('0');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function checkAdmin() {
      if (!user) return setIsAdmin(false);
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      setIsAdmin(data?.role === 'admin');
    }
    checkAdmin();
    fetchCourses();
  }, [user, fetchCourses]);

  // --- Handlers ---

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('bca-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('bca-media').getPublicUrl(filePath);
      
      // If we are on the lessons tab, append to markdown content. Otherwise, set as featured image.
      if (activeMenu === 'lessons') {
        setContent(prev => prev + `\n\n![Image](${data.publicUrl})\n`);
        setMessage({ text: 'Image inserted into content!', type: 'success' });
      } else if (activeMenu === 'courses') {
        setCImageUrl(data.publicUrl);
        setMessage({ text: 'Featured image uploaded!', type: 'success' });
      }
    } catch (error: any) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const topicArray = cTopics.split(',').map(t => t.trim()).filter(Boolean);
      const { error } = await supabase.from('courses').upsert({
        id: cId, title: cTitle, type: cType, topics: topicArray, 
        emoji: cEmoji, description: cDesc, image_url: cImageUrl
      });
      if (error) throw error;
      setMessage({ text: 'Course published successfully.', type: 'success' });
      fetchCourses();
      
      // Reset form
      setCId(''); setCTitle(''); setCTopics(''); setCDesc(''); setCImageUrl('');
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Move to Trash? This will permanently delete the course and all associated lessons.')) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
      setMessage({ text: 'Course moved to trash.', type: 'success' });
      fetchCourses();
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: existing, error: fetchError } = await supabase.from('lessons')
        .select('id').eq('course_id', courseId).eq('module_idx', parseInt(moduleIdx)).eq('lesson_idx', parseInt(lessonIdx)).maybeSingle();

      if (fetchError) throw fetchError;

      if (existing) {
        const { error } = await supabase.from('lessons').update({ title, content }).eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('lessons').insert({
          course_id: courseId, module_idx: parseInt(moduleIdx), lesson_idx: parseInt(lessonIdx), title, content
        });
        if (error) throw error;
      }
      setMessage({ text: 'Lesson updated.', type: 'success' });
      setTitle(''); setContent(''); // reset
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // --- Render Checks ---

  if (isAdmin === null) return <div className="min-h-screen bg-[#f0f0f1] flex items-center justify-center"><Loader2 className="animate-spin text-accent" size={32} /></div>;
  if (!isAdmin) return <div className="min-h-screen bg-[#f0f0f1] text-[#1d2327] flex flex-col items-center justify-center"><Lock size={48} className="text-red-600 mb-4" /><h1 className="text-3xl font-display font-bold">You need administrative privileges.</h1></div>;

  const allCourses = [...courses, ...futureTopics] as Array<{ id: string; title: string; type?: string }>;

  return (
    <div className="min-h-screen bg-[#f0f0f1] text-[#3c434a] flex font-sans">
      
      {/* WP Top Admin Bar */}
      <div className="fixed top-0 left-0 right-0 h-8 bg-[#1d2327] text-[#f0f0f1] flex items-center justify-between px-4 z-50 text-[13px]">
        <div className="flex items-center gap-4">
          <a href="/" className="hover:text-[#72aee6] transition-colors flex items-center gap-1 font-semibold">
            <BookOpen size={14} /> BCA Learn
          </a>
          <span className="text-[#a7aaad] hover:text-[#72aee6] cursor-pointer flex items-center gap-1">
            <Plus size={14}/> New
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>Howdy, {user?.email}</span>
          <img src={`https://ui-avatars.com/api/?name=${user?.email}&background=random`} alt="avatar" className="w-5 h-5 rounded-full" />
        </div>
      </div>

      {/* WP Sidebar */}
      <div className="fixed top-8 left-0 bottom-0 w-40 md:w-48 bg-[#1d2327] text-white z-40 overflow-y-auto">
        <ul className="mt-4 flex flex-col">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'courses', icon: BookOpen, label: 'Courses' },
            { id: 'lessons', icon: FileText, label: 'Lessons' },
          ].map(menu => (
            <li key={menu.id}>
              <button 
                onClick={() => { setActiveMenu(menu.id as any); setMessage(null); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${activeMenu === menu.id ? 'bg-[#2271b1] text-white font-semibold' : 'text-[#a7aaad] hover:text-[#72aee6] hover:bg-[#2c3338]'}`}
              >
                <menu.icon size={18} />
                {menu.label}
              </button>
            </li>
          ))}
          <div className="h-px bg-[#2c3338] my-2 mx-4" />
          <li>
            <button onClick={() => { signOut(); window.location.href = '/'; }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#a7aaad] hover:text-red-400 hover:bg-[#2c3338] transition-colors">
              <LogOut size={18} /> Log Out
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <main className="ml-40 md:ml-48 pt-8 p-4 md:p-8 flex-1 w-full max-w-6xl">
        
        {message && (
          <div className={`mb-6 p-3 border-l-4 text-[13px] bg-white shadow-sm ${message.type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
            <p className="font-semibold text-black">{message.text}</p>
          </div>
        )}

        {/* --- DASHBOARD VIEW --- */}
        {activeMenu === 'dashboard' && (
          <div>
            <h1 className="text-2xl font-normal text-[#1d2327] mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-[#c3c4c7] shadow-sm">
                <div className="border-b border-[#c3c4c7] p-3 font-semibold text-[14px]">At a Glance</div>
                <div className="p-4 text-[13px]">
                  <ul className="flex flex-col gap-2">
                    <li className="flex items-center gap-2"><BookOpen size={16} className="text-[#2271b1]"/> {courses.length} BCA Courses</li>
                    <li className="flex items-center gap-2"><FileText size={16} className="text-[#2271b1]"/> {futureTopics.length} Future Topics</li>
                  </ul>
                  <p className="mt-4 text-[#646970]">Astro running BCA Learn Dashboard.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- COURSES VIEW --- */}
        {activeMenu === 'courses' && (
          <div>
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-2xl font-normal text-[#1d2327]">Add New Course</h1>
            </div>

            <form onSubmit={handleSaveCourse} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Column */}
              <div className="lg:col-span-2 space-y-4">
                <input 
                  required type="text" value={cTitle} onChange={e => setCTitle(e.target.value)} 
                  placeholder="Add title" 
                  className="w-full text-xl px-4 py-2 border border-[#8c8f94] shadow-sm focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none rounded-none" 
                />
                
                <div className="bg-white border border-[#c3c4c7] shadow-sm p-4">
                  <label className="block text-[13px] font-semibold mb-2">Description</label>
                  <textarea 
                    value={cDesc} onChange={e => setCDesc(e.target.value)} rows={4}
                    className="w-full border border-[#8c8f94] p-2 text-[14px] focus:border-[#2271b1] outline-none" 
                  />
                  
                  <label className="block text-[13px] font-semibold mt-4 mb-2">Modules (Comma Separated)</label>
                  <textarea 
                    required value={cTopics} onChange={e => setCTopics(e.target.value)} rows={3}
                    placeholder="Introduction, Module 1, Module 2..." 
                    className="w-full border border-[#8c8f94] p-2 text-[14px] focus:border-[#2271b1] outline-none" 
                  />
                </div>
              </div>

              {/* Sidebar Column */}
              <div className="space-y-4">
                {/* Publish Box */}
                <div className="bg-white border border-[#c3c4c7] shadow-sm">
                  <div className="border-b border-[#c3c4c7] p-3 font-semibold text-[14px]">Publish</div>
                  <div className="p-3 text-[13px] space-y-3 bg-[#f6f7f7]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#646970]">Status: <b>Draft</b></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#646970]">Visibility: <b>Public</b></span>
                    </div>
                  </div>
                  <div className="p-3 border-t border-[#c3c4c7] bg-[#f6f7f7] flex justify-end">
                    <button type="submit" disabled={saving} className="bg-[#2271b1] text-white px-4 py-1.5 rounded text-[13px] hover:bg-[#135e96] transition-colors flex items-center gap-2">
                      {saving ? <Loader2 size={14} className="animate-spin" /> : 'Publish'}
                    </button>
                  </div>
                </div>

                {/* Course Attributes */}
                <div className="bg-white border border-[#c3c4c7] shadow-sm">
                  <div className="border-b border-[#c3c4c7] p-3 font-semibold text-[14px]">Course Attributes</div>
                  <div className="p-3 space-y-3">
                    <div>
                      <label className="block text-[13px] mb-1">Course Code (ID)</label>
                      <input required type="text" value={cId} onChange={e => setCId(e.target.value)} className="w-full border border-[#8c8f94] px-2 py-1 text-[13px]" />
                    </div>
                    <div>
                      <label className="block text-[13px] mb-1">Track</label>
                      <select value={cType} onChange={e => setCType(e.target.value)} className="w-full border border-[#8c8f94] px-2 py-1 text-[13px] bg-white">
                        <option value="bca">BCA Subject</option>
                        <option value="future">Future Learning</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[13px] mb-1">Emoji Icon</label>
                      <input type="text" value={cEmoji} onChange={e => setCEmoji(e.target.value)} className="w-full border border-[#8c8f94] px-2 py-1 text-[13px]" />
                    </div>
                  </div>
                </div>

                {/* Featured Image */}
                <div className="bg-white border border-[#c3c4c7] shadow-sm">
                  <div className="border-b border-[#c3c4c7] p-3 font-semibold text-[14px]">Featured Image</div>
                  <div className="p-3">
                    {cImageUrl ? (
                      <div className="relative group cursor-pointer" onClick={() => setCImageUrl('')}>
                        <img src={cImageUrl} alt="Featured" className="w-full h-auto" />
                        <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-xs">Remove Image</div>
                      </div>
                    ) : (
                      <>
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[#2271b1] text-[13px] hover:underline flex items-center gap-1">
                          {uploading ? <Loader2 size={14} className="animate-spin" /> : 'Set featured image'}
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </form>

            <div className="mt-8 bg-white border border-[#c3c4c7] shadow-sm">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-[#c3c4c7]">
                    <th className="p-2 pl-4 font-semibold w-2/3">Title</th>
                    <th className="p-2 font-semibold">Code</th>
                    <th className="p-2 font-semibold">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {allCourses.map((c, i) => (
                    <tr key={c.id} className={`border-b border-[#c3c4c7] group ${i % 2 === 0 ? 'bg-[#f6f7f7]' : 'bg-white'}`}>
                      <td className="p-2 pl-4 font-semibold text-[#2271b1]">
                        {c.title}
                        <div className="text-[12px] font-normal text-[#a7aaad] hidden group-hover:flex gap-2 mt-1">
                          <span className="text-red-600 cursor-pointer hover:underline" onClick={() => handleDeleteCourse(c.id)}>Trash</span>
                        </div>
                      </td>
                      <td className="p-2">{c.id}</td>
                      <td className="p-2 capitalize">{c.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- LESSONS VIEW --- */}
        {activeMenu === 'lessons' && (
          <div>
             <div className="flex items-center gap-4 mb-4">
              <h1 className="text-2xl font-normal text-[#1d2327]">Edit Lesson Content</h1>
            </div>

            <form onSubmit={handleSaveLesson} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 space-y-4">
                <input 
                  required type="text" value={title} onChange={e => setTitle(e.target.value)} 
                  placeholder="Enter lesson title here" 
                  className="w-full text-xl px-4 py-2 border border-[#8c8f94] shadow-sm focus:border-[#2271b1] outline-none" 
                />
                
                <div className="bg-white border border-[#c3c4c7] shadow-sm">
                  {/* Fake rich text toolbar */}
                  <div className="bg-[#f0f0f1] border-b border-[#c3c4c7] p-2 flex gap-2">
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 bg-white border border-[#8c8f94] px-2 py-1 text-[13px] rounded hover:border-[#2271b1]">
                      {uploading ? <Loader2 size={14} className="animate-spin" /> : <><ImageIcon size={14} /> Add Media</>}
                    </button>
                    <div className="text-[12px] text-[#646970] pt-1 ml-auto">Markdown Supported</div>
                  </div>
                  
                  <textarea 
                    value={content} onChange={e => setContent(e.target.value)} 
                    rows={18}
                    placeholder="Start writing your lesson content in markdown..."
                    className="w-full p-4 font-mono text-[14px] bg-white focus:outline-none" 
                  />
                </div>
              </div>

              <div className="space-y-4">
                {/* Publish Box */}
                <div className="bg-white border border-[#c3c4c7] shadow-sm">
                  <div className="border-b border-[#c3c4c7] p-3 font-semibold text-[14px]">Publish</div>
                  <div className="p-3 border-t border-[#c3c4c7] bg-[#f6f7f7] flex justify-end">
                    <button type="submit" disabled={saving} className="bg-[#2271b1] text-white px-4 py-1.5 rounded text-[13px] hover:bg-[#135e96] transition-colors flex items-center gap-2">
                      {saving ? <Loader2 size={14} className="animate-spin" /> : 'Update'}
                    </button>
                  </div>
                </div>

                {/* Lesson Hierarchy */}
                <div className="bg-white border border-[#c3c4c7] shadow-sm">
                  <div className="border-b border-[#c3c4c7] p-3 font-semibold text-[14px]">Lesson Attributes</div>
                  <div className="p-3 space-y-4">
                    <div>
                      <label className="block text-[13px] mb-1">Parent Course</label>
                      <select required value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full border border-[#8c8f94] px-2 py-1.5 text-[13px] bg-white">
                        <option value="">(no parent)</option>
                        {allCourses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[13px] mb-1">Module Index</label>
                      <input required type="number" min="0" value={moduleIdx} onChange={e => setModuleIdx(e.target.value)} className="w-full border border-[#8c8f94] px-2 py-1.5 text-[13px]" />
                    </div>
                    <div>
                      <label className="block text-[13px] mb-1">Lesson Index (Order)</label>
                      <input required type="number" min="0" value={lessonIdx} onChange={e => setLessonIdx(e.target.value)} className="w-full border border-[#8c8f94] px-2 py-1.5 text-[13px]" />
                    </div>
                  </div>
                </div>
              </div>

            </form>
          </div>
        )}
      </main>
    </div>
  );
}