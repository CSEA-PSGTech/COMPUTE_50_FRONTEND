import React from 'react';

export interface SectionHeadingProps {
  badge?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = '',
}) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  };

  const labelText = eyebrow || badge;
  const formattedEyebrow = labelText
    ? labelText.startsWith('//')
      ? labelText
      : `// ${labelText.toUpperCase()}`
    : null;

  return (
    <div className={`max-w-3xl mb-12 sm:mb-16 ${alignmentClasses[align]} ${className}`}>
      {formattedEyebrow && (
        <div className="mb-3">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs font-bold text-[var(--accent)] tracking-widest uppercase py-1 px-3 bg-[var(--accent-muted)] rounded-full border border-[var(--accent)]/30 shadow-[0_0_12px_rgba(var(--accent-rgb),0.12)]">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
            </span>
            <span>{formattedEyebrow}</span>
          </span>
        </div>
      )}
      <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight leading-[1.15] [text-wrap:balance]">
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3.5 text-[15px] sm:text-base text-[var(--text-secondary)] font-normal leading-[1.7] max-w-2xl ${
            align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : ''
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
