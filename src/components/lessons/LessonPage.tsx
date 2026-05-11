import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLesson } from '../../hooks/useLessons';
import { useModuleWithLessons } from '../../hooks/useModules';
import { useProgress } from '../../hooks/useProgress';
import { useAuth } from '../../hooks/useAuth';
import PDFViewer from './PDFViewer';
import NotionEmbed from './NotionEmbed';
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
      // Mark lesson as in progress when opened
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
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#5b6af0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#8890b5]">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-[#0c0f1a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8890b5] mb-4">Lesson not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-[#5b6af0] hover:underline"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0f1a] flex flex-col">
      {/* Top Bar */}
      <div className="bg-[#13172a] border-b border-[#1e2340] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/module/${lesson.module_id}`)}
              className="p-2 rounded-lg bg-[#0c0f1a] hover:bg-[#1e2340] text-[#8890b5] hover:text-[#e8eaf6] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-[#e8eaf6]">{lesson.title}</h1>
              <div className="flex items-center space-x-2 text-sm text-[#8890b5]">
                <span>{moduleData?.module.title}</span>
                {lesson.duration_minutes && (
                  <>
                    <span>•</span>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
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
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isCompleted
                ? 'bg-[#4ecca3]/20 text-[#4ecca3] cursor-default'
                : 'bg-[#5b6af0] hover:bg-[#4a5ae0] text-white'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{isCompleted ? 'Completed' : 'Mark as Complete'}</span>
          </button>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="flex-1 overflow-hidden">
        {lesson.type === 'pdf' ? (
          <PDFViewer
            url={lesson.source_url}
            title={lesson.title}
            onComplete={handleMarkComplete}
          />
        ) : lesson.type === 'notion' ? (
          <NotionEmbed
            url={lesson.source_url}
            title={lesson.title}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-[#8890b5]">Lesson type not supported yet</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-[#13172a] border-t border-[#1e2340] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigateToLesson('prev')}
            disabled={!canNavigatePrev}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#0c0f1a] hover:bg-[#1e2340] text-[#8890b5] hover:text-[#e8eaf6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous Lesson</span>
          </button>

          <button
            onClick={() => navigateToLesson('next')}
            disabled={!canNavigateNext}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#0c0f1a] hover:bg-[#1e2340] text-[#8890b5] hover:text-[#e8eaf6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next Lesson</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}