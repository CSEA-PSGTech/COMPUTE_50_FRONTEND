import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { soundSwitch, soundReveal, soundModalClose } from '../../lib/sound';
import { HolographicDevTeamSection } from './HolographicDevTeamSection';

type OrbState = 'idle' | 'repelling' | 'returning' | 'settled';

export const RepellingTeamOrb: React.FC = () => {
  const [orbState, setOrbState] = useState<OrbState>('idle');
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const shouldReduceMotion = useReducedMotion();

  // Container reference for measuring relative origin (0, 0)
  const containerRef = useRef<HTMLDivElement>(null);

  // Position, velocity, and mouse relative coordinates stored in refs for 60fps RAF loop
  const posRef = useRef({ x: 0, y: 0 });
  const velRef = useRef({ vx: 0, vy: 0 });
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const repelStartTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  // Reactive state for rendering current position
  const [renderPos, setRenderPos] = useState({ x: 0, y: 0 });

  // Update mouse position relative to container center
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseRef.current = {
        x: e.clientX - centerX,
        y: e.clientY - centerY,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Computes safe motion boundaries so the orb strictly stays inside screen and container padding
  const getBounds = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    let safeHalf = 130;
    if (containerRef.current?.parentElement) {
      const parentW = containerRef.current.parentElement.clientWidth;
      if (parentW > 0) {
        // Leave 44px safe margin from parent boundary (orb radius 16px + 28px buffer)
        safeHalf = Math.max(60, parentW / 2 - 44);
      }
    } else if (typeof window !== 'undefined') {
      safeHalf = Math.max(60, window.innerWidth / 2 - 44);
    }

    const maxX = Math.min(isMobile ? 120 : 210, safeHalf);
    const minX = -maxX;
    const maxY = isMobile ? 30 : 55;
    const minY = -maxY;

    return { maxX, minX, maxY, minY, isMobile };
  };

  // Main 60fps Physics & Motion RAF Loop
  useEffect(() => {
    if (orbState !== 'repelling' && orbState !== 'returning') {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      return;
    }

    const { maxX, minX, maxY, minY, isMobile } = getBounds();
    // 2.0s snappy autonomous loop on mobile vs 3.8s interactive repel on desktop
    const FLIGHT_DURATION_MS = isMobile ? 2000 : 3800;
    const REPULSION_RADIUS = 180; // Distance within which cursor pushes orb (desktop only)

    const tick = () => {
      const now = performance.now();
      const elapsed = now - repelStartTimeRef.current;
      const pos = posRef.current;
      const vel = velRef.current;
      const mouse = mouseRef.current;

      if (elapsed < FLIGHT_DURATION_MS) {
        // =========================================================
        // PHASE 1: FLIGHT MOTION
        // =========================================================
        if (isMobile) {
          // MOBILE: Repel from cursor not needed.
          // Autonomous smooth harmonic loop within the safe screen padding
          vel.vx += Math.sin((elapsed + 250) * 0.005) * 1.5;
          vel.vy += Math.cos((elapsed + 250) * 0.007) * 1.3;
          vel.vx *= 0.93;
          vel.vy *= 0.93;
        } else {
          // DESKTOP: Interactive cursor repulsion
          if (mouse.x !== null && mouse.y !== null) {
            const dx = pos.x - mouse.x;
            const dy = pos.y - mouse.y;
            const dist = Math.hypot(dx, dy);

            if (dist < REPULSION_RADIUS) {
              const force = Math.min(32, ((REPULSION_RADIUS - dist) / REPULSION_RADIUS) * 26);
              const normX = dist === 0 ? (Math.random() - 0.5) * 2 : dx / dist;
              const normY = dist === 0 ? (Math.random() - 0.5) * 2 : dy / dist;

              vel.vx += normX * force;
              vel.vy += normY * force;
            }
          }

          // Slight ambient drift on desktop
          vel.vx += (Math.random() - 0.5) * 1.2;
          vel.vy += (Math.random() - 0.5) * 1.0;
          vel.vx *= 0.88;
          vel.vy *= 0.88;
        }

        // Update Position
        pos.x += vel.vx;
        pos.y += vel.vy;

        // Strictly bounce within the container/screen boundaries
        if (pos.x < minX) {
          pos.x = minX;
          vel.vx = Math.abs(vel.vx) * 0.75;
        } else if (pos.x > maxX) {
          pos.x = maxX;
          vel.vx = -Math.abs(vel.vx) * 0.75;
        }

        if (pos.y < minY) {
          pos.y = minY;
          vel.vy = Math.abs(vel.vy) * 0.75;
        } else if (pos.y > maxY) {
          pos.y = maxY;
          vel.vy = -Math.abs(vel.vy) * 0.75;
        }

        setRenderPos({ x: pos.x, y: pos.y });
        rafIdRef.current = requestAnimationFrame(tick);
      } else {
        // =========================================================
        // PHASE 2: RETURN TO PREVIOUS PLACE (0, 0) AND SETTLE
        // =========================================================
        const springK = isMobile ? 0.11 : 0.085; // Snappy return
        const targetX = 0;
        const targetY = 0;

        vel.vx += (targetX - pos.x) * springK;
        vel.vy += (targetY - pos.y) * springK;

        vel.vx *= isMobile ? 0.76 : 0.78;
        vel.vy *= isMobile ? 0.76 : 0.78;

        pos.x += vel.vx;
        pos.y += vel.vy;

        setRenderPos({ x: pos.x, y: pos.y });

        // Once it reaches its origin (0, 0) and settles, expand and reveal!
        if (
          Math.hypot(pos.x, pos.y) < 1.2 &&
          Math.hypot(vel.vx, vel.vy) < 0.15
        ) {
          pos.x = 0;
          pos.y = 0;
          vel.vx = 0;
          vel.vy = 0;
          setRenderPos({ x: 0, y: 0 });
          setOrbState('settled');
          soundReveal();

          // On mobile view: automatically expand and show the team section immediately!
          if (isMobile) {
            setIsRevealed(true);
          }
          return;
        }

        rafIdRef.current = requestAnimationFrame(tick);
      }
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [orbState]);

  // Triggers the motion sequence
  const startRepelSequence = (initialCursorX?: number, initialCursorY?: number) => {
    soundSwitch();
    const { maxX, isMobile } = getBounds();

    let initKickX: number;
    let initKickY: number;

    if (isMobile) {
      // Dynamic autonomous kick on mobile staying within bounds
      const dir = Math.random() > 0.5 ? 1 : -1;
      initKickX = dir * Math.min(13, maxX * 0.4);
      initKickY = -11;
    } else {
      initKickX = (Math.random() - 0.5) * 16;
      initKickY = -12;

      if (containerRef.current && initialCursorX !== undefined && initialCursorY !== undefined) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = 0 - (initialCursorX - centerX);
        const dy = 0 - (initialCursorY - centerY);
        const dist = Math.hypot(dx, dy) || 1;
        initKickX = (dx / dist) * 22;
        initKickY = (dy / dist) * 22;
      }
    }

    velRef.current = { vx: initKickX, vy: initKickY };
    repelStartTimeRef.current = performance.now();
    setOrbState('repelling');
  };

  // Handles cursor entering the idle badge (desktop only)
  const handleBadgeHover = (e: React.MouseEvent) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (orbState === 'idle' && !isMobile) {
      startRepelSequence(e.clientX, e.clientY);
    }
  };

  // Handles clicking the settled orb to reveal holographic team section
  // Handles clicking the settled orb to reveal/hide holographic team section
  const handleSettledClick = () => {
    if (isRevealed) {
      soundModalClose();
      setIsRevealed(false);
    } else {
      soundReveal();
      setIsRevealed(true);
    }
  };

  // Handles closing the revealed holographic section: closes section and keeps orb in settled expanded state
  const handleCloseReveal = () => {
    soundModalClose();
    setIsRevealed(false);
  };

  return (
    <div className="w-full">
      {/* ========================================================= */}
      {/* MOBILE TRIGGER: Clean static button (No flying orb on mobile) */}
      {/* ========================================================= */}
      <div className="block md:hidden my-4 text-center select-none">
        <button
          type="button"
          onClick={handleSettledClick}
          className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--accent-muted)] border border-[var(--border-color)] hover:border-[var(--accent)] text-xs font-mono font-bold text-[var(--accent)] transition-all shadow-xs cursor-pointer active:scale-95"
          aria-label={isRevealed ? 'Hide team hologram' : 'Meet the Team'}
        >
          <Sparkles className="w-3.5 h-3.5 text-[var(--accent)] transition-transform group-hover:rotate-45" />
          <span className="tracking-wide uppercase font-bold text-xs">
            {isRevealed ? 'Hide Team' : 'Meet the Team'}
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* DESKTOP EXPERIENCE: Interactive Repelling Plasma Orb       */}
      {/* ========================================================= */}
      <div
        ref={containerRef}
        className="hidden md:flex relative flex-col items-center justify-center my-4 select-none min-h-[48px] max-w-full"
      >
        {/* ========================================================= */}
        {/* STATE 1: IDLE CYBER BADGE (Waiting for cursor)             */}
        {/* ========================================================= */}
        {orbState === 'idle' && (
          <motion.button
            type="button"
            onMouseEnter={handleBadgeHover}
            onClick={(e) => startRepelSequence(e.clientX, e.clientY)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            className="group relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--accent-muted)] border border-[var(--border-color)] hover:border-[var(--accent)] text-xs font-mono font-bold text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors shadow-xs cursor-pointer focus:outline-hidden"
            aria-label="Meet the Compute 50 engineering team"
          >
            {/* Ambient Breathing Border Glow */}
            <span
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                boxShadow: '0 0 16px rgba(var(--accent-rgb), 0.35)',
              }}
            />

            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)] transition-transform group-hover:rotate-45" />
            <span className="tracking-wide">Meet the Team</span>
          </motion.button>
        )}

        {/* ========================================================= */}
        {/* STATE 2: REPELLING / RETURNING DYNAMIC ENERGY BALL        */}
        {/* (Actively repels away from cursor, then glides home)      */}
        {/* ========================================================= */}
        {(orbState === 'repelling' || orbState === 'returning') && (
          <div className="relative flex items-center justify-center">
            {/* Home Anchor Indicator (Dotted circuit target where it will return) */}
            <div
              className="absolute w-8 h-8 rounded-full border border-dashed border-[var(--accent)]/30 pointer-events-none animate-pulse"
              title="Home Origin Target"
            />

            {/* Glowing Energy Plasma Ball with Real-Time Repelling Position */}
            <div
              className="relative w-8 h-8 rounded-full flex items-center justify-center pointer-events-none transition-transform will-change-transform"
              style={{
                transform: `translate3d(${renderPos.x}px, ${renderPos.y}px, 0)`,
                background:
                  'radial-gradient(circle at 35% 35%, #ffffff 0%, var(--accent) 50%, #ff5e00 100%)',
                boxShadow:
                  '0 0 22px var(--accent), 0 0 40px rgba(var(--accent-rgb), 0.75), inset 0 0 8px #ffffff',
              }}
            >
              {/* Spinning Inner Energy Gyroscope Core */}
              <div className="w-4 h-4 rounded-full border-2 border-white/80 animate-spin [animation-duration:1.2s]" />

              {/* Energy Field Halo */}
              <div className="absolute inset-0 rounded-full bg-[var(--accent)]/20 animate-ping [animation-duration:1s]" />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STATE 3: SETTLED AT (0, 0) - EXPANDED "MEET THE TEAM" ORB */}
        {/* (Smoothly morphs and expands horizontally into pill button) */}
        {/* ========================================================= */}
        {orbState === 'settled' && (
          <motion.button
            type="button"
            onClick={handleSettledClick}
            initial={{ scale: 0.9, width: 36, opacity: 0.95 }}
            animate={{ scale: 1, width: 'auto', opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 340,
              damping: 24,
            }}
            whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
            className="group relative inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--accent-muted)] border border-[var(--accent)] text-xs font-mono font-bold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors shadow-[0_0_20px_rgba(var(--accent-rgb),0.35)] cursor-pointer focus:outline-hidden overflow-hidden"
            aria-label={isRevealed ? 'Hide team hologram' : 'Meet the Team'}
          >
            {/* Ambient Breathing Border & Neon Plasma Glow */}
            <span
              className="absolute inset-0 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                boxShadow:
                  '0 0 24px rgba(var(--accent-rgb), 0.45), inset 0 0 10px rgba(var(--accent-rgb), 0.2)',
              }}
            />

            {/* Radar Ping Wave on Settle Arrival */}
            <motion.span
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full border border-[var(--accent)] pointer-events-none"
            />

            {/* Expanded Label "Meet the Team" */}
            <motion.span
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(3px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ delay: 0.12, duration: 0.3 }}
              className="tracking-wider whitespace-nowrap text-xs font-bold uppercase"
            >
              {isRevealed ? 'Hide Team' : 'Meet the Team'}
            </motion.span>
          </motion.button>
        )}
      </div>

      {/* Holographic 3-Vertical Dev Team Section Revealed on Orb Press */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full overflow-hidden"
          >
            <HolographicDevTeamSection onClose={handleCloseReveal} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RepellingTeamOrb;
