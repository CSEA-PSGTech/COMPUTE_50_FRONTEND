import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, Trophy } from 'lucide-react';
import { Container } from '../common/Container';
import { CountUp } from '../common/CountUp';
import { prizeData } from '../../data/prizes';
import { PrizeDetailsModal } from './PrizeDetailsModal';

export const PrizePool: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Spotlight position state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      id="prizepool-home"
      className="relative py-12 lg:py-20 bg-[var(--bg-main)] transition-colors overflow-hidden bg-tech-grid"
    >
      {/* Background Soft Radial Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[400px] rounded-full bg-[var(--accent)]/10 blur-[120px]" />
      </div>

      <Container size="lg">
        {/* Outer Card with Rotating Border Beam */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative p-[1px] rounded-3xl overflow-hidden shadow-2xl transition-all"
        >
          {/* Rotating Border Beam */}
          {!shouldReduceMotion && (
            <div
              className="absolute inset-[-100%] animate-border-beam bg-[conic-gradient(from_0deg,transparent_0_300deg,var(--accent)_360deg)] opacity-70 pointer-events-none"
              aria-hidden="true"
            />
          )}

          {/* Interactive Mouse Spotlight for Desktop / Drift for Mobile */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500 rounded-3xl z-10"
            style={{
              background: isHovered && !shouldReduceMotion
                ? `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(var(--accent-rgb), 0.1), transparent 80%)`
                : `radial-gradient(circle at 50% 50%, rgba(var(--accent-rgb), 0.05), transparent 70%)`,
            }}
            aria-hidden="true"
          />

          {/* Inner Content Box */}
          <div className="relative z-10 bg-[var(--bg-surface)]/90 backdrop-blur-xl rounded-[23px] p-6 sm:p-10 border border-[var(--border-color)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* LEFT COLUMN: Label, Giant Display Number, CTA */}
              <div className="lg:col-span-6 space-y-6 text-left">
                <div className="space-y-2">
                  <span className="font-mono text-xs sm:text-sm font-bold text-[var(--accent)] tracking-widest uppercase flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    {prizeData.label}
                  </span>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium">
                    {prizeData.subtitle}
                  </p>
                </div>

                {/* Huge Display Amount with Odometer CountUp */}
                <div
                  className="space-y-1"
                  aria-label={`Total Prize Pool: ${prizeData.totalAmount} Indian Rupees Plus`}
                >
                  <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-mono tracking-tight leading-none select-none">
                    <span className="bg-gradient-to-r from-[var(--text-primary)] via-[var(--text-primary)] to-[var(--accent)] bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(var(--accent-rgb),0.35)]">
                      <CountUp end={prizeData.totalAmount} prefix="₹" />
                    </span>
                    <span className="inline-block text-[var(--accent)] animate-pulse ml-1">
                      +
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-wider block pt-1">
                    Cumulative Cash Rewards & Track Incentives
                  </span>
                </div>

                {/* Modal CTA Trigger Button */}
                <div className="pt-2">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--bg-secondary)] hover:bg-[var(--accent-muted)] border border-[var(--border-color)] hover:border-[var(--accent)] text-xs sm:text-sm font-mono font-bold text-[var(--text-primary)] hover:text-[var(--accent)] rounded-xl transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] cursor-pointer"
                  >
                    <span>View full prize details</span>
                    <ArrowRight className="w-4 h-4 text-[var(--accent)]" />
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: Interactive Register CTA Card */}
              <div className="lg:col-span-6 w-full flex flex-col justify-center items-center lg:items-end">
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[var(--bg-secondary)]/90 to-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--accent)]/60 shadow-xl transition-all group relative overflow-hidden text-center lg:text-left flex flex-col items-center lg:items-start space-y-5"
                >
                  {/* Subtle Inner Glow */}
                  <div className="absolute -right-12 -top-12 w-40 h-40 bg-[var(--accent)]/15 rounded-full blur-2xl pointer-events-none group-hover:bg-[var(--accent)]/25 transition-all duration-500" />

                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--accent-muted)] border border-[var(--accent)]/30 rounded-full text-xs font-mono font-bold text-[var(--accent)]">
                    <Trophy className="w-3.5 h-3.5 animate-pulse text-[var(--accent)]" />
                    <span>NATIONAL INNOVATION CHALLENGE</span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xl sm:text-2xl font-bold font-mono text-[var(--text-primary)] tracking-tight">
                      Ready to Win Big?
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      Compete alongside top talent across the nation. Register your team of 2–4 members and turn your engineering vision into reality.
                    </p>
                  </div>

                  {/* Primary Interactive "Participate to Win" Button */}
                  <Link
                    to="/register"
                    className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-mono font-extrabold text-sm sm:text-base rounded-xl shadow-[0_0_25px_rgba(var(--accent-rgb),0.35)] hover:shadow-[0_0_35px_rgba(var(--accent-rgb),0.55)] transition-all duration-300 transform group-hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <Sparkles className="w-5 h-5 text-[var(--accent-text)] animate-bounce" />
                    <span>Participate to Win</span>
                    <ArrowRight className="w-5 h-5 text-[var(--accent-text)] transition-transform duration-300 group-hover:translate-x-1.5" />
                  </Link>
                </motion.div>
              </div>

            </div>
          </div>
        </div>
      </Container>

      {/* Accessible Prize Details Drawer / Modal */}
      <PrizeDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};
