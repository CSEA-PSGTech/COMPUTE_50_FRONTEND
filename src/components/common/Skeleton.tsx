import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'rect';
  width?: string;
  height?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rect',
  width,
  height,
  count = 1,
}) => {
  const baseClasses = 'animate-pulse bg-[var(--bg-secondary)] rounded';

  const variantClasses = {
    text: 'h-4 rounded-md',
    circle: 'rounded-full',
    rect: 'rounded-xl',
  };

  const style: React.CSSProperties = {
    width: width || '100%',
    height: height || (variant === 'text' ? '16px' : variant === 'circle' ? '48px' : '80px'),
  };

  if (variant === 'circle') {
    style.width = style.height;
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${baseClasses} ${variantClasses[variant]} ${className}`}
          style={style}
        />
      ))}
    </>
  );
};

// Pre-composed skeleton layouts
export const ProfileSkeleton: React.FC = () => (
  <div className="py-16 bg-[var(--bg-main)] min-h-screen">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-[var(--border-color)]">
        <div className="space-y-3 flex-1">
          <Skeleton variant="text" width="120px" height="14px" />
          <Skeleton variant="text" width="280px" height="28px" />
          <Skeleton variant="text" width="380px" height="16px" />
        </div>
        <Skeleton variant="rect" width="100px" height="36px" className="rounded-lg" />
      </div>

      <div className="space-y-8">
        {/* Personal Details skeleton */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton variant="text" width="160px" height="20px" />
            <Skeleton variant="rect" width="80px" height="32px" className="rounded-lg" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton variant="text" width="80px" height="12px" />
                <Skeleton variant="text" width="180px" height="16px" />
              </div>
            ))}
          </div>
        </div>

        {/* Status Card skeleton */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-6">
          <div className="flex items-center gap-3.5">
            <Skeleton variant="circle" height="40px" width="40px" />
            <div className="space-y-2">
              <Skeleton variant="text" width="140px" height="16px" />
              <Skeleton variant="text" width="240px" height="14px" />
            </div>
          </div>
        </div>

        {/* Team Section skeleton */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-6">
          <Skeleton variant="text" width="140px" height="20px" className="mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton variant="circle" height="36px" />
                <div className="space-y-1 flex-1">
                  <Skeleton variant="text" width="140px" height="14px" />
                  <Skeleton variant="text" width="200px" height="12px" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
