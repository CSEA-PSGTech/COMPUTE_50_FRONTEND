import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import compute50Logo from '../../assets/logos/compute 50 logo.png';

interface IntroLoaderProps {
  onComplete?: () => void;
}

export const IntroLoader: React.FC<IntroLoaderProps> = ({ onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if user has already seen the intro animation in this session
    const hasSeenIntro = sessionStorage.getItem('compute50_intro_seen');
    if (hasSeenIntro) {
      setLoading(false);
      if (onComplete) onComplete();
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
            sessionStorage.setItem('compute50_intro_seen', 'true');
            if (onComplete) onComplete();
          }, 300);
          return 100;
        }
        return prev + 4;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="intro-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070b14] text-white overflow-hidden select-none"
        >
          {/* Grid background effect */}
          <div className="absolute inset-0 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

          {/* Animated Glow Orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute w-[350px] h-[350px] rounded-full bg-[var(--accent)]/20 blur-[90px] pointer-events-none"
          />

          {/* Center Content */}
          <div className="relative z-10 flex flex-col items-center space-y-6 max-w-sm px-6 text-center">
            {/* Logo Wrapper with Pulse Ring */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
              className="relative"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-3 rounded-3xl border border-dashed border-[var(--accent)]/40"
              />
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#0e1726] border border-[var(--accent)]/50 p-2 shadow-2xl flex items-center justify-center">
                <img
                  src={compute50Logo}
                  alt="Compute 50"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(var(--accent-rgb),0.4)]"
                />
              </div>
            </motion.div>

            {/* Title & Slogan */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-1"
            >
              <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-wider text-white">
                COMPUTE <span className="text-[var(--accent)]">50</span>
              </h2>
              <p className="text-xs font-mono tracking-widest text-slate-400 uppercase">
                From Legacy to Limitless
              </p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100%' }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="w-full space-y-2 pt-2"
            >
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50 p-[1px]">
                <motion.div
                  className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>INITIALIZING SYSTEM</span>
                <span className="text-[var(--accent)] font-bold">{progress}%</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
