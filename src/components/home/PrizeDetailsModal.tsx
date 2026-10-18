import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Trophy, Medal, Award, Gift, CheckCircle2, ShieldAlert } from 'lucide-react';
import { prizeData } from '../../data/prizes';
import { useSmoothScroll } from '../../context/SmoothScrollContext';
import { soundModalClose } from '../../lib/sound';

interface PrizeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrizeDetailsModal: React.FC<PrizeDetailsModalProps> = ({ isOpen, onClose }) => {
  const shouldReduceMotion = useReducedMotion();
  const modalRef = useRef<HTMLDivElement>(null);
  const { stop, start } = useSmoothScroll();

  const handleClose = () => {
    soundModalClose();
    onClose();
  };

  // Close on Escape key press & handle focus trap
  useEffect(() => {
    if (!isOpen) return;

    stop();
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Auto focus modal container on open
    modalRef.current?.focus();

    return () => {
      start();
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, stop, start]);

  const getRankIcon = (rank: string) => {
    if (rank.includes('1st')) return <Trophy className="w-6 h-6 text-[var(--accent)] shrink-0" />;
    if (rank.includes('2nd')) return <Medal className="w-6 h-6 text-amber-500 shrink-0" />;
    return <Award className="w-6 h-6 text-amber-600 shrink-0" />;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            aria-hidden="true"
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="prize-modal-title"
            data-lenis-prevent
            initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 focus:outline-none max-h-[85vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[var(--border-color)] pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-[var(--accent)] tracking-widest uppercase block mb-1">
                  OFFICIAL BREAKDOWN
                </span>
                <h2 id="prize-modal-title" className="text-2xl sm:text-3xl font-black font-mono text-[var(--text-primary)] leading-tight">
                  Compute 50 Prize Pool
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium mt-1">
                  Total Rewards: <span className="text-[var(--accent)] font-bold">{prizeData.totalFormatted}</span>
                </p>
              </div>

              <button
                onClick={handleClose}
                aria-label="Close modal"
                className="p-2 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)] hover:border-[var(--accent)] transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Podium Prizes List */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                // Main Podium Rewards
              </h3>
              <div className="grid gap-3">
                {prizeData.items.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all ${
                      item.isGrandWinner
                        ? 'bg-[var(--accent)]/10 border-[var(--accent)]/50 shadow-[0_0_15px_rgba(var(--accent-rgb),0.15)]'
                        : 'bg-[var(--bg-secondary)] border-[var(--border-color)]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {getRankIcon(item.rank)}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-[var(--accent)] uppercase">{item.rank}</span>
                            <span className="text-sm font-bold text-[var(--text-primary)]">{item.title}</span>
                          </div>
                          <p className="text-xs text-[var(--text-secondary)] mt-1">{item.description}</p>
                        </div>
                      </div>
                      <span className="text-lg sm:text-xl font-extrabold font-mono text-[var(--text-primary)] shrink-0">
                        {item.amountFormatted}
                      </span>
                    </div>

                    {item.perks && item.perks.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[var(--border-color)]/50 text-[11px] text-[var(--text-secondary)]">
                        {item.perks.map((perk, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 font-mono">
                            <CheckCircle2 className="w-3 h-3 text-[var(--accent)] shrink-0" />
                            {perk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Track Prizes */}
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-[var(--accent)] shrink-0" />
                  <span className="text-sm font-bold font-mono text-[var(--text-primary)]">
                    {prizeData.trackPrizes.label}
                  </span>
                </div>
                <span className="text-base font-bold font-mono text-[var(--accent)]">
                  {prizeData.trackPrizes.amountFormatted}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">{prizeData.trackPrizes.description}</p>
            </div>

            {/* General Rules & Compliance */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-[var(--accent)]" />
                // Distribution Rules
              </h3>
              <ul className="space-y-1.5 text-xs text-[var(--text-secondary)] list-disc list-inside font-mono">
                {prizeData.rules.map((rule, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
