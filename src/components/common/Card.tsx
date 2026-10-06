import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  style,
}) => {
  const hoverClasses = hoverable
    ? 'hover:border-[var(--accent)] hover:shadow-lg cursor-pointer'
    : '';

  return (
    <motion.div
      onClick={onClick}
      style={style}
      whileHover={hoverable ? { y: -4 } : undefined}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-xs backdrop-blur-xs transition-all duration-200 ${hoverClasses} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`mb-4 ${className}`}>{children}</div>;

export const CardTitle: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <h3 className={`text-xl font-bold text-[var(--text-primary)] ${className}`}>{children}</h3>;

export const CardContent: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`text-[15px] text-[var(--text-secondary)] leading-relaxed ${className}`}>{children}</div>;

export const CardFooter: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`mt-6 pt-4 border-t border-[var(--border-color)] flex items-center justify-between ${className}`}>{children}</div>;
