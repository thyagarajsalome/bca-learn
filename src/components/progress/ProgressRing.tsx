import { CheckCircle2, Circle, PlayCircle } from 'lucide-react';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  showIcon?: boolean;
  className?: string;
}

export default function ProgressRing({ progress, size = 40, strokeWidth = 3, showIcon = false, className = '' }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const getIcon = () => {
    if (clampedProgress === 100) {
      return <CheckCircle2 className="w-5 h-5 text-[#4ecca3]" />;
    } else if (clampedProgress > 0) {
      return <PlayCircle className="w-5 h-5 text-[#5b6af0]" />;
    }
    return <Circle className="w-5 h-5 text-[#8890b5]" />;
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e2340"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5b6af0" />
            <stop offset="100%" stopColor="#4ecca3" />
          </linearGradient>
        </defs>
      </svg>
      {showIcon && (
        <div className="absolute inset-0 flex items-center justify-center">
          {getIcon()}
        </div>
      )}
    </div>
  );
}