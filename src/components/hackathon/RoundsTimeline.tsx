import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';

interface Milestone {
  title: string;
  date: string;
  start: string;
  end: string;
  description: string;
}

const milestones: Milestone[] = [
  {
    title: 'Registration Closes',
    date: '22 Nov (4:30 PM)',
    start: '2026-11-22',
    end: '2026-11-22',
    description: 'Portal closes at 4:30 PM. Complete fee verification and individual registration.',
  },
  {
    title: 'Round 1 (Online)',
    date: '23 - 25 Nov',
    start: '2026-11-23',
    end: '2026-11-25',
    description: 'Online prototyping hackathon based on the 10 Round 1 domains.',
  },
  {
    title: 'Round 1 Results',
    date: '30 Nov (10:00 AM)',
    start: '2026-11-30',
    end: '2026-11-30',
    description: 'Results out at 10:00 AM; shortlisted teams qualify for on-campus finals.',
  },
  {
    title: 'Finals @ PSG Tech',
    date: '4 & 5 Dec',
    start: '2026-12-04',
    end: '2026-12-05',
    description: 'Two-day on-campus finale with dedicated Round 2 problem statements.',
  },
];

type Status = 'done' | 'live' | 'upcoming';

const statusOf = (m: Milestone, today: string): Status => {
  if (today > m.end) return 'done';
  if (today >= m.start) return 'live';
  return 'upcoming';
};

const localToday = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const statusLabel: Record<Status, string> = { done: 'Completed', live: 'Today', upcoming: 'Upcoming' };

export const RoundsTimeline: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const today = localToday();

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="hidden md:block absolute top-[11px] left-[12.5%] right-[12.5%] h-[2px] bg-[var(--border-color)]" />
      <div className="md:hidden absolute top-2 bottom-2 left-[11px] w-[2px] bg-[var(--border-color)]" />
      <ol className="relative grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4">
        {milestones.map((m, idx) => {
          const status = statusOf(m, today);
          const active = status !== 'upcoming';
          return (
            <motion.li
              key={m.title}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.35 }}
              className="relative flex md:flex-col md:items-center gap-4 md:gap-3 md:text-center"
            >
              <span
                className={`relative z-10 w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center bg-[var(--bg-main)] ${
                  active ? 'border-[var(--accent)]' : 'border-[var(--border-color)]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    active ? 'bg-[var(--accent)]' : 'bg-[var(--border-color)]'
                  } ${status === 'live' ? 'animate-pulse' : ''}`}
                />
              </span>
              <div
                className={`flex-1 w-full p-4 rounded-xl border bg-[var(--bg-surface)] ${
                  status === 'live' ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]/40' : 'border-[var(--border-color)]'
                }`}
              >
                <div className="flex md:justify-center items-center gap-1.5 text-[13px] font-mono font-bold text-[var(--accent)]">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {m.date}
                </div>
                <h4 className="mt-1 text-base font-bold text-[var(--text-primary)]">{m.title}</h4>
                <p className="mt-1 text-[13px] leading-snug text-[var(--text-secondary)]">{m.description}</p>
                <span
                  className={`mt-2 inline-block text-[10px] font-mono font-bold uppercase tracking-wider ${
                    status === 'upcoming' ? 'text-[var(--text-secondary)]' : 'text-[var(--accent)]'
                  }`}
                >
                  {statusLabel[status]}
                </span>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
};

export default RoundsTimeline;