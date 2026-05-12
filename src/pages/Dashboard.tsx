import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useModules } from '../hooks/useModules';
import { useLessons } from '../hooks/useLessons';
import { useProgress } from '../hooks/useProgress';
import Navbar from '../components/layout/Navbar';
import ModuleAccordion from '../components/modules/ModuleAccordion';
import SearchBar from '../components/ui/SearchBar';
import OverallProgress from '../components/progress/OverallProgress';
import Skeleton from '../components/ui/Skeleton';
import { BookOpen, TrendingUp } from 'lucide-react';
import type { Lesson, Module } from '../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const { data: modules, isLoading: modulesLoading } = useModules();
  const { data: allLessons, isLoading: lessonsLoading } = useLessons();
  
  // FIX: Passed total count to hook for accurate calculation
  const { progressMap, overallPercent, calculateModuleProgress } = useProgress(
    user?.id || '',
    allLessons?.length || 0
  );

  const [searchQuery, setSearchQuery] = useState('');

  // FIX: Explicitly type moduleProgressData to avoid redline indexing errors
  const moduleProgressData: Record<string, { completed: number; total: number }> = useMemo(() => {
    return allLessons ? calculateModuleProgress(allLessons) : {};
  }, [allLessons, calculateModuleProgress]);

  // Filter modules based on search query
  const filteredModules = modules?.filter(module =>
    module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // FIX: Created a helper to keep progress data alongside modules without breaking types
  const modulesWithProgress = useMemo(() => {
    return filteredModules.map(module => ({
      ...module,
      progress: moduleProgressData[module.id] || { completed: 0, total: 0 },
    }));
  }, [filteredModules, moduleProgressData]);

  // Get continue learning items
  const continueLearning = allLessons
    ?.filter(lesson => progressMap[lesson.id] === 'in_progress')
    .slice(0, 3)
    .map(lesson => {
      const module = modules?.find(m => m.id === lesson.module_id);
      return {
        id: lesson.id,
        title: lesson.title,
        module: module?.title || 'Unknown Module',
      };
    }) || [];

  const handleLessonClick = (lesson: { id: string }) => {
    navigate(`/lesson/${lesson.id}`);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  if (modulesLoading || lessonsLoading) {
    return (
      <div className="min-h-screen bg-[#0c0f1a]">
        <Navbar user={profile || undefined} onNavigate={handleNavigate} onLogout={handleLogout} />
        <div className="pt-20 px-6">
          <div className="max-w-7xl mx-auto">
            <Skeleton className="h-8 w-64 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0f1a]">
      <Navbar user={profile || undefined} onNavigate={handleNavigate} onLogout={handleLogout} />

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#e8eaf6] mb-2">
              Welcome back, {profile?.name || 'Learner'}!
            </h1>
            <p className="text-[#8890b5]">Continue your learning journey</p>
          </div>

          <div className="mb-8">
            <SearchBar
              placeholder="Search modules or lessons..."
              onSearch={setSearchQuery}
              className="max-w-2xl"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#13172a] rounded-xl p-6 border border-[#1e2340]">
                  <div className="flex items-center justify-between mb-2">
                    <BookOpen className="w-5 h-5 text-[#5b6af0]" />
                    <span className="text-2xl font-bold text-[#e8eaf6]">{modules?.length || 0}</span>
                  </div>
                  <p className="text-sm text-[#8890b5]">Total Modules</p>
                </div>
                <div className="bg-[#13172a] rounded-xl p-6 border border-[#1e2340]">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-5 h-5 text-[#4ecca3]" />
                    <span className="text-2xl font-bold text-[#e8eaf6]">{overallPercent}%</span>
                  </div>
                  <p className="text-sm text-[#8890b5]">Overall Progress</p>
                </div>
                <div className="bg-[#13172a] rounded-xl p-6 border border-[#1e2340]">
                  <div className="flex items-center justify-between mb-2">
                    <BookOpen className="w-5 h-5 text-[#f0b15b]" />
                    <span className="text-2xl font-bold text-[#e8eaf6]">{allLessons?.length || 0}</span>
                  </div>
                  <p className="text-sm text-[#8890b5]">Total Lessons</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-[#e8eaf6] mb-4">
                  All Modules ({filteredModules.length})
                </h2>

                <div className="space-y-4">
                  {modulesWithProgress.map((module) => (
                    <ModuleAccordion
                      key={module.id}
                      module={module as Module}
                      lessons={allLessons?.filter(l => l.module_id === module.id) || []}
                      progressMap={progressMap}
                      onLessonClick={handleLessonClick}
                      isDefaultOpen={module.progress.completed > 0}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <OverallProgress
                overallPercent={overallPercent}
                // FIX: Added safe fallback for colors and typed the accumulator
                moduleProgress={Object.entries(moduleProgressData).reduce((acc, [moduleId, data]) => {
                  const module = modules?.find(m => m.id === moduleId);
                  if (module) {
                    acc[moduleId] = {
                      ...data,
                      title: module.title,
                      color: module.color || '#5b6af0',
                    };
                  }
                  return acc;
                }, {} as Record<string, { completed: number; total: number; title: string; color: string }>)}
              />

              {continueLearning.length > 0 && (
                <div className="bg-[#13172a] rounded-xl border border-[#1e2340] p-6">
                  <h3 className="text-lg font-semibold text-[#e8eaf6] mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-[#f0b15b]" />
                    Continue Learning
                  </h3>
                  <div className="space-y-3">
                    {continueLearning.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleLessonClick({ id: item.id })}
                        className="w-full bg-[#0c0f1a] hover:bg-[#1e2340] rounded-lg p-4 text-left transition-colors group"
                      >
                        <div className="text-sm font-medium text-[#e8eaf6] group-hover:text-[#5b6af0]">{item.title}</div>
                        <div className="text-xs text-[#8890b5] mt-1">{item.module}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}