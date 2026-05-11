import { useParams, useNavigate } from 'react-router-dom';
import { useModuleWithLessons } from '../hooks/useModules';
import { useProgress } from '../hooks/useProgress';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/layout/Navbar';
import ModuleAccordion from '../components/modules/ModuleAccordion';
import Skeleton from '../components/ui/Skeleton';
import { ArrowLeft, BookOpen, Clock } from 'lucide-react';

export default function ModuleDetail() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const { data: moduleData, isLoading } = useModuleWithLessons(moduleId || '');
  const { progressMap } = useProgress(user?.id || '');

  const handleLessonClick = (lesson: any) => {
    navigate(`/lesson/${lesson.id}`);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0c0f1a]">
        <Navbar user={profile ? { ...profile, role: profile.role } : undefined} onNavigate={handleNavigate} onLogout={handleLogout} />
        <div className="pt-20 px-6">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-32 mb-6" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-full mb-8" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!moduleData) {
    return (
      <div className="min-h-screen bg-[#0c0f1a]">
        <Navbar user={profile ? { ...profile, role: profile.role } : undefined} onNavigate={handleNavigate} onLogout={handleLogout} />
        <div className="pt-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-[#8890b5] mb-4">Module not found</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-[#5b6af0] hover:underline"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { module, lessons } = moduleData;
  const completedLessons = lessons.filter(lesson => progressMap[lesson.id] === 'completed').length;
  const totalDuration = lessons.reduce((sum, lesson) => sum + (lesson.duration_minutes || 0), 0);

  return (
    <div className="min-h-screen bg-[#0c0f1a]">
      <Navbar user={profile || undefined} onNavigate={handleNavigate} onLogout={handleLogout} />

      <div className="pt-20">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-[#8890b5] hover:text-[#e8eaf6] mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>

          {/* Module Header */}
          <div className="bg-[#13172a] rounded-xl border border-[#1e2340] p-8 mb-8">
            <div className="flex items-start space-x-6">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
                style={{ backgroundColor: `${module.color}20`, color: module.color }}
              >
                {module.icon}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-[#e8eaf6] mb-3">{module.title}</h1>
                <p className="text-[#8890b5] mb-4">{module.description}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center space-x-2 text-[#8890b5]">
                    <BookOpen className="w-4 h-4" />
                    <span>{lessons.length} Lessons</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[#8890b5]">
                    <Clock className="w-4 h-4" />
                    <span>{totalDuration} min total</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[#4ecca3]">
                    <span>{completedLessons}/{lessons.length} completed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lessons */}
          <div>
            <h2 className="text-xl font-semibold text-[#e8eaf6] mb-4">Lessons</h2>
            {lessons.length > 0 ? (
              <ModuleAccordion
                module={module}
                lessons={lessons}
                progressMap={progressMap}
                onLessonClick={handleLessonClick}
                isDefaultOpen={true}
              />
            ) : (
              <div className="text-center py-12 bg-[#13172a] rounded-xl border border-[#1e2340]">
                <BookOpen className="w-12 h-12 text-[#8890b5] mx-auto mb-4" />
                <p className="text-[#8890b5]">No lessons available yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}