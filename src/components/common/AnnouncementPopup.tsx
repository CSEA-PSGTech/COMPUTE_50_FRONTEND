import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, X, MessageCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EVENT_CONFIG } from '../../config/event';

export interface AnnouncementPopupProps {
  message?: string;
  badge?: string;
}

export const AnnouncementPopup: React.FC<AnnouncementPopupProps> = ({
  message = 'Registrations for Compute 50 Hackathon are ONGOING! Form your team and register now.',
  badge = 'NOTIFICATION',
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  // Clear any stale sessionStorage lockout so the notification always appears
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
        <motion.aside
          initial={{ opacity: 0, y: -24, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -24, height: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Important Announcement"
          className="relative z-50 bg-[var(--accent-muted)] border-b border-[var(--border-color)] text-[var(--text-primary)] px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs transition-colors shadow-xs overflow-hidden"
        >
          {/* Subtle Ambient Shimmer Sweep */}
          <div
            className="absolute inset-0 animate-shimmer opacity-35 pointer-events-none"
            aria-hidden="true"
          />

          <div className="max-w-[1240px] mx-auto flex items-center justify-between gap-2 sm:gap-3 relative z-10 w-full overflow-hidden flex-nowrap">
            {/* Left: Ringing Notification Bell & Badge */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Ringing Notification Bell Icon */}
              <div className="relative flex items-center justify-center p-1 rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/30 shrink-0">
                <Bell className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--accent)] animate-bell-ring" />
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
                </span>
              </div>

              {/* Notification Badge */}
              <span className="bg-[var(--accent)] text-[var(--accent-text)] px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold tracking-wider shrink-0 uppercase font-mono shadow-[0_0_8px_rgba(var(--accent-rgb),0.3)]">
                {badge}
              </span>
            </div>

            {/* Center: Seamless Horizontal Marquee Track (Ultra-compact, single-line ticker) */}
            <div
              className="flex-1 min-w-0 overflow-hidden relative h-5 sm:h-6 flex items-center select-none"
              style={{
                maskImage: 'linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)',
              }}
            >
              <div className="animate-marquee-ticker flex items-center gap-6 whitespace-nowrap text-xs font-semibold text-[var(--text-primary)] tracking-tight">
                <span className="flex items-center gap-6 shrink-0">
                  <span>{message}</span>
                  <span className="text-[var(--accent)] font-bold text-xs select-none">✦</span>
                  <span>{message}</span>
                  <span className="text-[var(--accent)] font-bold text-xs select-none">✦</span>
                </span>
                <span className="flex items-center gap-6 shrink-0" aria-hidden="true">
                  <span>{message}</span>
                  <span className="text-[var(--accent)] font-bold text-xs select-none">✦</span>
                  <span>{message}</span>
                  <span className="text-[var(--accent)] font-bold text-xs select-none">✦</span>
                </span>
              </div>
            </div>

            {/* Right: Register Now CTA, WhatsApp & Dismiss */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Link
                to="/register"
                className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-zinc-950 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-tight shadow-xs transition-all hover:scale-105 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Register</span>
                <span className="hidden sm:inline"> Now</span>
                <ArrowRight className="w-3 h-3" />
              </Link>

              {EVENT_CONFIG.whatsappLink && (
                <a
                  href={EVENT_CONFIG.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-[11px] font-medium shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
                  title="PSG Tech Compute 50 WhatsApp Group"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>WhatsApp</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => setIsVisible(false)}
                className="p-1 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-color)]/40 transition-colors cursor-pointer shrink-0"
                aria-label="Dismiss announcement"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

