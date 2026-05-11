import { BookOpen, Clock, CheckCircle2 } from 'lucide-react';
import type { Module } from '../../types';
import Badge from '../ui/Badge';
import ProgressBar from '../progress/ProgressBar';

interface ModuleCardProps {
  module: Module;
  lessonCount?: number;
  progress?: number;
  status?: 'not_started' | 'in_progress' | 'completed';
  onClick?: () => void;
  className?: string;
}

export default function ModuleCard({
  module,
  lessonCount = 0,
  progress = 0,
  status = 'not_started',
  onClick,
  className = '',
}: ModuleCardProps) {
  const getStatusBadge = () => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="info">In Progress</Badge>;
      default:
        return <Badge variant="default">Not Started</Badge>;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-[#4ecca3]" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-[#5b6af0]" />;
      default:
        return <BookOpen className="w-5 h-5 text-[#8890b5]" />;
    }
  };

  return (
    <button
      onClick={onClick}
      className={`w-full bg-[#0c0f1a] rounded-xl border border-[#1e2340] p-6 hover:border-[#5b6af0]/50 hover:bg-[#1e2340]/50 transition-all group ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${module.color}20`, color: module.color }}
          >
            {module.icon}
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-[#e8eaf6] group-hover:text-[#5b6af0] transition-colors">
              {module.title}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-[#8890b5]">Semester {module.semester}</span>
              <span className="text-xs text-[#8890b5]">•</span>
              <span className="text-xs text-[#8890b5]">{lessonCount} lessons</span>
            </div>
          </div>
        </div>
        {getStatusIcon()}
      </div>

      {/* Description */}
      <p className="text-sm text-[#8890b5] line-clamp-2 mb-4 text-left">
        {module.description}
      </p>

      {/* Progress */}
      {progress > 0 && (
        <div className="mb-4">
          <ProgressBar progress={progress} size="sm" />
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        {getStatusBadge()}
        <div className="flex items-center space-x-2 text-xs text-[#8890b5]">
          <Clock className="w-4 h-4" />
          <span>Updated recently</span>
        </div>
      </div>
    </button>
  );
}