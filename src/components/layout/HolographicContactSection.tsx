import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { RotateCcw, Phone, Sparkles } from 'lucide-react';
import { soundReveal } from '../../lib/sound';

export interface ContactPerson {
  name: string;
  position?: string;
  phone: string;
}

export interface ContactCategory {
  title: string;
  subtitle?: string;
  people: ContactPerson[];
}

// Editable category data with clear placeholders for allotted members to fill in
const FOOTER_CATEGORIES: ContactCategory[] = [
  {
    title: 'HEADS',
    people: [
      { name: 'Name', position: 'Secretary', phone: '+91 XXXXX XXXXX' },
      { name: 'Name', position: 'Joint Secretary', phone: '+91 XXXXX XXXXX' },
      { name: 'Name', position: 'Head - Sponsorship', phone: '+91 XXXXX XXXXX' },
    ],
  },
  {
    title: 'TECH SUPPORT',
    people: [
      { name: 'Name', phone: '+91 XXXXX XXXXX' },
      { name: 'Name', phone: '+91 XXXXX XXXXX' },
      { name: 'Name', phone: '+91 XXXXX XXXXX' },
    ],
  },
  {
    title: 'EVENT SUPPORT',
    people: [
      { name: 'Name', phone: '+91 XXXXX XXXXX' },
      { name: 'Name', phone: '+91 XXXXX XXXXX' },
      { name: 'Name', phone: '+91 XXXXX XXXXX' },
    ],
  },
  {
    title: 'ACCOMMODATION',
    subtitle: '(BOYS)',
    people: [
      { name: 'Name', phone: '+91 XXXXX XXXXX' },
      { name: 'Name', phone: '+91 XXXXX XXXXX' },
      { name: 'Name', phone: '+91 XXXXX XXXXX' },
    ],
  },
  {
    title: 'ACCOMMODATION',
    subtitle: '(GIRLS)',
    people: [
      { name: 'Name', phone: '+91 XXXXX XXXXX' },
      { name: 'Name', phone: '+91 XXXXX XXXXX' },
    ],
  },
];

