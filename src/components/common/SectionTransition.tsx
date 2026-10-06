import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

interface SectionTransitionProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const SectionTransition: React.FC<SectionTransitionProps> = ({
  children,
  className = '',
  disabled = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Measure scroll position relative to this section's element bounds
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Entering: 0.0 -> 0.35
  // Visible: 0.35 -> 0.75
  // Leaving: 0.75 -> 1.00
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.75, 1.0],
    [0, 1, 1, 0.25]
  );

  const y = useTransform(
    scrollYProgress,
    [0, 0.35, 0.75, 1.0],
    [isMobile ? 24 : 48, 0, 0, isMobile ? -12 : -24]
  );

  const scale = useTransform(
    scrollYProgress,
    [0, 0.35, 0.75, 1.0],
    [isMobile ? 1 : 0.97, 1, 1, 1]
  );

  const rawBlur = useTransform(
    scrollYProgress,
    [0, 0.35, 0.75, 1.0],
    [isMobile ? 0 : 10, 0, 0, isMobile ? 0 : 4]
  );

  const filter = useTransform(rawBlur, (b) =>
    !isMobile && b > 0.1 ? `blur(${b.toFixed(1)}px)` : 'none'
  );

  if (shouldReduceMotion || disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={containerRef} className="w-full relative">
      <motion.div
        style={{
          opacity,
          y,
          scale,
          filter,
        }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
};
