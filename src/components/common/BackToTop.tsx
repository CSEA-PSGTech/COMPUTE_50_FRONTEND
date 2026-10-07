import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useSmoothScroll } from '../../context/SmoothScrollContext';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    scrollTo(0, { duration: 1.0 });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          onClick={scrollToTop}
          className="fixed bottom-[calc(140px+env(safe-area-inset-bottom,0px))] md:bottom-8 right-4 sm:right-6 z-50 w-11 h-11 rounded-full bg-[var(--accent)] text-black font-bold shadow-lg shadow-[var(--accent)]/30 flex items-center justify-center hover:shadow-xl transition-all cursor-pointer"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5 text-black stroke-[2.5]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
