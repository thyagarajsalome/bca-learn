import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BookOpen, Users, LogOut, Plus, X, RefreshCw, Layers } from 'lucide-react';
import LessonManager from '../components/admin/LessonManager';
import { useNotifications } from '../contexts/NotificationContext';
import { supabase } from '../lib/supabase';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<'modules' | 'lessons' | 'users'>('modules');

  // Check if user is admin
  const isAdmin = profile?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0c0f1a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#e8eaf6] mb-4">Access Denied</h1>
          <p className="text-[#8890b5] mb-6">You don't have permission to access this page.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-[#5b6af0] hover:bg-[#4a5ae0] text-white px-6 py-2 rounded-lg"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0f1a]">
      {/* Admin Header */}
      <div className="bg-[#13172a] border-b border-[#1e2340] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#5b6af0] to-[#4ecca3] rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#e8eaf6]">BCALearn Admin</h1>
              <p className="text-sm text-[#8890b5]">Content Management System</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-[#8890b5]">Welcome, {profile?.name || 'Admin'}</span>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-[#8890b5] hover:text-[#e8eaf6] transition-colors"
            >
              View Dashboard
            </button>
            <button
              onClick={signOut}
              className="flex items-center space-x-2 text-[#8890b5] hover:text-[#e8eaf6] transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('modules')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'modules'
                    ? 'bg-[#5b6af0] text-white'
                    : 'bg-[#13172a] text-[#8890b5] hover:text-[#e8eaf6]'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span>Modules</span>
              </button>
              <button
                onClick={() => setActiveTab('lessons')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'lessons'
                    ? 'bg-[#5b6af0] text-white'
                    : 'bg-[#13172a] text-[#8890b5] hover:text-[#e8eaf6]'
                }`}
              >
                <Layers className="w-5 h-5" />
                <span>Lessons</span>
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'users'
                    ? 'bg-[#5b6af0] text-white'
                    : 'bg-[#13172a] text-[#8890b5] hover:text-[#e8eaf6]'
                }`}
              >
                <Users className="w-5 h-5" />
                <span>Users</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'modules' && <ModulesManagement />}
            {activeTab === 'lessons' && <LessonsManagement />}
            {activeTab === 'users' && <UsersManagement />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Modules Management Component
function ModulesManagement() {
  const { addNotification } = useNotifications();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '📚',
    color: '#5b6af0',
    semester: 1,
    order_index: 1,
    is_published: true,
  });

  const loadModules = async () => {
    try {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setModules(data || []);
    } catch (err) {
      addNotification({
        type: 'error',
        message: 'Failed to load modules'
      });
    }
  };

  useEffect(() => {
    loadModules();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('modules')
        .insert({
          ...formData,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      addNotification({
        type: 'success',
        message: 'Module created successfully!'
      });

      setFormData({
        title: '',
        description: '',
        icon: '📚',
        color: '#5b6af0',
        semester: 1,
        order_index: 1,
        is_published: true,
      });
      setShowForm(false);
      loadModules();

    } catch (err) {
      addNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to create module'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module? This will also delete all lessons in this module.')) return;

    try {
      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', moduleId);

      if (error) throw error;

      addNotification({
        type: 'success',
        message: 'Module deleted successfully!'
      });
      loadModules();

    } catch (err) {
      addNotification({
        type: 'error',
        message: 'Failed to delete module'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#e8eaf6]">Modules Management</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setFormData({
              title: '',
              description: '',
              icon: '📚',
              color: '#5b6af0',
              semester: 1,
              order_index: 1,
              is_published: true,
            });
          }}
          className="flex items-center space-x-2 bg-[#5b6af0] hover:bg-[#4a5ae0] text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Module</span>
        </button>
      </div>

      {/* Module Form */}
      {showForm && (
        <div className="bg-[#13172a] rounded-xl border border-[#1e2340] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#e8eaf6]">Create New Module</h3>
            <button
              onClick={() => setShowForm(false)}
              className="p-2 rounded-lg hover:bg-[#1e2340] text-[#8890b5] hover:text-[#e8eaf6] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#e8eaf6] mb-2">
                Module Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-[#0c0f1a] border border-[#1e2340] rounded-lg text-[#e8eaf6] placeholder-[#8890b5] focus:outline-none focus:ring-2 focus:ring-[#5b6af0] focus:border-transparent"
                placeholder="e.g., Programming Fundamentals"
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
                placeholder="Brief description of the module content"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#e8eaf6] mb-2">
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0c0f1a] border border-[#1e2340] rounded-lg text-[#e8eaf6] placeholder-[#8890b5] focus:outline-none focus:ring-2 focus:ring-[#5b6af0] focus:border-transparent"
                  placeholder="📚"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e8eaf6] mb-2">
                  Color
                </label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full h-12 px-4 py-2 bg-[#0c0f1a] border border-[#1e2340] rounded-lg text-[#e8eaf6] focus:outline-none focus:ring-2 focus:ring-[#5b6af0] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#e8eaf6] mb-2">
                  Semester
                </label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-3 bg-[#0c0f1a] border border-[#1e2340] rounded-lg text-[#e8eaf6] focus:outline-none focus:ring-2 focus:ring-[#5b6af0] focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>

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
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
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
                    <div className="w-4 h-4 border-2 border-[#e8e0] border-t-transparent rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Create Module</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modules List */}
      <div className="space-y-3">
        {modules.length > 0 ? (
          modules.map((module) => (
            <div
              key={module.id}
              className="bg-[#13172a] rounded-lg p-4 border border-[#1e2340] hover:border-[#5b6af0]/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${module.color}20`, color: module.color }}
                  >
                    {module.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-[#e8eaf6]">{module.title}</h4>
                    <p className="text-sm text-[#8890b5] line-clamp-1">{module.description || 'No description'}</p>
                    <div className="flex items-center space-x-3 text-xs text-[#8890b5] mt-1">
                      <span>Semester {module.semester}</span>
                      <span>•</span>
                      <span>Order {module.order_index}</span>
                      <span>•</span>
                      <span className={module.is_published ? 'text-[#4ecca3]' : 'text-[#8890b5]'}>
                        {module.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(module.id)}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-[#8890b5] hover:text-red-400 transition-colors"
                  title="Delete Module"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-[#13172a] rounded-xl border border-[#1e2340]">
            <BookOpen className="w-12 h-12 text-[#8890b5] mx-auto mb-4" />
            <p className="text-[#8890b5] mb-2">No modules created yet</p>
            <p className="text-sm text-[#8890b5]">Click "Add Module" to create your first module</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Lessons Management Component
function LessonsManagement() {
  return <LessonManager />;
}

// Users Management Component
function UsersManagement() {
  const { addNotification } = useNotifications();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const combinedUsers = profiles.map(profile => ({
        ...profile,
        email: 'Protected by Supabase', 
        last_sign_in: profile.created_at,
      }));

      setUsers(combinedUsers);
    } catch (err) {
      addNotification({
        type: 'error',
        message: 'Failed to load users'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const changeUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      addNotification({
        type: 'success',
        message: 'User role updated successfully!'
      });
      loadUsers();

    } catch (err) {
      addNotification({
        type: 'error',
        message: 'Failed to update user role'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#e8eaf6]">Users Management</h2>
        <button
          onClick={loadUsers}
          disabled={loading}
          className="text-sm text-[#5b6af0] hover:text-[#4a5ae0] transition-colors disabled:opacity-50 flex items-center space-x-1"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Loading...' : 'Refresh'}</span>
        </button>
      </div>

      {users.length > 0 ? (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-[#13172a] rounded-lg p-4 border border-[#1e2340] hover:border-[#5b6af0]/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-[#5b6af0] flex items-center justify-center text-white font-medium">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-[#e8eaf6]">{user.name || 'Unknown User'}</h4>
                    <p className="text-sm text-[#8890b5]">{user.email}</p>
                    <div className="flex items-center space-x-3 text-xs text-[#8890b5] mt-1">
                      <span>Semester {user.semester}</span>
                      <span>•</span>
                      <span className={`font-medium ${
                        user.role === 'admin' ? 'text-[#4ecca3]' : 'text-[#8890b5]'
                      }`}>
                        {user.role || 'student'}
                      </span>
                      {user.last_sign_in && (
                        <>
                          <span>•</span>
                          <span>Last seen: {new Date(user.last_sign_in).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={user.role || 'student'}
                    onChange={(e) => changeUserRole(user.id, e.target.value)}
                    className="px-3 py-2 bg-[#0c0f1a] border border-[#1e2340] rounded-lg text-[#e8eaf6] text-sm focus:outline-none focus:ring-2 focus:ring-[#5b6af0] focus:border-transparent"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                    <option value="instructor">Instructor</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-[#13172a] rounded-xl border border-[#1e2340]">
          <Users className="w-12 h-12 text-[#8890b5] mx-auto mb-4" />
          <p className="text-[#8890b5] mb-2">No users found</p>
          <p className="text-sm text-[#8890b5]">Users will appear here after they sign up</p>
        </div>
      )}
    </div>
  );
}