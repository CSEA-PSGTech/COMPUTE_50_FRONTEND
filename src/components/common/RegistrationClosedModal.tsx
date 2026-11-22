import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock} from 'lucide-react';

/**
 * Compute 50 — "Registrations are closed" popup.
 * Shows on load, above everything. Dismissible (X / Escape / backdrop).
 * Mount it once near the top of your app, e.g. in App.tsx:
 *   <RegistrationClosedModal />
 * Pass `oncePerSession` to show it only once per browser tab.
 */
export default function RegistrationClosedModal({
  heading = 'Registrations are closed',
  subnote = 'Thank you for the incredible interest in Compute 50. Stay tuned on our WhatsApp group for what comes next.',
  oncePerSession = false,
  storageKey = 'c50-reg-closed-popup',
}: {
  heading?: string;
  subnote?: string;
  oncePerSession?: boolean;
  storageKey?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (oncePerSession && sessionStorage.getItem(storageKey) === 'seen') return;
    setOpen(true);
  }, [oncePerSession, storageKey]);

  const close = useCallback(() => {
    setOpen(false);
    if (oncePerSession) sessionStorage.setItem(storageKey, 'seen');
  }, [oncePerSession, storageKey]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Registrations are closed"
        >
          <div
            className="absolute inset-0 backdrop-blur-md"
            style={{
              background:
                'radial-gradient(60% 60% at 50% 38%, rgba(251,191,36,0.18), rgba(5,4,2,0.88))',
            }}
          />

          <motion.div
            className="relative mx-auto w-full max-w-[460px] overflow-hidden rounded-3xl border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-2xl"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-[var(--accent)]/40 via-[var(--accent)] to-[var(--accent)]/40" />

            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-main)]/80 text-[var(--text-secondary)] backdrop-blur-md transition-all hover:text-[var(--text-primary)] active:scale-95 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="px-6 pb-7 pt-8 sm:px-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent-muted)] text-[var(--accent)]">
                <Lock className="h-8 w-8" />
              </div>

              <p className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
                Compute 50
              </p>
              <h2 className="mt-2 text-2xl sm:text-[28px] font-extrabold text-[var(--text-primary)] leading-tight">
                {heading}
              </h2>
              
              

              {subnote && (
                <p className="mt-4 text-[13px] text-[var(--text-secondary)]/80 leading-relaxed">{subnote}</p>
              )}

              <button
                type="button"
                onClick={close}
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-6 py-3 text-[15px] font-bold text-[var(--accent-text,#0A0A0A)] transition-all hover:opacity-90 active:scale-95 cursor-pointer"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}