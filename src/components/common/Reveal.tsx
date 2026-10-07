import React, { ReactNode, useRef, useState, useEffect } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { MOTION_EASE, MOTION_DURATION } from '../../lib/motion';

export interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  staggerChildren?: number;
  once?: boolean;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = MOTION_DURATION.NORMAL,
  staggerChildren,
  once = true,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.05 });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView) {
      setHasAnimated(true);
    }
  }, [isInView]);

  // Safety fallback: ensure content is revealed after mount even if IntersectionObserver misses on SPA transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const getDirectionOffset = () => {
    if (shouldReduceMotion) return { x: 0, y: 0 };
    switch (direction) {
      case 'up':
        return { x: 0, y: 20 };
      case 'down':
        return { x: 0, y: -20 };
      case 'left':
        return { x: 20, y: 0 };
      case 'right':
        return { x: -20, y: 0 };
      case 'none':
      default:
        return { x: 0, y: 0 };
    }
  };

  const offset = getDirectionOffset();

  const containerVariants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      x: offset.x,
      y: offset.y,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : duration,
        delay,
        ease: MOTION_EASE,
        ...(staggerChildren
          ? {
            staggerChildren,
            delayChildren: delay,
          }
          : {}),
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial={shouldReduceMotion ? 'visible' : 'hidden'}
      animate={isInView || hasAnimated || shouldReduceMotion ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};
