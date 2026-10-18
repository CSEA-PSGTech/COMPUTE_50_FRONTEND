import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  HelpCircle,
  X,
  Phone,
  Mail,
  ExternalLink,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { EVENT_CONFIG, SUPPORT_CONTACTS } from '../../config/event';
import { soundModalOpen, soundModalClose } from '../../lib/sound';

export const FloatingSupport: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const isAuthPage = location.pathname === '/login';
  const hasRegisterInBottomNav =
    !isAuthPage && location.pathname !== '/register' && location.pathname !== '/profile';

  // Responsive bottom offset: places Help button safely above BottomNav's Register CTA on mobile
  const bottomPositionClass = isAuthPage
    ? 'bottom-6 md:bottom-8'
    : hasRegisterInBottomNav
    ? 'bottom-[calc(142px+env(safe-area-inset-bottom,0px))] md:bottom-8'
    : 'bottom-[calc(80px+env(safe-area-inset-bottom,0px))] md:bottom-8';

  const handleOpen = () => {
    soundModalOpen();
    setIsOpen(true);
  };

  const handleClose = () => {
    soundModalClose();
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  // Close on Escape key press and manage focus
  useEffect(() => {
    if (!isOpen) return;

    // Auto-focus close button when dialog opens
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen]);

  return (
    <>
      {/* Symmetrical Floating Trigger Button (Bottom-Left, elevated above BottomNav) */}
      <div className={`fixed ${bottomPositionClass} left-3 sm:left-6 z-40 transition-all duration-200`}>
        <motion.button
          ref={triggerRef}
          type="button"
          onClick={handleOpen}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
          className="group flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--accent)] text-[var(--text-primary)] shadow-lg hover:shadow-xl transition-all cursor-pointer select-none"
          aria-label="Open CSEA Support & Helpdesk"
          title="Need Help? Open CSEA Helpdesk"
        >
          {/* Pulsing Status Dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--accent)]" />
          </span>

          <HelpCircle className="w-4 h-4 text-[var(--accent)] shrink-0 transition-transform duration-200 group-hover:rotate-12" />

          <span className="text-xs font-mono font-bold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
            <span className="hidden sm:inline">Need Help?</span>
            <span className="sm:hidden">Help</span>
          </span>
        </motion.button>
      </div>

      {/* Flyout Support Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-end md:items-end justify-start p-4 sm:p-6 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Flyout Card */}
            <motion.div
              ref={drawerRef}
              data-lenis-prevent
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.95, y: 20 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.95, y: 20 }
              }
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full sm:w-[420px] max-w-[calc(100vw-32px)] bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh] mb-[calc(142px+env(safe-area-inset-bottom,0px))] md:mb-12"
              role="dialog"
              aria-modal="true"
              aria-labelledby="support-drawer-title"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-[var(--border-color)] flex items-start justify-between bg-[var(--bg-secondary)]/60">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-bold text-[var(--accent)] tracking-widest uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[var(--accent)]" />
                    CSEA HELPDESK // COMPUTE 50
                  </span>
                  <h3
                    id="support-drawer-title"
                    className="text-base sm:text-lg font-black font-mono text-[var(--text-primary)]"
                  >
                    Participant Assistance
                  </h3>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Have questions? Contact the coordinator team directly.
                  </p>
                </div>

                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={handleClose}
                  className="p-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  aria-label="Close Helpdesk"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Channels List */}
              <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto">
                {/* 1. Official WhatsApp Community Banner */}
                {EVENT_CONFIG.whatsappLink && (
                  <a
                    href={EVENT_CONFIG.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[var(--accent-muted)] border border-[var(--accent)]/40 hover:border-[var(--accent)] flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--accent)] text-black flex items-center justify-center font-bold shrink-0">
                        <MessageCircle className="w-4 h-4 text-black" />
                      </div>
                      <div>
                        <h4 className="text-xs font-mono font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                          Join WhatsApp Helpdesk
                        </h4>
                        <p className="text-[10px] text-[var(--text-secondary)]">
                          Fastest response for queries & announcements
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[var(--accent)] shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </a>
                )}

                {/* 2. Direct Support Contacts */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold text-[var(--text-secondary)] uppercase tracking-wider block">
                    Direct Contact Channels
                  </span>

                  {SUPPORT_CONTACTS.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--border-color)]/80 transition-all text-left space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-[var(--accent)] uppercase tracking-wider">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                          {item.contactName}
                        </span>
                      </div>

                      <p className="text-[11px] text-[var(--text-secondary)]">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono">
                        {item.phone && (
                          <a
                            href={`tel:${item.phone.replace(/[^0-9+]/g, '')}`}
                            className="inline-flex items-center gap-1.5 text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors font-medium"
                          >
                            <Phone className="w-3 h-3 text-[var(--accent)]" />
                            <span>{item.phone}</span>
                          </a>
                        )}
                        <a
                          href={`mailto:${item.email}?subject=Compute 50 Query [${item.category}]`}
                          className="inline-flex items-center gap-1.5 text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors font-medium"
                        >
                          <Mail className="w-3 h-3 text-[var(--accent)]" />
                          <span>{item.email}</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
