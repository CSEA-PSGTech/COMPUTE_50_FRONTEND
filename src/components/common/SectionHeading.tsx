import React, { useRef } from 'react';
import { useInView } from 'framer-motion';
import { DecryptText } from './DecryptText';

/* Starts the decrypt animation only when the heading scrolls into view,
   so headings further down the page don't finish animating off-screen. */
const DecryptOnView: React.FC<{ text: string; highlight?: string }> = ({ text, highlight }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  return (
    <span ref={ref}>
      {inView ? (
        <DecryptText
          text={text}
          highlightText={highlight}
          highlightClassName="text-[var(--accent)]"
          className="[font-family:inherit]!"
        />
      ) : (
        <span className="opacity-0">{text}</span>
      )}
    </span>
  );
};

export interface SectionHeadingProps {
  badge?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  /** Play the hero-style scramble/decrypt animation on the title */
  decrypt?: boolean;
  /** Part of the title to show in gold (used with decrypt) */
  highlight?: string;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  eyebrow,
  title,
  subtitle,
  align = 'center',
  decrypt = false,
  highlight,
  className = '',
}) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  };

  // "Compute 50" headings get the same decrypt/scramble animation as the home hero,
  // and any standalone "50" is shown in gold.
  const renderTitle = (text: string) => {
    if (decrypt || /compute\s+50/i.test(text)) {
      return (
        <>
          <span className="sr-only">{text}</span>
          <span aria-hidden="true">
            <DecryptOnView
              text={text}
              highlight={highlight ?? (/\b50\b/.test(text) ? '50' : undefined)}
            />
          </span>
        </>
      );
    }
    return text.split(/(\b50\b)/).map((part, i) =>
      part === '50' ? (
        <span key={i} className="text-[var(--accent)]">
          50
        </span>
      ) : (
        part
      )
    );
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
              <span className="animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
            </span>
            <span>{formattedEyebrow}</span>
          </span>
        </div>
      )}
      <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight leading-[1.15] [text-wrap:balance]">
        {renderTitle(title)}
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