import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

// SVG noise data URI (static 64x64 SVG tiled noise)
const NOISE_DATA_URI = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`;

export const TexturedBackground: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldReduceMotion) return;

    // Check touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      // Smooth interpolation for subtle spotlight drift
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;

      if (bgRef.current) {
        bgRef.current.style.setProperty('--spotlight-x', `${currentX.toFixed(1)}px`);
        bgRef.current.style.setProperty('--spotlight-y', `${currentY.toFixed(1)}px`);
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [shouldReduceMotion]);

  return (
    <div
      ref={bgRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
      style={
        {
          '--spotlight-x': '50vw',
          '--spotlight-y': '40vh',
        } as React.CSSProperties
      }
    >
      {/* 1. Base Background Color */}
      <div className="absolute inset-0 bg-[var(--bg-main)] transition-colors" />

      {/* 2. Static Film Grain Noise Layer */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${NOISE_DATA_URI}")`,
          backgroundRepeat: 'repeat',
          opacity: 'var(--bg-noise-opacity, 0.04)',
        }}
      />

      {/* 3. Faint Neon-Green Tech Grid with Radial Edge Mask */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, var(--accent) 1px, transparent 1px),
                            linear-gradient(to bottom, var(--accent) 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
          opacity: 'var(--bg-grid-opacity, 0.04)',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 20%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 20%, transparent 85%)',
        }}
      />

      {/* 4. Desktop Cursor Spotlight overlay on Grid */}
      {!shouldReduceMotion && (
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background: `radial-gradient(600px circle at var(--spotlight-x) var(--spotlight-y), rgba(var(--accent-rgb), 0.06), transparent 80%)`,
          }}
        />
      )}

    </div>
  );
};