export const HolographicContactSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-60px' });
  const shouldReduceMotion = useReducedMotion();

  const [unrollKey, setUnrollKey] = useState<number>(0);
  const [isUnrolling, setIsUnrolling] = useState<boolean>(false);
  const hasTriggeredRef = useRef<boolean>(false);

  // Auto trigger reveal when scrolled into view
  useEffect(() => {
    if (isInView && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      setIsUnrolling(true);
      setUnrollKey((prev) => prev + 1);
    }
  }, [isInView]);

  // Clean up laser beam state after animation duration
  useEffect(() => {
    if (!isUnrolling) return;
    const timer = setTimeout(() => {
      setIsUnrolling(false);
    }, 2600);
    return () => clearTimeout(timer);
  }, [unrollKey, isUnrolling]);

  const handleReplay = () => {
    soundReveal();
    setIsUnrolling(true);
    setUnrollKey((prev) => prev + 1);
  };

  return (
    <div ref={containerRef} className="relative w-full mb-16 group/hologram">
      {/* Floating Replay Holograms Button (Visible ONLY when hovering on the section) */}
      <div className="flex justify-center sm:justify-end mb-3 px-2 max-w-6xl mx-auto min-h-[28px] pointer-events-none">
        <button
          type="button"
          onClick={handleReplay}
          className="opacity-0 group-hover/hologram:opacity-100 focus:opacity-100 pointer-events-auto transition-all duration-300 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--accent-muted)] border border-[var(--border-color)] hover:border-[var(--accent)] text-[10px] sm:text-[11px] font-mono text-[var(--text-secondary)] hover:text-[var(--accent)] cursor-pointer shadow-xs group/btn"
          aria-label="Replay holographic projection animations"
          title="Replay holographic projection animations"
        >
          <RotateCcw
            className={`w-3 h-3 transition-transform duration-500 ${
              isUnrolling ? 'animate-spin' : 'group-hover/btn:-rotate-90'
            }`}
          />
          <span>Replay Holograms</span>
          <Sparkles className="w-2.5 h-2.5 text-[var(--accent)] opacity-70 group-hover/btn:opacity-100" />
        </button>
      </div>

      {/* 5 Open Columns Grid (Each column has its OWN simultaneous hologram beam & unroll) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-12 gap-x-4 lg:gap-x-6 text-center">
        {FOOTER_CATEGORIES.map((cat, catIdx) => (
          <div
            key={`col-${catIdx}`}
            className="relative flex flex-col items-center group/col w-full overflow-hidden px-1"
          >
            {/* INDIVIDUAL COLUMN LASER SCANLINE (Sweeps simultaneously on all 5 verticals) */}
            {!shouldReduceMotion && isUnrolling && (
              <motion.div
                key={`col-laser-${unrollKey}-${catIdx}`}
                initial={{ top: '-4%', opacity: 1 }}
                animate={{ top: ['0%', '103%'], opacity: [1, 1, 0] }}
                transition={{
                  duration: 2.4,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.08, // Simultaneous trigger across all columns!
                }}
                className="absolute -left-1 -right-1 h-[2px] sm:h-[2.5px] bg-[var(--accent)] shadow-[0_0_12px_var(--accent),0_0_24px_var(--accent),0_0_4px_#ffffff] z-30 pointer-events-none rounded-full"
              >
                {/* Trailing laser light flare fan */}
                <div className="w-full h-16 sm:h-20 bg-gradient-to-b from-[var(--accent)]/35 to-transparent pointer-events-none" />
              </motion.div>
            )}

            {/* Subtle column CRT scanlines active during unroll */}
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

            {/* INDIVIDUAL COLUMN CLIP-PATH UNROLL */}
            <motion.div
              key={`col-unroll-${unrollKey}-${catIdx}`}
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)', opacity: 0.25 }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : {
                      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                      opacity: 1,
                      transition: { duration: 2.4, ease: [0.22, 1, 0.36, 1], delay: 0.08 },
                    }
              }
              className="relative w-full flex flex-col items-center"
            >
              {/* ========================================================= */}
              {/* UNIFIED HEADER (Identical height across all columns)       */}
              {/* Guarantees the bottom baseline matches to the pixel       */}
              {/* ========================================================= */}
              <div className="h-14 sm:h-16 flex flex-col justify-end items-center mb-6 w-full">
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 w-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)] shrink-0" />
                  <div className="w-2.5 sm:w-5 h-[1px] bg-gradient-to-r from-transparent to-[var(--accent)]/70" />

                  <div className="flex flex-col items-center justify-center min-w-0">
                    <h3 className="text-xs sm:text-[13px] font-mono font-black tracking-widest text-[var(--accent)] uppercase drop-shadow-[0_0_10px_rgba(var(--accent-rgb),0.4)] whitespace-nowrap">
                      {cat.title}
                    </h3>
                    {cat.subtitle ? (
                      <span className="text-[11px] font-mono font-bold tracking-wider text-[var(--accent)]/85 uppercase leading-none mt-1">
                        {cat.subtitle}
                      </span>
                    ) : (
                      /* Matching invisible placeholder line to ensure single-line headers share identical bottom baseline */
                      <span
                        className="text-[11px] font-mono select-none opacity-0 leading-none mt-1"
                        aria-hidden="true"
                      >
                        &nbsp;
                      </span>
                    )}
                  </div>

                  <div className="w-2.5 sm:w-5 h-[1px] bg-gradient-to-l from-transparent to-[var(--accent)]/70" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)] shrink-0" />
                </div>
              </div>

              {/* ========================================================= */}
              {/* CONTACT PERSONS ROWS (Row 0, 1, 2 have uniform heights)    */}
              {/* Placeholders for Name and Number aligned in straight lines */}
              {/* ========================================================= */}
              <div className="flex flex-col space-y-6 w-full items-center">
                {[0, 1, 2].map((slotIdx) => {
                  const person = cat.people[slotIdx];

                  if (!person) {
                    // Empty slot to preserve vertical alignment for 3-row layout
                    return (
                      <div
                        key={`empty-slot-${slotIdx}`}
                        className="w-full max-w-[210px] h-[72px] sm:h-[76px] hidden lg:block select-none pointer-events-none opacity-0"
                        aria-hidden="true"
                      />
                    );
                  }

                  return (
                    <div
                      key={`person-${slotIdx}`}
                      className="group/person w-full max-w-[210px] h-[72px] sm:h-[76px] flex flex-col justify-center items-center py-1 px-2 rounded-lg transition-all duration-200 hover:bg-[var(--accent)]/5"
                    >
                      {/* Name Placeholder (Straight horizontal line across all 5 columns) */}
                      <p className="font-mono font-bold text-sm sm:text-[14px] text-[var(--text-primary)]/80 group-hover/person:text-[var(--accent)] transition-colors tracking-wide truncate max-w-full leading-tight">
                        {person.name}
                      </p>

                      {/* Position / Role (Standardized h-4 slot to keep line height aligned) */}
                      <div className="h-4 flex items-center justify-center my-0.5">
                        {person.position ? (
                          <p className="font-mono italic text-[11px] sm:text-xs text-[var(--accent)]/85 tracking-wide font-medium leading-none">
                            {person.position}
                          </p>
                        ) : (
                          <span
                            className="opacity-0 select-none text-[11px] leading-none"
                            aria-hidden="true"
                          >
                            &nbsp;
                          </span>
                        )}
                      </div>

                      {/* Phone Placeholder */}
                      <div className="mt-0.5">
                        {person.phone.includes('X') ? (
                          <span className="inline-flex items-center gap-1.5 font-mono text-xs sm:text-[13px] text-[var(--text-secondary)]/60 tracking-wider select-none">
                            <Phone className="w-2.5 h-2.5 text-[var(--accent)] opacity-60 shrink-0" />
                            <span>{person.phone}</span>
                          </span>
                        ) : (
                          <a
                            href={`tel:${person.phone.replace(/\s+/g, '')}`}
                            className="inline-flex items-center gap-1.5 font-mono text-xs sm:text-[13px] text-[var(--text-secondary)] group-hover/person:text-[var(--text-primary)] hover:!text-[var(--accent)] transition-colors tracking-wider"
                            aria-label={`Call ${person.name} at ${person.phone}`}
                          >
                            <Phone className="w-2.5 h-2.5 text-[var(--accent)] opacity-70 group-hover/person:opacity-100 shrink-0" />
                            <span>{person.phone}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HolographicContactSection;
