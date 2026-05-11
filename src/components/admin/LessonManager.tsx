import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModules } from '../../hooks/useModules';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../../contexts/NotificationContext';
import { Save, X, BookOpen, FileText, Video, ExternalLink, Clock, Plus } from 'lucide-react';

interface LessonFormData {
  module_id: string;
  title: string;
  description: string;
  type: 'pdf' | 'notion' | 'video' | 'external';
  source_url: string;
  order_index: number;
  duration_minutes: number;
  page_count: number;
  is_published: boolean;
}

export default function LessonManager() {
  const navigate = useNavigate();
  const { data: modules } = useModules();
  const { addNotification } = useNotifications();
  const [showForm, setShowForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<LessonFormData>({
    module_id: '',
    title: '',
    description: '',
    type: 'pdf',
    source_url: '',
    order_index: 1,
    duration_minutes: 45,
    page_count: 0,
    is_published: true,
  });

  const [lessons, setLessons] = useState<any[]>([]);

  const loadLessons = async () => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setLessons(data || []);
    } catch (err) {
      addNotification({
        type: 'error',
        message: 'Failed to load lessons'
      });
    }
  };

  // ✅ Fix: Use useEffect with an empty dependency array
  useEffect(() => {
    loadLessons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingLesson) {
        // Update existing lesson
        const { error } = await supabase
          .from('lessons')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingLesson.id);

        if (error) throw error;

        addNotification({
          type: 'success',
          message: 'Lesson updated successfully!'
        });
      } else {
        // Create new lesson
        const { error } = await supabase
          .from('lessons')
          .insert({
            ...formData,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;

        addNotification({
          type: 'success',
          message: 'Lesson created successfully!'
        });
      }

      // Reset form and reload lessons
      setFormData({
        module_id: '',
        title: '',
        description: '',
        type: 'pdf',
        source_url: '',
        order_index: 1,
        duration_minutes: 45,
        page_count: 0,
        is_published: true,
      });
      setShowForm(false);
      setEditingLesson(null);
      loadLessons();

    } catch (err) {
      addNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to save lesson'
      });
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
      type: lesson.type,
      source_url: lesson.source_url || '',
      order_index: lesson.order_index,
      duration_minutes: lesson.duration_minutes || 45,
      page_count: lesson.page_count || 0,
      is_published: lesson.is_published,
    });
    setShowForm(true);
  };

  const handleDelete = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;

    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);

      if (error) throw error;

      addNotification({
        type: 'success',
        message: 'Lesson deleted successfully!'
      });
      loadLessons();

    } catch (err) {
      addNotification({
        type: 'error',
        message: 'Failed to delete lesson'
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-4 h-4" />;
      case 'notion':
        return <FileText className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'external':
        return <ExternalLink className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getModuleName = (moduleId: string) => {
    return modules?.find(m => m.id === moduleId)?.title || 'Unknown Module';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#e8eaf6]">Lessons Management</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingLesson(null);
            setFormData({
              module_id: '',
              title: '',
              description: '',
              type: 'pdf',
              source_url: '',
              order_index: 1,
              duration_minutes: 45,
              page_count: 0,
              is_published: true,
            });
          }}
          className="flex items-center space-x-2 bg-[#5b6af0] hover:bg-[#4a5ae0] text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Lesson</span>
        </button>
      </div>

      {/* Lesson Form */}
      {showForm && (
        <div className="bg-[#13172a] rounded-xl border border-[#1e2340] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#e8eaf6]">
              {editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
            </h3>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingLesson(null);
              }}
              className="p-2 rounded-lg hover:bg-[#1e2340] text-[#8890b5] hover:text-[#e8eaf6] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#e8eaf6] mb-2">
                Module *
              </label>
              <select
                value={formData.module_id}
                onChange={(e) => setFormData({ ...formData, module_id: e.target.value })}
                className="w-full px-4 py-3 bg-[#0c0f1a] border border-[#1e2340] rounded-lg text-[#e8eaf6] focus:outline-none focus:ring-2 focus:ring-[#5b6af0] focus:border-transparent"
                required
              >
                <option value="">Select a module</option>
                {modules?.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#e8eaf6] mb-2">
                Lesson Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-[#0c0f1a] border border-[#1e2340] rounded-lg text-[#e8eaf6] placeholder-[#8890b5] focus:outline-none focus:ring-2 focus:ring-[#5b6af0] focus:border-transparent"
                placeholder="Enter lesson title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#e8eaf6] mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-[#0c0f1a] border border-[#1e2340] rounded-lg text-[#e8eaf6] placeholder-[#8890b5] focus:outline-none focus:ring-2 focus:ring-[#5b6af0] focus:border-transparent"
                placeholder="Enter lesson description"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#e8eaf6] mb-2">
                Content Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-4 py-3 bg-[#0c0f1a] border border-[#1e2340] rounded-lg text-[#e8eaf6] focus:outline-none focus:ring-2 focus:ring-[#5b6af0] focus:border-transparent"
                required
              >
                <option value="pdf">PDF Document</option>
                <option value="notion">Notion Page</option>
                <option value="video">Video</option>
                <option value="external">External Link</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#e8eaf6] mb-2">
                Source URL *
              </label>
              <input
                type="url"
                value={formData.source_url}
                onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                className="w-full px-4 py-3 bg-[#0c0f1a] border border-[#1e2340] rounded-lg text-[#e8eaf6] placeholder-[#8890b5] focus:outline-none focus:ring-2 focus:ring-[#5b6af0] focus:border-transparent"
                placeholder="Paste the file URL from uploaded files"
                required
              />
              <p className="text-xs text-[#8890b5] mt-1">
                💡 Copy URLs from the "Upload Content" tab
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#e8eaf6] mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 45 })}
                  className="w-full px-4 py-3 bg-[#0c0f1a] border border-[#1e2340] rounded-lg text-[#e8eaf6] placeholder-[#8890b5] focus:outline-none focus:ring-2 focus:ring-[#5b6af0] focus:border-transparent"
                  placeholder="45"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e8eaf6] mb-2">
                  Page Count (PDF only)
                </label>
                <input
                  type="number"
                  value={formData.page_count}
                  onChange={(e) => setFormData({ ...formData, page_count: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-[#0c0f1a] border border-[#1e2340] rounded-lg text-[#e8eaf6] placeholder-[#8890b5] focus:outline-none focus:ring-2 focus:ring-[#5b6af0] focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#e8eaf6] mb-2">
                  Order
                </label>
                <input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-3 bg-[#0c0f1a] border border-[#1e2340] rounded-lg text-[#e8eaf6] placeholder-[#8890b5] focus:outline-none focus:ring-2 focus:ring-[#5b6af0] focus:border-transparent"
                  placeholder="1"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="w-5 h-5 rounded border-[#1e2340] bg-[#0c0f1a] text-[#5b6af0] focus:ring-2 focus:ring-[#5b6af0] focus:ring-offset-0"
                />
                <label htmlFor="is_published" className="text-sm text-[#8890b5]">
                  Published
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingLesson(null);
                }}
                className="px-6 py-2 rounded-lg border border-[#1e2340] text-[#8890b5] hover:text-[#e8eaf6] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#5b6af0] hover:bg-[#4a5ae0] text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#e8eaf0] border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{editingLesson ? 'Update' : 'Create'} Lesson</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lessons List */}
      <div className="space-y-3">
        {lessons.length > 0 ? (
          lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-[#13172a] rounded-lg p-4 border border-[#1e2340] hover:border-[#5b6af0]/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getTypeIcon(lesson.type)}
                    <h4 className="text-lg font-semibold text-[#e8eaf6]">{lesson.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      lesson.is_published ? 'bg-[#4ecca3]/20 text-[#4ecca3]' : 'bg-[#8890b5]/20 text-[#8890b5]'
                    }`}>
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
                    {lesson.page_count > 0 && (
                      <span>{lesson.page_count} pages</span>
                    )}
                  </div>
                  <div className="text-xs text-[#5b6af0] truncate mt-1" title={lesson.source_url}>
                    {lesson.source_url}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(lesson)}
                    className="p-2 rounded-lg hover:bg-[#1e2340] text-[#8890b5] hover:text-[#e8eaf6] transition-colors"
                    title="Edit"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(lesson.id)}
                    className="p-2 rounded-lg hover:bg-red-500/20 text-[#8890b5] hover:text-red-400 transition-colors"
                    title="Delete"
                  >
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
            <p className="text-sm text-[#8890b5]">Click "Add Lesson" to create your first lesson</p>
          </div>
        )}
      </div>
    </div>
  );
}