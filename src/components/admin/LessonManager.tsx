import NotionEditor from './NotionEditor';
import { useState, useEffect } from 'react';
import { useModules } from '../../hooks/useModules';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../../contexts/NotificationContext';
import { Save, X, BookOpen, Clock, Plus, FileCode2 } from 'lucide-react';

interface LessonFormData {
  module_id: string;
  title: string;
  description: string;
  content: string;
  order_index: number;
  duration_minutes: number;
  is_published: boolean;
}

export default function LessonManager() {
  // 1. Updated to grab the response object and extract the data array
  const { data: modulesResponse } = useModules();
  const modulesArray = modulesResponse?.data || [];

  const { addNotification } = useNotifications();
  const [showForm, setShowForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [lessons, setLessons] = useState<any[]>([]);

  const initialFormState: LessonFormData = {
    module_id: '',
    title: '',
    description: '',
    content: '',
    order_index: 1,
    duration_minutes: 15,
    is_published: true,
  };

  const [formData, setFormData] = useState<LessonFormData>(initialFormState);

  const loadLessons = async () => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setLessons(data || []);
    } catch (err) {
      addNotification({ type: 'error', message: 'Failed to load lessons' });
    }
  };

  useEffect(() => {
    loadLessons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.content) {
        throw new Error('Content is required');
      }

      // Explicitly pick ONLY the fields that exist in your database
      const lessonDataToSave = {
        module_id: formData.module_id,
        title: formData.title,
        description: formData.description,
        content: formData.content,
        order_index: formData.order_index,
        duration_minutes: formData.duration_minutes,
        is_published: formData.is_published,
        type: 'markdown' // Hardcode to markdown
      };

      if (editingLesson) {
        const { error } = await supabase
          .from('lessons')
          .update(lessonDataToSave)
          .eq('id', editingLesson.id);

        if (error) throw error;
        addNotification({ type: 'success', message: 'Lesson updated successfully!' });
      } else {
        const { error } = await supabase
          .from('lessons')
          .insert({ ...lessonDataToSave, created_at: new Date().toISOString() });

        if (error) throw error;
        addNotification({ type: 'success', message: 'Lesson created successfully!' });
      }

      setFormData(initialFormState);
      setShowForm(false);
      setEditingLesson(null);
      loadLessons();
    } catch (err) {
      console.error("Save Error:", err);
      addNotification({ type: 'error', message: err instanceof Error ? err.message : 'Failed to save lesson' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (lesson: any) => {
    setEditingLesson(lesson);
    setFormData({
      module_id: lesson.module_id,
      title: lesson.title,
      description: lesson.description || '',
      content: lesson.content || '',
      order_index: lesson.order_index,
      duration_minutes: lesson.duration_minutes || 15,
      is_published: lesson.is_published,
    });
    setShowForm(true);
  };

  const handleDelete = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    try {
      const { error } = await supabase.from('lessons').delete().eq('id', lessonId);
      if (error) throw error;
      addNotification({ type: 'success', message: 'Lesson deleted successfully!' });
      loadLessons();
    } catch (err) {
      addNotification({ type: 'error', message: 'Failed to delete lesson' });
    }
  };

  const getModuleName = (moduleId: string) => {
    // 2. Updated to search through modulesArray instead of the raw modules object
    return modulesArray.find(m => m.id === moduleId)?.title || 'Unknown Module';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#e8eaf6]">Lessons Management</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingLesson(null);
            setFormData(initialFormState);
          }}
          className="flex items-center space-x-2 bg-[#5b6af0] hover:bg-[#4a5ae0] text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Lesson</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-[#13172a] rounded-xl border border-[#1e2340] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#e8eaf6]">
              {editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
            </h3>
            <button
              onClick={() => { setShowForm(false); setEditingLesson(null); }}
              className="p-2 rounded-lg hover:bg-[#1e2340] text-[#8890b5] hover:text-[#e8eaf6]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#e8eaf6] mb-2">Module *</label>
                <select
                  value={formData.module_id}
                  onChange={(e) => setFormData({ ...formData, module_id: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0c0f1a] border border-[#1e2340] rounded-lg text-[#e8eaf6] focus:outline-none focus:ring-2 focus:ring-[#5b6af0]"
                  required
                >
                  <option value="">Select a module</option>
                  {/* 3. Updated to map over modulesArray */}
                  {modulesArray.map((module) => (
                    <option key={module.id} value={module.id}>{module.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#e8eaf6] mb-2">Lesson Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0c0f1a] border border-[#1e2340] rounded-lg text-[#e8eaf6] focus:outline-none focus:ring-2 focus:ring-[#5b6af0]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#e8eaf6] mb-2">Short Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-[#0c0f1a] border border-[#1e2340] rounded-lg text-[#e8eaf6] focus:outline-none focus:ring-2 focus:ring-[#5b6af0]"
                rows={2}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-[#e8eaf6]">Lesson Content *</label>
                <span className="text-xs text-[#8890b5]">Hover for block menu (+) or type '/' for commands</span>
              </div>
              
              <NotionEditor 
                markdown={formData.content} 
                onChange={(val) => setFormData({ ...formData, content: val || '' })} 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#e8eaf6] mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 45 })}
                  className="w-full px-4 py-3 bg-[#0c0f1a] border border-[#1e2340] rounded-lg text-[#e8eaf6] focus:outline-none focus:ring-2 focus:ring-[#5b6af0]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#e8eaf6] mb-2">Order Index</label>
                <input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-3 bg-[#0c0f1a] border border-[#1e2340] rounded-lg text-[#e8eaf6] focus:outline-none focus:ring-2 focus:ring-[#5b6af0]"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-5 h-5 rounded border-[#1e2340] bg-[#0c0f1a] text-[#5b6af0]"
              />
              <label htmlFor="is_published" className="text-sm text-[#e8eaf6]">Published (visible to students)</label>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-[#1e2340]">
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingLesson(null); }}
                className="px-6 py-2 rounded-lg border border-[#1e2340] text-[#8890b5] hover:text-[#e8eaf6]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#5b6af0] hover:bg-[#4a5ae0] text-white px-6 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{editingLesson ? 'Update' : 'Save'} Lesson</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lessons List */}
      <div className="space-y-3">
        {lessons.length > 0 ? (
          lessons.map((lesson) => (
            <div key={lesson.id} className="bg-[#13172a] rounded-lg p-4 border border-[#1e2340] hover:border-[#5b6af0]/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 rounded bg-[#1e2340] text-[#8890b5]">
                      <FileCode2 className="w-4 h-4" />
                    </div>
                    <h4 className="text-lg font-semibold text-[#e8eaf6]">{lesson.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${lesson.is_published ? 'bg-[#4ecca3]/20 text-[#4ecca3]' : 'bg-[#f0b15b]/20 text-[#f0b15b]'}`}>
                      {lesson.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-sm text-[#8890b5] mb-2">{lesson.description || 'No description'}</p>
                  <div className="flex items-center space-x-4 text-xs text-[#8890b5]">
                    <span className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{getModuleName(lesson.module_id)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{lesson.duration_minutes} min</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button onClick={() => handleEdit(lesson)} className="p-2 rounded-lg hover:bg-[#1e2340] text-[#8890b5] hover:text-[#5b6af0]">
                    <Save className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(lesson.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-[#8890b5] hover:text-red-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-[#13172a] rounded-xl border border-[#1e2340]">
            <BookOpen className="w-12 h-12 text-[#8890b5] mx-auto mb-4" />
            <p className="text-[#8890b5] mb-2">No lessons created yet</p>
          </div>
        )}
      </div>
    </div>
  );
}