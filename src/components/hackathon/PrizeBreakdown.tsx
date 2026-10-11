import React from 'react';
import { Trophy, Medal, Award, Gift } from 'lucide-react';
import { Card } from '../common/Card';
import { CountUp } from '../common/CountUp';
import { EVENT_CONFIG } from '../../config/event';

export const PrizeBreakdown: React.FC = () => {
  const prizes = [
    {
      place: '1st Place',
      title: 'Grand Winner',
      amountVal: EVENT_CONFIG.prizes.first,
      amountFormatted: EVENT_CONFIG.prizes.firstFormatted,
      icon: <Trophy className="w-9 h-9 text-[var(--accent)]" />,
      perks: ['Grand Winner Trophy', 'Cash Prize Rewards'],
      highlight: true,
    },
    {
      place: '2nd Place',
      title: 'Runner Up',
      amountVal: EVENT_CONFIG.prizes.second,
      amountFormatted: EVENT_CONFIG.prizes.secondFormatted,
      icon: <Medal className="w-9 h-9 text-[var(--text-secondary)]" />,
      perks: ['Runner Up Trophy', 'Cash Prize Rewards'],
      highlight: false,
    },
    {
      place: '3rd Place',
      title: 'Second Runner Up',
      amountVal: EVENT_CONFIG.prizes.third,
      amountFormatted: EVENT_CONFIG.prizes.thirdFormatted,
      icon: <Award className="w-9 h-9 text-[var(--text-secondary)]" />,
      perks: ['Third Place Trophy', 'Cash Prize Rewards'],
      highlight: false,
    },
    {
      place: 'Track Prizes',
      title: 'Category Winners',
      amountVal: EVENT_CONFIG.prizes.categories,
      amountFormatted: EVENT_CONFIG.prizes.categoriesFormatted,
      suffix: ' Total',
      icon: <Gift className="w-9 h-9 text-[var(--accent)]" />,
      perks: ['Track Best Innovations', 'Special Category Rewards'],
      highlight: false,
    },
  ];

  return (
    <section id="prizes" className="space-y-6 pt-4 scroll-mt-24 sm:scroll-mt-28">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <span className="font-mono text-xs font-bold text-[var(--accent)] uppercase tracking-wider block mb-1">
            PRIZE BREAKDOWN
          </span>
          <h3 className="text-2xl font-bold text-[var(--text-primary)]">
            {EVENT_CONFIG.prizes.totalFormatted} Total Rewards
          </h3>
        </div>
        <span className="px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-xs font-mono font-semibold text-[var(--text-primary)]">
          Official Prize Pool
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {prizes.map((p, idx) => (
          <Card
            key={idx}
            className={`flex flex-col justify-between text-center relative h-full ${
              p.highlight ? 'border-[var(--accent)] bg-[var(--bg-surface)] ring-1 ring-[var(--accent)]/40' : ''
            }`}
          >
            <div>
              <div className="mb-4 inline-flex p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                {p.icon}
              </div>
              <span className="block text-xs font-bold uppercase tracking-wider text-[var(--accent)] mb-1 font-mono">
                {p.place}
              </span>
              <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2">{p.title}</h4>
              <p className="text-2xl font-extrabold text-[var(--text-primary)] mb-6 font-mono">
                <CountUp end={p.amountVal} prefix="₹" suffix={p.suffix || ''} />
              </p>

              <ul className="text-[13px] text-[var(--text-secondary)] space-y-2 text-left border-t border-[var(--border-color)] pt-4">
                {p.perks.map((perk, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
