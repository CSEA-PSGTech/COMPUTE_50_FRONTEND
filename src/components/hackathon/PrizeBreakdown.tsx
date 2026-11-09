import React from 'react';
import { EVENT_CONFIG } from '../../config/event';

export const PrizeBreakdown: React.FC = () => {
  return (
    <section id="prizes" className="space-y-6 pt-4 scroll-mt-24 sm:scroll-mt-28">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <span className="font-mono text-xs font-bold text-[var(--accent)] uppercase tracking-wider block mb-1">
            PRIZE POOL
          </span>
          <h3 className="text-2xl font-bold text-[var(--text-primary)]">
            {EVENT_CONFIG.prizes.totalFormatted} Total Rewards
          </h3>
        </div>
        <span className="px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-xs font-mono font-semibold text-[var(--text-primary)]">
          Official Prize Pool
        </span>
      </div>
    </section>
  );
};