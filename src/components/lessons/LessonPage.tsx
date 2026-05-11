import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLesson } from '../../hooks/useLessons';
import { useModuleWithLessons } from '../../hooks/useModules';
import { useProgress } from '../../hooks/useProgress';
import { useAuth } from '../../hooks/useAuth';
import MarkdownViewer from './MarkdownViewer';
import { ChevronLeft, ChevronRight, CheckCircle2, ArrowLeft, Clock } from 'lucide-react';

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: lesson, isLoading: lessonLoading } = useLesson(lessonId || '');
  const { data: moduleData, isLoading: moduleLoading } = useModuleWithLessons(lesson?.module_id || '');
  const { progressMap, markInProgress, markComplete } = useProgress(user?.id || '');

  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (lesson && user?.id) {
      markInProgress(lesson.id);
      setIsCompleted(progressMap[lesson.id] === 'completed');
    }
  }, [lesson, user, progressMap, markInProgress]);

  const handleMarkComplete = async () => {
    if (lesson && user?.id) {
      await markComplete(lesson.id);
      setIsCompleted(true);
    }
  };

  const navigateToLesson = (direction: 'prev' | 'next') => {
    if (!moduleData?.lessons) return;
    const currentIndex = moduleData.lessons.findIndex(l => l.id === lesson?.id);
    if (currentIndex === -1) return;
    const targetIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex >= 0 && targetIndex < moduleData.lessons.length) {
      navigate(`/lesson/${moduleData.lessons[targetIndex].id}`);
    }
  };

  const canNavigatePrev = lesson && moduleData?.lessons
    ? moduleData.lessons.findIndex(l => l.id === lesson.id) > 0
    : false;

  const canNavigateNext = lesson && moduleData?.lessons
    ? moduleData.lessons.findIndex(l => l.id === lesson.id) < moduleData.lessons.length - 1
    : false;

  if (lessonLoading || moduleLoading) {
    return (
      <div className="min-h-screen bg-[#0c0f1a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#5b6af0] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-[#0c0f1a] flex items-center justify-center text-center px-4">
        <div>
          <p className="text-[#8890b5] mb-4">Lesson not found</p>
          <button onClick={() => navigate('/dashboard')} className="text-[#5b6af0] hover:underline">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0c0f1a] flex flex-col overflow-hidden">
      {/* Top Header - Stays fixed at the top */}
      <div className="bg-[#13172a] border-b border-[#1e2340] px-4 py-3 md:px-6 md:py-4 flex-shrink-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-start sm:items-center space-x-3 md:space-x-4 min-w-0">
            <button
              onClick={() => navigate(`/module/${lesson.module_id}`)}
              className="p-2 -ml-2 rounded-lg bg-transparent hover:bg-[#1e2340] text-[#8890b5] hover:text-[#e8eaf6] transition-colors flex-shrink-0"
              aria-label="Back to module"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base md:text-xl font-semibold text-[#e8eaf6] truncate leading-tight">
                {lesson.title}
              </h1>
              <div className="flex items-center space-x-2 text-xs md:text-sm text-[#8890b5] mt-0.5">
                <span className="truncate max-w-[150px] md:max-w-xs">{moduleData?.module.title}</span>
                {lesson.duration_minutes && (
                  <>
                    <span>•</span>
                    <div className="flex items-center flex-shrink-0">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      <span>{lesson.duration_minutes} min</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleMarkComplete}
            disabled={isCompleted}
            className={`flex items-center justify-center space-x-2 px-4 py-2 text-sm md:text-base rounded-lg font-medium transition-colors flex-shrink-0 ${
              isCompleted
                ? 'bg-[#4ecca3]/10 text-[#4ecca3] cursor-default border border-[#4ecca3]/20'
                : 'bg-[#5b6af0] hover:bg-[#4a5ae0] text-white shadow-md'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
            <span>{isCompleted ? 'Completed' : 'Mark as Complete'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area - Scrolls independently */}
      <div className="flex-1 overflow-hidden relative">
        <MarkdownViewer content={lesson.content || ''} title={lesson.title} />
      </div>

      {/* Bottom Navigation - Fixed at the bottom */}
      <div className="bg-[#13172a] border-t border-[#1e2340] px-4 py-3 md:px-6 md:py-4 flex-shrink-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigateToLesson('prev')}
            disabled={!canNavigatePrev}
            className="flex items-center justify-center space-x-1 md:space-x-2 px-3 py-2 md:px-4 md:py-2.5 rounded-lg bg-[#0c0f1a] border border-[#1e2340] hover:bg-[#1e2340] text-[#8890b5] hover:text-[#e8eaf6] transition-all disabled:opacity-40 disabled:hover:bg-[#0c0f1a] text-sm md:text-base"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Previous Lesson</span>
            <span className="sm:hidden">Prev</span>
          </button>
          
          <button
            onClick={() => navigateToLesson('next')}
            disabled={!canNavigateNext}
            className="flex items-center justify-center space-x-1 md:space-x-2 px-3 py-2 md:px-4 md:py-2.5 rounded-lg bg-[#5b6af0]/10 border border-[#5b6af0]/30 hover:bg-[#5b6af0]/20 text-[#5b6af0] hover:text-[#7b88f5] transition-all disabled:opacity-40 disabled:hover:bg-[#5b6af0]/10 text-sm md:text-base"
          >
            <span className="hidden sm:inline">Next Lesson</span>
            <span className="sm:hidden">Next</span>
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}