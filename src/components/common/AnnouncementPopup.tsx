import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export interface AnnouncementPopupProps {
  feePerPerson?: string;
  round?: string;
}

/* Compact info-only event-ticket strip: dark round stub, perforated tear line, one-line message. */
export const AnnouncementPopup: React.FC<AnnouncementPopupProps> = ({
  feePerPerson = '₹150 / person',
  round = '01',
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    try {
      sessionStorage.removeItem('announcement_dismissed');
    } catch {
      // Ignore in restricted environments
    }
  }, []);

  return (
    <AnimatePresence initial={!shouldReduceMotion}>
      {isVisible && (
        <motion.aside
          key="announcement"
          aria-label="Event announcement"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, height: 0, paddingTop: 0, paddingBottom: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-30 w-full flex justify-center px-3 pt-3 pb-1 pointer-events-none"
        >
          <div className="pointer-events-auto relative flex items-stretch max-w-full h-14 sm:h-16 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-[0_12px_28px_-18px_rgba(28,24,20,0.55)]">
            {/* Stub */}
            <div className="shrink-0 flex flex-col items-center justify-center rounded-l-2xl bg-[#1C1814] px-3.5 sm:px-5">
              <span className="font-mono text-[8px] sm:text-[9px] font-bold tracking-[0.3em] text-[#F5EFE6]/60 uppercase leading-none">
                Round
              </span>
              <span className="font-mono text-xl sm:text-2xl font-black leading-none text-[var(--accent)] my-0.5 sm:my-1">
                {round}
              </span>
              <span className="inline-flex items-center gap-1 leading-none">
                <span className="relative flex h-1.5 w-1.5">
                  {!shouldReduceMotion && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  )}
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                <span className="font-mono text-[8px] sm:text-[9px] font-bold tracking-[0.2em] text-emerald-300 uppercase">
                  Live
                </span>
              </span>
            </div>

            {/* Perforation */}
            <div className="relative w-0 shrink-0" aria-hidden="true">
              <span className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[var(--bg-main)] shadow-[inset_0_-1px_0_var(--border-color)]" />
              <span className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-4 h-4 rounded-full bg-[var(--bg-main)] shadow-[inset_0_1px_0_var(--border-color)]" />
              <span className="absolute top-2.5 bottom-2.5 left-0 border-l-2 border-dashed border-[var(--border-color)]" />
            </div>

            {/* Message */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 pl-4 sm:pl-6 pr-2 sm:pr-3">
              <div className="min-w-0">
                <span className="hidden sm:block font-mono text-[10px] font-bold tracking-[0.25em] text-[var(--accent-hover)] uppercase leading-none mb-1.5">
                  // Compute 50
                </span>
                <span className="block text-[13px] sm:text-[15px] font-extrabold tracking-tight text-[var(--text-primary)] whitespace-nowrap leading-tight">
                  <span className="sm:hidden">Registrations open</span>
                  <span className="hidden sm:inline">Round {Number(round)} registrations are open</span>
                </span>
              </div>
              <span className="font-mono text-[11px] sm:text-xs font-bold text-[var(--text-primary)] bg-[var(--accent-muted)] border border-[var(--accent)]/30 px-2 py-1 rounded-lg whitespace-nowrap shrink-0">
                {feePerPerson}
              </span>

              <button
                type="button"
                onClick={() => setIsVisible(false)}
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