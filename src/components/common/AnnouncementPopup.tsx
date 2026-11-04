import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface AnnouncementPopupProps {
  feePerPerson?: string;
}

export const AnnouncementPopup: React.FC<AnnouncementPopupProps> = ({
  feePerPerson = '₹150 / person',
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();
  const hideRegister = isAuthenticated || pathname === '/register' || pathname === '/profile';

  useEffect(() => {
    try {
      sessionStorage.removeItem('announcement_dismissed');
    } catch {
      // Ignore in restricted environments
    }
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <aside
          aria-label="Event Announcement"
          className="relative z-30 w-full flex justify-center px-3 pt-2.5 pb-1 pointer-events-none select-none transition-colors"
        >
          {/* Centered Floating Cyber Capsule */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto relative inline-flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[var(--bg-surface)]/95 backdrop-blur-xl border border-[var(--border-color)] hover:border-[var(--accent)]/50 shadow-[0_4px_20px_rgba(0,0,0,0.18)] text-xs text-[var(--text-primary)] max-w-[calc(100vw-1.5rem)] transition-all group shrink-0"
          >
            {/* Ambient Breathing Border Glow */}
            <div
              className="absolute -inset-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10"
              style={{
                boxShadow: '0 0 16px rgba(var(--accent-rgb), 0.25)',
              }}
            />

            {/* LIVE Radar Beacon + Label */}
            <Link
              to="/hackathon"
              className="flex items-center gap-1.5 shrink-0 hover:opacity-85 transition-opacity"
              title="View Hackathon Rounds"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-mono font-extrabold text-[10px] sm:text-[11px] text-[var(--text-primary)] tracking-wider uppercase shrink-0 whitespace-nowrap">
                <span className="hidden md:inline">Round 1 </span>Live
              </span>
            </Link>

            <span className="text-[var(--border-color)] select-none">·</span>

            {/* Fee Pill */}
            <span className="font-mono text-[10px] sm:text-[11px] text-[var(--accent)] font-bold shrink-0 whitespace-nowrap">
              <span className="hidden sm:inline">Fee: </span>{feePerPerson}
            </span>

            {/* Register CTA (Shown on md+ screens; hidden on mobile to avoid overflow and redundancy with mobile bottom bar) */}
            {!hideRegister && (
              <>
                <span className="text-[var(--border-color)] select-none hidden md:inline">·</span>
                <Link
                  to="/register"
                  className="hidden md:inline-flex items-center gap-1 text-[var(--text-primary)] hover:text-[var(--accent)] font-mono font-bold text-[11px] transition-colors shrink-0 group/link whitespace-nowrap"
                >
                  <span>Register</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--accent)] transition-transform duration-200 group-hover/link:translate-x-0.5" />
                </Link>
              </>
            )}

            {/* Subtle Divider */}
            <span className="w-[1px] h-3 bg-[var(--border-color)] shrink-0 select-none mx-0.5" />

            {/* Dismiss Button */}
            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-0.5 rounded-full hover:bg-[var(--border-color)]/40 cursor-pointer shrink-0"
              aria-label="Dismiss announcement"
              title="Dismiss announcement"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        </aside>
      )}
    </AnimatePresence>
  );
};