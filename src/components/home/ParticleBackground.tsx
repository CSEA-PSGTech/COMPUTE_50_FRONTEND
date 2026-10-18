import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  baseVx: number;
  baseVy: number;
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
  char: string;
  depth: number;
  phase: number;
  freq: number;
  amplitude: number;
  pulsePhase: number;
  pulseSpeed: number;
}

const CODE_CHARS = ['0', '1', '{', '}', '<', '>', '/', '#', '$', '%', '*', '+', '=', '5', '0', '_', '~'];

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const initParticles = (w: number, h: number) => {
      const isMobile = w < 768 || (typeof navigator !== 'undefined' && navigator.hardwareConcurrency <= 4);
      const count = isMobile ? 36 : 72;

      particlesRef.current = Array.from({ length: count }, () => {
        const depth = Math.random() * 0.7 + 0.65; // 0.65 to 1.35
        // Constant gentle cruising drift
        const baseSpeed = (Math.random() * 0.35 + 0.15) * (Math.random() > 0.5 ? 1 : -1);
        const baseSpeedY = (Math.random() * 0.35 + 0.15) * (Math.random() > 0.5 ? 1 : -1);

        return {
          x: Math.random() * w,
          y: Math.random() * h,
          baseVx: baseSpeed * depth,
          baseVy: baseSpeedY * depth,
          vx: baseSpeed * depth,
          vy: baseSpeedY * depth,
          size: Math.round((Math.random() * 5 + 11) * depth), // 11px to 18px scaled by depth
          baseAlpha: Math.random() * 0.35 + 0.35, // 0.35 to 0.70
          char: CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)],
          depth,
          phase: Math.random() * Math.PI * 2,
          freq: Math.random() * 0.0012 + 0.0008,
          amplitude: Math.random() * 0.35 + 0.25,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.002 + 0.0015,
        };
      });
    };

    const handleResize = () => {
      if (!canvas || !parent) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      initParticles(width, height);
    };

    handleResize();

    // Track mouse over the parent hero container
    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    parent.addEventListener('mousemove', handleMouseMove, { passive: true });
    parent.addEventListener('mouseleave', handleMouseLeave);

    let lastFrameTime = performance.now();
    const fpsInterval = 1000 / 45; // Smooth 45-60fps budget

    const render = (now: number) => {
      if (document.hidden) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const elapsed = now - lastFrameTime;
      if (elapsed >= fpsInterval) {
        lastFrameTime = now - (elapsed % fpsInterval);

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, width, height);

        const isDark = document.documentElement.classList.contains('dark');

        // Dynamic theme token fallback
        const cssAccentRgb = getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim();
        const textColor = cssAccentRgb || (isDark ? '251, 191, 36' : '217, 119, 6');
        const glowColor = isDark
          ? `rgba(${textColor}, 0.65)`
          : `rgba(${textColor}, 0.35)`;

        const particles = particlesRef.current;
        const count = particles.length;
        const mouse = mouseRef.current;

        // 1. Update and draw particles with fluid wave motion & aerodynamic swirl
        for (let i = 0; i < count; i++) {
          const p = particles[i];

          // Harmonic floating buoyancy wave
          const waveX = Math.cos(now * p.freq + p.phase) * p.amplitude * p.depth;
          const waveY = Math.sin(now * (p.freq * 0.85) + p.phase) * p.amplitude * p.depth;

          // Interactive aerodynamic swirl & repulsion around cursor
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const repulsionRadius = 135;

          if (dist < repulsionRadius && dist > 0) {
            const force = (repulsionRadius - dist) / repulsionRadius;
            const angle = Math.atan2(dy, dx);

            // Radial repulsion push
            const pushX = Math.cos(angle) * force * 0.65 * p.depth;
            const pushY = Math.sin(angle) * force * 0.65 * p.depth;

            // Tangential aerodynamic swirl (vortex)
            const swirlX = -Math.sin(angle) * force * 0.4 * p.depth;
            const swirlY = Math.cos(angle) * force * 0.4 * p.depth;

            p.vx += pushX + swirlX;
            p.vy += pushY + swirlY;
          }

          // Smooth velocity relaxation back to base cruising speed (never stops)
          p.vx += (p.baseVx - p.vx) * 0.035;
          p.vy += (p.baseVy - p.vy) * 0.035;

          p.x += p.vx + waveX;
          p.y += p.vy + waveY;

          // Wrap boundaries smoothly
          if (p.x < -30) p.x = width + 30;
          if (p.x > width + 30) p.x = -30;
          if (p.y < -30) p.y = height + 30;
          if (p.y > height + 30) p.y = -30;

          // Occasional subtle matrix glyph shift
          if (Math.random() < 0.003) {
            p.char = CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
          }

          // Breathing opacity pulse
          const breathingAlpha = Math.min(
            0.88,
            Math.max(0.18, p.baseAlpha + Math.sin(now * p.pulseSpeed + p.pulsePhase) * 0.18)
          );

          // Draw code glyph with depth-scaled glow
          ctx.save();
          ctx.font = `bold ${p.size}px 'JetBrains Mono', 'Courier New', monospace`;
          ctx.fillStyle = `rgba(${textColor}, ${breathingAlpha})`;
          ctx.shadowBlur = (isDark ? 8 : 4) * p.depth;
          ctx.shadowColor = glowColor;
          ctx.fillText(p.char, p.x, p.y);
          ctx.restore();
        }

        // 2. Connecting plexus constellation lines
        const maxLineDist = 115;
        for (let i = 0; i < count; i++) {
          for (let j = i + 1; j < count; j++) {
            const a = particles[i];
            const b = particles[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxLineDist) {
              const lineAlpha = (1 - dist / maxLineDist) * 0.22 * Math.min(a.baseAlpha, b.baseAlpha);
              ctx.strokeStyle = `rgba(${textColor}, ${lineAlpha})`;
              ctx.lineWidth = 0.75;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(parent);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
      parent.removeEventListener('mousemove', handleMouseMove);
      parent.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) {
    return (
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
        aria-hidden="true"
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};

export default ParticleBackground;
