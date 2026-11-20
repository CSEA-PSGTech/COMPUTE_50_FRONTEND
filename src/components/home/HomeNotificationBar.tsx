import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export const HomeNotificationBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const shouldReduceMotion = useReducedMotion();

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          key="home-r1-notification"
          aria-label="Round 1 announcement"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: -8, height: 0, paddingTop: 0, paddingBottom: 0 }
          }
          transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-30 w-full flex justify-center px-3 pt-2.5 pb-1 pointer-events-none"
        >
          <div className="pointer-events-auto relative flex items-center justify-between gap-3 sm:gap-4 max-w-full min-h-14 sm:h-16 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-[0_12px_28px_-18px_rgba(28,24,20,0.55)] px-3.5 sm:px-5">
            {/* Left: Icon & Description */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--accent-muted)] border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              <div className="min-w-0">
                <span className="hidden sm:block font-mono text-[10px] font-bold tracking-[0.2em] text-[var(--accent)] uppercase leading-none mb-1">
                  // Round 1 Announcement
                </span>
                <p className="text-[13px] sm:text-[14px] font-bold text-[var(--text-primary)] truncate">
                  Round 1 domains & prototype details are live!
                </p>
              </div>
            </div>

            {/* Right: Action & Close button */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <Link
                to="/hackathon#round1"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[var(--accent)] hover:brightness-110 text-[var(--accent-text)] font-mono text-xs sm:text-sm font-bold transition-all shadow-xs group whitespace-nowrap"
              >
                <span>Know More</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>

              <button
                type="button"
                onClick={handleDismiss}
                className="shrink-0 w-8 h-8 inline-flex items-center justify-center rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                aria-label="Dismiss announcement"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};


