import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useSmoothScroll } from '../../context/SmoothScrollContext';
import compute50Logo from '../../assets/logos/compute 50 logo.png';

interface IntroLoaderProps {
  onComplete?: () => void;
}

export const IntroLoader: React.FC<IntroLoaderProps> = ({ onComplete }) => {
  const [loading, setLoading] = useState(() => {
    try {
      return !sessionStorage.getItem('compute50_intro_seen');
    } catch {
      return true;
    }
  });
  const shouldReduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(() => (shouldReduceMotion ? 100 : 0));
  const { stop: stopScroll, start: startScroll } = useSmoothScroll();

  // Stable ref for scroll controls to prevent re-triggering the timer effect
  const scrollControlsRef = useRef({ stop: stopScroll, start: startScroll });
  useEffect(() => {
    scrollControlsRef.current = { stop: stopScroll, start: startScroll };
  }, [stopScroll, startScroll]);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const finishLoader = useCallback(() => {
    setLoading(false);
    try {
      sessionStorage.setItem('compute50_intro_seen', 'true');
    } catch {
      // sessionStorage unavailable in restricted environments
    }
    if (onCompleteRef.current) onCompleteRef.current();
  }, []);

  // Keyboard shortcut: Press Escape to immediately skip the loader
  useEffect(() => {
    if (!loading) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        finishLoader();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loading, finishLoader]);

  useEffect(() => {
    if (!loading) {
      if (onCompleteRef.current) onCompleteRef.current();
      return;
    }

    // Lock page scrolling and stop Lenis during initial loading sequence
    scrollControlsRef.current.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Fast-path for reduced motion preferences
    if (shouldReduceMotion) {
      const timer = setTimeout(() => {
        document.body.style.overflow = prevOverflow;
        scrollControlsRef.current.start();
        finishLoader();
      }, 400);
      return () => clearTimeout(timer);
    }

    // Phased progress pacing over ~2.8 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        // Realistic organic pacing across 4 phases
        let step = 1;
        if (prev < 32) {
          step = 1.2; // Initial core startup
        } else if (prev < 72) {
          step = 0.9; // Archive loading
        } else if (prev < 92) {
          step = 0.7; // Arena calibration
        } else {
          step = 1.4; // Final system lock
        }

        const next = prev + step;

        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            document.body.style.overflow = prevOverflow;
            scrollControlsRef.current.start();
            finishLoader();
          }, 400);
          return 100;
        }

        return next;
      });
    }, 28);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = prevOverflow;
      scrollControlsRef.current.start();
    };
  }, [loading, shouldReduceMotion, finishLoader]);

  const getStatusText = (prog: number) => {
    if (prog < 32) return 'INITIALIZING CORE SYSTEM...';
    if (prog < 72) return 'LOADING 50-YEAR ARCHIVE...';
    if (prog < 92) return 'CALIBRATING HACKATHON ARENA...';
    if (prog < 100) return 'ESTABLISHING SECURE PROTOCOLS...';
    return 'SYSTEM READY · ENTERING';
  };

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="intro-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070b14] text-white overflow-hidden select-none"
        >
          {/* Subtle themed dot grid matching anniversary accent */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(var(--accent-rgb),0.15)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          {/* Animated Glow Orbs */}
          <motion.div
            animate={
              shouldReduceMotion
                ? { opacity: 0.4 }
                : {
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }
            }
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute w-[350px] h-[350px] rounded-full bg-[var(--accent)]/20 blur-[90px] pointer-events-none"
          />

          {/* Accessible Skip Button */}
          <button
            type="button"
            onClick={finishLoader}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wider text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-700/50 transition-colors flex items-center gap-1.5 cursor-pointer backdrop-blur-xs"
            aria-label="Skip intro animation"
          >
            <span>SKIP</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
              ESC
            </span>
          </button>

          {/* Center Content */}
          <div className="relative z-10 flex flex-col items-center space-y-6 max-w-sm px-6 text-center">
            {/* Logo Wrapper with Pulse Ring */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
              className="relative"
            >
              {!shouldReduceMotion && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-3 rounded-3xl border border-dashed border-[var(--accent)]/40 pointer-events-none"
                />
              )}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#0e1726] border border-[var(--accent)]/50 p-2 shadow-2xl flex items-center justify-center">
                <img
                  src={compute50Logo}
                  alt="Compute 50 Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(var(--accent-rgb),0.4)]"
                />
              </div>
            </motion.div>

            {/* Title & Slogan */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-1"
            >
              <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-wider text-white">
                COMPUTE <span className="text-[var(--accent)]">50</span>
              </h2>
              <p className="text-xs font-mono tracking-widest text-slate-400 uppercase">
                From Legacy to Limitless
              </p>
            </motion.div>

            {/* Progress Bar & Status Feed */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="w-full max-w-xs space-y-2.5 pt-2"
            >
              <div className="h-2 w-full bg-slate-900/90 rounded-full overflow-hidden border border-slate-700/60 p-[1.5px]">
                <div
                  className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] rounded-full transition-all duration-75 shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-xs font-mono text-slate-300">
                <span className="tracking-wider uppercase text-[var(--accent)] truncate mr-2 font-medium">
                  {getStatusText(progress)}
                </span>
                <span className="text-[var(--accent)] font-bold shrink-0">
                  {Math.floor(progress)}%
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
