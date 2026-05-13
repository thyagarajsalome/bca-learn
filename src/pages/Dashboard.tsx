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
import { BookOpen, TrendingUp, Layers } from 'lucide-react';
import type { Lesson, Module } from '../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  
  // NEW: State to track which category (semester) is currently selected
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');

  const { data: modulesResponse, isLoading: modulesLoading } = useModules({ searchQuery });
  const { data: lessonsResponse, isLoading: lessonsLoading } = useLessons();
  
  const modulesArray = modulesResponse?.data || [];
  const lessonsArray = lessonsResponse?.data || [];

  const { progressMap, overallPercent, calculateModuleProgress } = useProgress(
    user?.id || '',
    lessonsResponse?.totalCount || lessonsArray.length || 0
  );

  const moduleProgressData: Record<string, { completed: number; total: number }> = useMemo(() => {
    return lessonsArray.length > 0 ? calculateModuleProgress(lessonsArray) : {};
  }, [lessonsArray, calculateModuleProgress]);

  const modulesWithProgress = useMemo(() => {
    return modulesArray.map(module => ({
      ...module,
      progress: moduleProgressData[module.id] || { completed: 0, total: 0 },
    }));
  }, [modulesArray, moduleProgressData]);

  // NEW: Extract unique semesters to create the Category tabs dynamically
  const availableCategories = useMemo(() => {
    const semesters = new Set(modulesArray.map(m => m.semester).filter(Boolean));
    return Array.from(semesters).sort((a, b) => a - b);
  }, [modulesArray]);

  // NEW: Filter the displayed modules based on the selected category tab
  const displayedModules = useMemo(() => {
    if (selectedCategory === 'all') return modulesWithProgress;
    return modulesWithProgress.filter(m => m.semester === selectedCategory);
  }, [modulesWithProgress, selectedCategory]);

  const continueLearning = lessonsArray
    .filter(lesson => progressMap[lesson.id] === 'in_progress')
    .slice(0, 3)
    .map(lesson => {
      const module = modulesArray.find(m => m.id === lesson.module_id);
      return {
        id: lesson.id,
        title: lesson.title,
        module: module?.title || 'Unknown Module',
      };
    });

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
                    <span className="text-2xl font-bold text-[#e8eaf6]">{modulesResponse?.totalCount || modulesArray.length || 0}</span>
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
                    <span className="text-2xl font-bold text-[#e8eaf6]">{lessonsResponse?.totalCount || lessonsArray.length || 0}</span>
                  </div>
                  <p className="text-sm text-[#8890b5]">Total Lessons</p>
                </div>
              </div>

              {/* NEW: Category / Semester Filter Section */}
              {availableCategories.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                        selectedCategory === 'all'
                          ? 'bg-[#5b6af0] text-white border-[#5b6af0]'
                          : 'bg-[#13172a] text-[#8890b5] border-[#1e2340] hover:border-[#5b6af0]/50 hover:text-[#e8eaf6]'
                      }`}
                    >
                      All Subjects
                    </button>
                    {availableCategories.map(semester => {
                      const count = modulesArray.filter(m => m.semester === semester).length;
                      return (
                        <button
                          key={semester}
                          onClick={() => setSelectedCategory(semester)}
                          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                            selectedCategory === semester
                              ? 'bg-[#5b6af0] text-white border-[#5b6af0]'
                              : 'bg-[#13172a] text-[#8890b5] border-[#1e2340] hover:border-[#5b6af0]/50 hover:text-[#e8eaf6]'
                          }`}
                        >
                          Semester {semester} <span className="ml-1 opacity-70">({count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-xl font-semibold text-[#e8eaf6] mb-4 flex items-center">
                  <Layers className="w-5 h-5 mr-2 text-[#5b6af0]" />
                  {selectedCategory === 'all' ? 'All Modules' : `Semester ${selectedCategory} Modules`} 
                  <span className="ml-2 text-sm text-[#8890b5] font-normal">
                    ({displayedModules.length})
                  </span>
                </h2>

                <div className="space-y-4">
                  {displayedModules.length > 0 ? (
                    displayedModules.map((module) => (
                      <ModuleAccordion
                        key={module.id}
                        module={module as Module}
                        lessons={lessonsArray.filter(l => l.module_id === module.id)}
                        progressMap={progressMap}
                        onLessonClick={handleLessonClick}
                        isDefaultOpen={module.progress.completed > 0}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12 bg-[#13172a] rounded-xl border border-[#1e2340]">
                      <p className="text-[#8890b5]">No modules found for this category.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <OverallProgress
                overallPercent={overallPercent}
                moduleProgress={Object.entries(moduleProgressData).reduce((acc, [moduleId, data]) => {
                  const module = modulesArray.find(m => m.id === moduleId);
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