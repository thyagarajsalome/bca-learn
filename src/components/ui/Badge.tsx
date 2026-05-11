interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md';
}

export default function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  const variantStyles = {
    default: 'bg-[#1e2340] text-[#8890b5]',
    success: 'bg-[#4ecca3]/20 text-[#4ecca3]',
    warning: 'bg-[#f0b15b]/20 text-[#f0b15b]',
    info: 'bg-[#5b6af0]/20 text-[#5b6af0]',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {children}
    </span>
  );
}