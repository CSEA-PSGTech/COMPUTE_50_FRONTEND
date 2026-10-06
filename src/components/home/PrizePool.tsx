import React, { useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, Trophy, Medal, Award } from 'lucide-react';
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

  // Reorder items for Desktop Podium: [2nd Place, 1st Place, 3rd Place]
  const secondPlace = prizeData.items.find((i) => i.rank.includes('2nd'));
  const firstPlace = prizeData.items.find((i) => i.rank.includes('1st'));
  const thirdPlace = prizeData.items.find((i) => i.rank.includes('3rd'));

  const podiumItems = [
    { item: secondPlace, heightClass: 'h-36 sm:h-44', delay: 0.1, color: 'border-emerald-500/30' },
    { item: firstPlace, heightClass: 'h-48 sm:h-56', delay: 0.0, isFirst: true, color: 'border-[var(--accent)] shadow-[0_0_25px_rgba(34,197,94,0.25)]' },
    { item: thirdPlace, heightClass: 'h-28 sm:h-36', delay: 0.2, color: 'border-emerald-500/20' },
  ];

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
                ? `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(182, 255, 0, 0.1), transparent 80%)`
                : `radial-gradient(circle at 50% 50%, rgba(182, 255, 0, 0.05), transparent 70%)`,
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
                    <span className="bg-gradient-to-r from-white via-slate-100 to-[var(--accent)] bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(34,197,94,0.35)]">
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
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--bg-secondary)] hover:bg-[var(--accent-muted)] border border-[var(--border-color)] hover:border-[var(--accent)] text-xs sm:text-sm font-mono font-bold text-[var(--text-primary)] hover:text-[var(--accent)] rounded-xl transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  >
                    <span>View full prize details</span>
                    <ArrowRight className="w-4 h-4 text-[var(--accent)]" />
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: Desktop 3D Podium / Mobile Stacked List */}
              <div className="lg:col-span-6 w-full">
                
                {/* DESKTOP PODIUM (2nd, 1st, 3rd Order) */}
                <div className="hidden sm:flex items-end justify-center gap-4 h-64 sm:h-72 pb-2">
                  {podiumItems.map(({ item, heightClass, delay, isFirst, color }, index) => {
                    if (!item) return null;
                    return (
                      <div key={item.id || index} className="flex flex-col items-center flex-1 max-w-[150px]">
                        
                        {/* Amount Header Label */}
                        <motion.div
                          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: delay + 0.2 }}
                          className="text-center mb-2"
                        >
                          <span className={`block font-mono text-sm sm:text-base font-black ${isFirst ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
                            {item.amountFormatted}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-[var(--text-secondary)] uppercase block">
                            {item.title}
                          </span>
                        </motion.div>

                        {/* Growing Podium Pillar */}
                        <motion.div
                          initial={shouldReduceMotion ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
                          whileInView={{ scaleY: 1, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            type: 'spring',
                            stiffness: 180,
                            damping: 20,
                            delay: delay,
                          }}
                          style={{ originY: 1 }}
                          className={`w-full ${heightClass} rounded-t-2xl bg-gradient-to-t ${
                            isFirst
                              ? 'from-[var(--accent)]/30 via-[var(--accent)]/15 to-[var(--accent)]/40'
                              : 'from-white/10 via-white/5 to-white/10'
                          } border-t-2 border-x ${color} p-3 flex flex-col justify-between items-center relative overflow-hidden`}
                        >
                          {/* Inner Accent Glow for 1st Place */}
                          {isFirst && (
                            <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent)]/20 to-transparent pointer-events-none" />
                          )}

                          <div className="pt-2 z-10">
                            {isFirst ? (
                              <Trophy className="w-8 h-8 text-[var(--accent)] filter drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                            ) : item.rank.includes('2nd') ? (
                              <Medal className="w-7 h-7 text-emerald-300" />
                            ) : (
                              <Award className="w-6 h-6 text-emerald-400" />
                            )}
                          </div>

                          <span className="font-mono text-xs font-black tracking-wider text-[var(--text-primary)] uppercase z-10 pb-1">
                            {item.rank}
                          </span>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>

                {/* MOBILE STACKED LIST (1st, 2nd, 3rd Order) */}
                <div className="sm:hidden space-y-3">
                  {prizeData.items.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                        item.isGrandWinner
                          ? 'bg-[var(--accent)]/10 border-[var(--accent)]/50 shadow-[0_0_12px_rgba(34,197,94,0.15)]'
                          : 'bg-[var(--bg-secondary)] border-[var(--border-color)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.isGrandWinner ? (
                          <Trophy className="w-6 h-6 text-[var(--accent)] shrink-0" />
                        ) : item.rank.includes('2nd') ? (
                          <Medal className="w-6 h-6 text-emerald-300 shrink-0" />
                        ) : (
                          <Award className="w-6 h-6 text-emerald-400 shrink-0" />
                        )}
                        <div>
                          <span className="text-xs font-mono font-bold text-[var(--accent)] block uppercase">
                            {item.rank}
                          </span>
                          <span className="text-sm font-bold text-[var(--text-primary)] block leading-tight">
                            {item.title}
                          </span>
                        </div>
                      </div>

                      <span className="font-mono text-base font-extrabold text-[var(--text-primary)] shrink-0">
                        {item.amountFormatted}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Track Prizes Chip below podium */}
                <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex justify-center">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-full text-xs font-mono font-semibold text-[var(--text-primary)] shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                    {prizeData.trackPrizes.label}: <strong className="text-[var(--accent)]">{prizeData.trackPrizes.amountFormatted}</strong>
                  </span>
                </div>

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
