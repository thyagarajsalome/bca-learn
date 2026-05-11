interface ProgressBarProps {
  progress: number;
  color?: 'default' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export default function ProgressBar({ progress, color = 'default', size = 'md', showLabel = false, className = '' }: ProgressBarProps) {
  const colorStyles = {
    default: 'from-[#5b6af0] to-[#4ecca3]',
    success: 'from-[#4ecca3] to-[#3db892]',
    warning: 'from-[#f0b15b] to-[#d49a4a]',
  };

  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-[#8890b5]">Progress</span>
          <span className="text-sm font-medium text-[#e8eaf6]">{clampedProgress}%</span>
        </div>
      )}
      <div className={`w-full bg-[#1e2340] rounded-full overflow-hidden ${sizeStyles[size]}`}>
        <div
          className={`bg-gradient-to-r ${colorStyles[color]} h-full rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}