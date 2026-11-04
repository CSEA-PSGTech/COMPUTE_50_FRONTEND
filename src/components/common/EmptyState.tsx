import React from 'react';
import { Card } from './Card';
import { Layers } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  category?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Announcing Soon',
  subtitle = 'We are finalizing exciting details for this section. Check back shortly!',
  icon,
  category = 'ANNOUNCEMENT',
  className = '',
}) => {
  return (
    <Card className={`relative overflow-hidden p-8 sm:p-12 text-center border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-2xl shadow-sm ${className}`}>
      {/* Subtle Shimmer Bar Overlay */}
      <div className="absolute inset-0 pointer-events-none animate-shimmer opacity-40" />

      <div className="relative z-10 flex flex-col items-center max-w-md mx-auto space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[var(--accent-muted)] border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] shrink-0">
          {icon || <Layers className="w-7 h-7" />}
        </div>

        <div className="space-y-1.5">
          <span className="font-mono text-xs font-bold text-[var(--accent)] tracking-widest uppercase block">
            // {category}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="pt-2">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-full text-xs font-mono font-medium text-[var(--text-secondary)]">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            Stay Tuned
          </span>
        </div>
      </div>
    </Card>
  );
};
