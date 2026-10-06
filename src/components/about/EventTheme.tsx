import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { Badge } from '../common/Badge';

export const EventTheme: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const timelineRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 85%', 'end 50%'],
  });

  const scaleProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 30,
    restDelta: 0.001,
  });

  const milestones = [
    { label: '1951 - PSG College of Technology established' },
    { label: '50 years of M.E. Computer Science and Engineering' },
    { label: '2026 - Compute 50' },
  ];

  return (
    <div className="space-y-12">
      {/* 1. Page Hero */}
      <div className="text-center space-y-4 max-w-4xl mx-auto pt-4">
        <div className="flex justify-center">
          <Badge variant="primary" className="px-3 py-1 font-mono text-xs">
            2026 EDITION
          </Badge>
        </div>

        {/* Display Title: From Legacy to Limitless */}
        <h1
          className="font-black font-mono tracking-tight leading-none text-center select-none"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)' }}
        >
          <span className="text-[var(--text-secondary)] font-medium">From </span>
          <span className="text-[var(--text-secondary)]">Legacy </span>
          <span className="text-[var(--text-secondary)] font-medium">to </span>
          <motion.span
            initial={shouldReduceMotion ? { opacity: 1, color: 'var(--accent)' } : { opacity: 0.4 }}
            whileInView={shouldReduceMotion ? { opacity: 1, color: 'var(--accent)' } : { opacity: 1, color: 'var(--accent)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="font-extrabold inline-block"
          >
            Limitless
          </motion.span>
        </h1>

        {/* Sub-headline */}
        <p className="text-lg sm:text-2xl font-semibold text-[var(--text-primary)] tracking-wide">
          Celebrating 50 Years. Creating the Next.
        </p>
      </div>

      {/* 2. Timeline Strip Below Hero */}
      <div ref={timelineRef} className="relative max-w-4xl mx-auto py-6 px-4">
        {/* Desktop Horizontal Line Container */}
        <div className="hidden md:block relative mb-8">
          {/* Base Line */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[var(--border-color)] -translate-y-1/2" />
          {/* Animated Draw Line */}
          <motion.div
            className="absolute top-1/2 left-0 right-0 h-[2px] bg-[var(--accent)] origin-left -translate-y-1/2"
            style={{ scaleX: shouldReduceMotion ? 1 : scaleProgress }}
          />

          {/* 3 Milestone Dots & Cards */}
          <div className="relative z-10 grid grid-cols-3 gap-4 text-center">
            {milestones.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-[var(--bg-main)] border-2 border-[var(--accent)] flex items-center justify-center mb-3 shadow-md">
                  <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                </div>
                <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-xs w-full min-h-[72px] flex items-center justify-center">
                  <p className="text-xs font-mono font-bold text-[var(--text-primary)] leading-snug">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Vertical Line Container */}
        <div className="block md:hidden relative pl-6 space-y-6 border-l-2 border-[var(--border-color)] ml-2">
          <motion.div
            className="absolute top-0 bottom-0 left-[-2px] w-[2px] bg-[var(--accent)] origin-top"
            style={{ scaleY: shouldReduceMotion ? 1 : scaleProgress }}
          />
          {milestones.map((item, idx) => (
            <div key={idx} className="relative">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[var(--bg-main)] border-2 border-[var(--accent)] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              </div>
              <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-xs">
                <p className="text-xs font-mono font-bold text-[var(--text-primary)] leading-snug">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
