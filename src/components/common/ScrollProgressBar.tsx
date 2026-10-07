import React from 'react';
import { motion, useScroll, useReducedMotion } from 'framer-motion';

export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-[var(--accent)] origin-left z-[100] pointer-events-none shadow-[0_0_8px_var(--accent)]"
      style={{ scaleX: scrollYProgress }}
      aria-hidden="true"
    />
  );
};
