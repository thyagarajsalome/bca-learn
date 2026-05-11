import { TrendingUp } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface OverallProgressProps {
  overallPercent: number;
  moduleProgress?: Record<string, { completed: number; total: number; title: string; color: string }>;
  className?: string;
}

export default function OverallProgress({ overallPercent, moduleProgress = {}, className = '' }: OverallProgressProps) {
  return (
    <div className={`bg-[#0c0f1a] rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#e8eaf6] flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-[#4ecca3]" />
          Overall Progress
        </h3>
        <div className="text-3xl font-bold text-[#e8eaf6]">{overallPercent}%</div>
      </div>

      <ProgressBar progress={overallPercent} size="lg" className="mb-6" />

      {Object.keys(moduleProgress).length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-[#8890b5] uppercase tracking-wide">By Subject</h4>
          {Object.entries(moduleProgress).map(([moduleId, data]) => {
            const percent = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
            return (
              <div key={moduleId} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#e8eaf6]">{data.title}</span>
                  <span className="text-sm text-[#8890b5]">{data.completed}/{data.total}</span>
                </div>
                <div className="w-full bg-[#1e2340] rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: data.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}