import { TrendingUp, Clock, Award } from 'lucide-react';

interface SidebarProps {
  overallProgress?: number;
  continueLearning?: Array<{
    id: string;
    title: string;
    module: string;
    progress: number;
  }>;
  onLessonClick?: (lessonId: string) => void;
}

export default function Sidebar({ overallProgress = 0, continueLearning = [], onLessonClick }: SidebarProps) {
  return (
    <aside className="w-80 bg-[#13172a] border-l border-[#1e2340] p-6 overflow-y-auto">
      {/* Overall Progress */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-[#e8eaf6] mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-[#4ecca3]" />
          Overall Progress
        </h3>
        <div className="bg-[#0c0f1a] rounded-xl p-6">
          <div className="text-4xl font-bold text-[#e8eaf6] mb-2">{overallProgress}%</div>
          <div className="w-full bg-[#1e2340] rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#5b6af0] to-[#4ecca3] h-2 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Continue Learning */}
      {continueLearning.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-[#e8eaf6] mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-[#f0b15b]" />
            Continue Learning
          </h3>
          <div className="space-y-3">
            {continueLearning.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => onLessonClick?.(lesson.id)}
                className="w-full bg-[#0c0f1a] hover:bg-[#1e2340] rounded-lg p-4 text-left transition-colors group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[#e8eaf6] group-hover:text-[#5b6af0] transition-colors">
                      {lesson.title}
                    </div>
                    <div className="text-xs text-[#8890b5] mt-1">{lesson.module}</div>
                  </div>
                  <div className="text-xs text-[#4ecca3] font-medium">{lesson.progress}%</div>
                </div>
                <div className="w-full bg-[#1e2340] rounded-full h-1.5">
                  <div
                    className="bg-[#4ecca3] h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${lesson.progress}%` }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Achievements Placeholder */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-[#e8eaf6] mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-[#f0b15b]" />
          Achievements
        </h3>
        <div className="bg-[#0c0f1a] rounded-xl p-6 text-center">
          <Award className="w-12 h-12 text-[#8890b5] mx-auto mb-3" />
          <p className="text-sm text-[#8890b5]">Complete lessons to earn achievements!</p>
        </div>
      </div>
    </aside>
  );
}