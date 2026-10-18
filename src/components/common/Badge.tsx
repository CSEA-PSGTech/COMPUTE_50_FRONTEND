import React, { ReactNode } from 'react';

export interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    primary: 'bg-[var(--accent-muted)] text-[var(--text-primary)] border border-[var(--accent)]/50 font-mono font-semibold',
    secondary: 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)]',
    success: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 border border-emerald-500/30 font-semibold',
    warning: 'bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-500/30 font-semibold',
    error: 'bg-red-500/15 text-red-800 dark:text-red-400 border border-red-500/30 font-semibold',
    info: 'bg-cyan-500/15 text-cyan-900 dark:text-cyan-300 border border-cyan-500/30 font-semibold',
    outline: 'bg-transparent text-[var(--text-primary)] border border-[var(--border-color)] font-medium',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-medium rounded',
    md: 'px-2.5 py-1 text-xs font-semibold rounded-md',
  };

  return (
    <span className={`inline-flex items-center gap-1 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
};
