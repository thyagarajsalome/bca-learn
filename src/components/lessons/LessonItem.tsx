import { CheckCircle2, PlayCircle, Circle, FileText, File, Video, ExternalLink } from 'lucide-react';
import type { Lesson, LessonStatus } from '../../types';

interface LessonItemProps {
  lesson: Lesson;
  status?: LessonStatus;
  isActive?: boolean;
  onClick?: () => void;
}

export default function LessonItem({ lesson, status = 'not_started', isActive = false, onClick }: LessonItemProps) {
  const getTypeIcon = () => {
    switch (lesson.type) {
      case 'pdf':
        return <FileText className="w-4 h-4" />;
      case 'notion':
        return <File className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'external':
        return <ExternalLink className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-[#4ecca3]" />;
      case 'in_progress':
        return <PlayCircle className="w-5 h-5 text-[#5b6af0]" />;
      default:
        return <Circle className="w-5 h-5 text-[#8890b5]" />;
    }
  };

  const getTypeBadge = () => {
    const badges = {
      pdf: { label: 'PDF', color: 'bg-blue-500/20 text-blue-400' },
      notion: { label: 'Notion', color: 'bg-purple-500/20 text-purple-400' },
      video: { label: 'Video', color: 'bg-red-500/20 text-red-400' },
      external: { label: 'External', color: 'bg-orange-500/20 text-orange-400' },
    };
    return badges[lesson.type];
  };

  const badge = getTypeBadge();

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 rounded-lg transition-all ${
        isActive
          ? 'bg-[#5b6af0]/20 border border-[#5b6af0]/50'
          : 'bg-[#0c0f1a] hover:bg-[#1e2340] border border-transparent'
      }`}
    >
      <div className="flex items-center space-x-4 flex-1">
        <div className="flex-shrink-0">
          {getStatusIcon()}
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-medium text-[#e8eaf6]">{lesson.title}</span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${badge.color}`}>
              {badge.label}
            </span>
          </div>
          {lesson.description && (
            <p className="text-xs text-[#8890b5] line-clamp-1">{lesson.description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-3 flex-shrink-0">
        {lesson.duration_minutes && (
          <span className="text-xs text-[#8890b5]">{lesson.duration_minutes}m</span>
        )}
        <div className="p-2 rounded-lg bg-[#1e2340]">
          {getTypeIcon()}
        </div>
      </div>
    </button>
  );
}