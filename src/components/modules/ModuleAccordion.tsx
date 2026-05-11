import { useState } from 'react';
import { ChevronDown, BookOpen } from 'lucide-react';
import type { Module, Lesson, LessonStatus } from '../../types';
import LessonItem from '../lessons/LessonItem';
import ProgressRing from '../progress/ProgressRing';
import Badge from '../ui/Badge';

interface ModuleAccordionProps {
  module: Module;
  lessons: Lesson[];
  progressMap?: Record<string, LessonStatus>;
  activeLessonId?: string;
  onLessonClick?: (lesson: Lesson) => void;
  isDefaultOpen?: boolean;
}

export default function ModuleAccordion({
  module,
  lessons,
  progressMap = {},
  activeLessonId,
  onLessonClick,
  isDefaultOpen = false,
}: ModuleAccordionProps) {
  const [isOpen, setIsOpen] = useState(isDefaultOpen);

  const completedLessons = lessons.filter(lesson => progressMap[lesson.id] === 'completed').length;
  const totalLessons = lessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const getStatusBadge = () => {
    if (progressPercent === 100) {
      return <Badge variant="success">Complete</Badge>;
    } else if (progressPercent > 0) {
      return <Badge variant="info">In Progress</Badge>;
    }
    return <Badge variant="default">New</Badge>;
  };

  const sortedLessons = [...lessons].sort((a, b) => a.order_index - b.order_index);

  return (
    <div className="bg-[#0c0f1a] rounded-xl border border-[#1e2340] overflow-hidden">
      {/* Module Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between hover:bg-[#1e2340]/50 transition-colors"
      >
        <div className="flex items-center space-x-4 flex-1">
          {/* Module Icon */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${module.color}20`, color: module.color }}
          >
            {module.icon}
          </div>

          {/* Module Info */}
          <div className="flex-1 text-left">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-[#e8eaf6]">{module.title}</h3>
              {getStatusBadge()}
            </div>
            <p className="text-sm text-[#8890b5] line-clamp-1">{module.description}</p>
          </div>

          {/* Progress and Stats */}
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#e8eaf6]">{totalLessons}</div>
              <div className="text-xs text-[#8890b5]">Lessons</div>
            </div>
            <ProgressRing progress={progressPercent} size={48} showIcon />
          </div>
        </div>

        {/* Chevron */}
        <ChevronDown
          className={`w-6 h-6 text-[#8890b5] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Lessons List */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 pt-0 space-y-2">
          {sortedLessons.length > 0 ? (
            sortedLessons.map((lesson) => (
              <LessonItem
                key={lesson.id}
                lesson={lesson}
                status={progressMap[lesson.id]}
                isActive={activeLessonId === lesson.id}
                onClick={() => onLessonClick?.(lesson)}
              />
            ))
          ) : (
            <div className="text-center py-8 text-[#8890b5]">
              <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No lessons available yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}