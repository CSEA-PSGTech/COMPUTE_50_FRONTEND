import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  char: string;
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
      const count = isMobile ? 32 : 68;

      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 6 + 11, // 11px to 17px
        alpha: Math.random() * 0.4 + 0.35, // 0.35 to 0.75
        char: CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)],
      }));
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

        const isDark =
          document.documentElement.classList.contains('dark') ||
          !document.documentElement.classList.contains('light');

        // Color & Glow Tokens
        const textColor = isDark ? '251, 191, 36' : '147, 51, 234';
        const glowColor = isDark ? 'rgba(255, 221, 0, 0.92)' : 'rgba(13, 204, 234, 0.4)';

        const particles = particlesRef.current;
        const count = particles.length;
        const mouse = mouseRef.current;

        // 1. Update and draw particles
        for (let i = 0; i < count; i++) {
          const p = particles[i];

          // Mouse repulsion interaction
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const repulsionRadius = 120;

          if (dist < repulsionRadius && dist > 0) {
            const force = (repulsionRadius - dist) / repulsionRadius;
            p.vx += (dx / dist) * force * 0.4;
            p.vy += (dy / dist) * force * 0.4;
          }

          // Inertia damping
          p.vx *= 0.98;
          p.vy *= 0.98;

          p.x += p.vx;
          p.y += p.vy;

          // Wrap boundaries smoothly
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          if (p.y > height + 20) p.y = -20;

          // Occasional subtle matrix glyph shift
          if (Math.random() < 0.004) {
            p.char = CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
          }

          // Draw code glyph
          ctx.save();
          ctx.font = `bold ${p.size}px 'JetBrains Mono', 'Courier New', monospace`;
          ctx.fillStyle = `rgba(${textColor}, ${p.alpha})`;
          ctx.shadowBlur = isDark ? 6 : 3;
          ctx.shadowColor = glowColor;
          ctx.fillText(p.char, p.x, p.y);
          ctx.restore();
        }

        // 2. Connecting plexus constellation lines
        const maxLineDist = 110;
        for (let i = 0; i < count; i++) {
          for (let j = i + 1; j < count; j++) {
            const a = particles[i];
            const b = particles[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxLineDist) {
              const lineAlpha = (1 - dist / maxLineDist) * 0.22;
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
