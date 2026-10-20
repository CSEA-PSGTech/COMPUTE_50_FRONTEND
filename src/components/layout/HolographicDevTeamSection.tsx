import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, Sparkles, Code2, Server } from 'lucide-react';
import { DEV_TEAM_MEMBERS, DevTeamMember } from '../../data/devTeam';
import { soundReveal } from '../../lib/sound';

type TeamCategory = 'frontend' | 'backend' | 'coordinator';

interface CategoryConfig {
  id: TeamCategory;
  title: string;
  icon: React.ReactNode;
}

const CATEGORIES: CategoryConfig[] = [
  { id: 'frontend', title: 'FRONTEND', icon: <Code2 className="w-3.5 h-3.5" /> },
  { id: 'backend', title: 'BACKEND', icon: <Server className="w-3.5 h-3.5" /> },
  { id: 'coordinator', title: 'COORDINATOR', icon: <Sparkles className="w-3.5 h-3.5" /> },
];

export interface HolographicDevTeamSectionProps {
  onClose?: () => void;
}

export const HolographicDevTeamSection: React.FC<HolographicDevTeamSectionProps> = ({ onClose }) => {
  const [activeCategory, setActiveCategory] = useState<TeamCategory>('frontend');
  const [unrollKey, setUnrollKey] = useState<number>(0);
  const [isUnrolling, setIsUnrolling] = useState<boolean>(true);
  const shouldReduceMotion = useReducedMotion();
  const unrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Trigger holographic laser sweep on category change
  const handleSelectCategory = (category: TeamCategory) => {
    if (activeCategory === category && !isUnrolling) {
      // Re-trigger reveal animation if clicking active button
      soundReveal();
      setIsUnrolling(true);
      setUnrollKey((prev) => prev + 1);
      return;
    }

    soundReveal();
    setActiveCategory(category);
    setIsUnrolling(true);
    setUnrollKey((prev) => prev + 1);
  };

  // Auto clean up laser beam after duration
  useEffect(() => {
    if (!isUnrolling) return;

    if (unrollTimerRef.current) clearTimeout(unrollTimerRef.current);
    unrollTimerRef.current = setTimeout(() => {
      setIsUnrolling(false);
    }, 2200);

    return () => {
      if (unrollTimerRef.current) clearTimeout(unrollTimerRef.current);
    };
  }, [unrollKey, isUnrolling]);

  const activeMembers: DevTeamMember[] = DEV_TEAM_MEMBERS.filter(
    (member) => member.category === activeCategory
  );

  return (
    <div className="relative w-full max-w-4xl mx-auto my-12 px-3 sm:px-6">
      {/* ========================================================= */}
      {/* THREE VERTICAL BUTTONS: FRONTEND | BACKEND | COORDINATOR   */}
      {/* (Styled matching the vertical heads circuit aesthetics)   */}
      {/* ========================================================= */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-8">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleSelectCategory(cat.id)}
              className="group relative flex items-center justify-center gap-2 sm:gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer focus:outline-hidden"
              aria-label={`Show ${cat.title} Team`}
            >
              {/* Active Background Pill & Glow */}
              {isActive && (
                <motion.div
                  layoutId="activeVerticalTabBg"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  className="absolute inset-0 rounded-xl bg-[var(--accent-muted)]/60 border border-[var(--accent)] shadow-[0_0_15px_rgba(var(--accent-rgb),0.25)] pointer-events-none"
                />
              )}

              {/* Left Glowing Node & Circuit Trace */}
              <span
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 shrink-0 ${
                  isActive
                    ? 'bg-[var(--accent)] shadow-[0_0_8px_var(--accent)] scale-110'
                    : 'bg-[var(--text-secondary)]/40 group-hover:bg-[var(--accent)]'
                }`}
              />
              <div
                className={`w-3 sm:w-5 h-[1px] transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-transparent to-[var(--accent)]'
                    : 'bg-gradient-to-r from-transparent to-[var(--text-secondary)]/30 group-hover:to-[var(--accent)]/60'
                }`}
              />

              {/* Title & Icon */}
              <div className="relative z-10 flex items-center gap-1.5">
                <span
                  className={`text-xs sm:text-[13px] font-mono font-black tracking-widest uppercase transition-all duration-300 ${
                    isActive
                      ? 'text-[var(--accent)] drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.5)]'
                      : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                  }`}
                >
                  {cat.title}
                </span>
              </div>

              {/* Right Glowing Node & Circuit Trace */}
              <div
                className={`w-3 sm:w-5 h-[1px] transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-l from-transparent to-[var(--accent)]'
                    : 'bg-gradient-to-l from-transparent to-[var(--text-secondary)]/30 group-hover:to-[var(--accent)]/60'
                }`}
              />
              <span
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 shrink-0 ${
                  isActive
                    ? 'bg-[var(--accent)] shadow-[0_0_8px_var(--accent)] scale-110'
                    : 'bg-[var(--text-secondary)]/40 group-hover:bg-[var(--accent)]'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* HOLOGRAPHIC PROJECTION STAGE                              */}
      {/* (Laser scanline sweeps down + clip-path unrolls members)   */}
      {/* ========================================================= */}
      <div className="relative w-full overflow-hidden min-h-[160px] flex items-center justify-center p-2">
        {/* LASER SCANLINE */}
        {!shouldReduceMotion && isUnrolling && (
          <motion.div
            key={`laser-${unrollKey}`}
            initial={{ top: '-4%', opacity: 1 }}
            animate={{ top: ['0%', '103%'], opacity: [1, 1, 0] }}
            transition={{
              duration: 1.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute -left-2 -right-2 h-[2.5px] bg-[var(--accent)] shadow-[0_0_12px_var(--accent),0_0_24px_var(--accent),0_0_4px_#ffffff] z-30 pointer-events-none rounded-full"
          >
            {/* Trailing laser light flare fan */}
            <div className="w-full h-16 sm:h-20 bg-gradient-to-b from-[var(--accent)]/35 to-transparent pointer-events-none" />
          </motion.div>
        )}

        {/* CRT scanlines active during unroll */}
        {!shouldReduceMotion && isUnrolling && (
          <div
            className="absolute inset-0 pointer-events-none z-20 opacity-20"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(var(--accent-rgb), 0.15) 0px, transparent 2px, transparent 4px)',
            }}
            aria-hidden="true"
          />
        )}

        {/* HOLOGRAPHIC CLIP-PATH UNROLL CONTAINER */}
        <motion.div
          key={`unroll-${unrollKey}`}
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)', opacity: 0.2 }
          }
          animate={
            shouldReduceMotion
              ? { opacity: 1 }
              : {
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                  opacity: 1,
                  transition: { duration: 1.8, ease: [0.22, 1, 0.36, 1] },
                }
          }
          className="relative w-full"
        >
          {/* Members Straight Alignment Grid */}
          <div
            className={`grid gap-4 sm:gap-6 justify-center w-full ${
              activeMembers.length === 3
                ? 'grid-cols-1 md:grid-cols-3'
                : 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto'
            }`}
          >
            {activeMembers.map((member) => {
              const initials = member.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();

              return (
                <div
                  key={member.id}
                  className="p-4 sm:p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--accent)] transition-all shadow-xs flex flex-col justify-between space-y-3 group/card text-center items-center"
                >
                  {/* Member Avatar / Cyber Initials */}
                  <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] group-hover/card:border-[var(--accent)]/60 flex items-center justify-center font-mono font-black text-sm text-[var(--accent)] shadow-inner transition-transform group-hover/card:scale-105">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </div>

                  {/* Name & Role */}
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold font-mono text-[var(--text-primary)] group-hover/card:text-[var(--accent)] transition-colors">
                      {member.name}
                    </h4>
                    <p className="text-[11px] font-mono text-[var(--text-secondary)]">
                      {member.role}
                    </p>
                  </div>

                  {/* Contribution Tech Chips */}
                  <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                    {member.contributions.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--accent)] font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Social Profile Links */}
                  <div className="pt-2 border-t border-[var(--border-color)]/60 w-full flex items-center justify-center gap-3 text-xs font-mono">
                    {member.githubUrl && (
                      <a
                        href={member.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                        aria-label={`${member.name} GitHub`}
                      >
                        <span>GitHub</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <span>LinkedIn</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Optional Collapse Button */}
      {onClose && (
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--accent-muted)] border border-[var(--border-color)] hover:border-[var(--accent)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all cursor-pointer shadow-xs group"
          >
            <span>✕ Close Team Hologram</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default HolographicDevTeamSection;
