import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Calendar, Users, MapPin, Trophy, ArrowRight } from 'lucide-react';
import { Reveal } from '../common/Reveal';
import { EVENT_CONFIG } from '../../config/event';

export const HackathonSection: React.FC = () => {
  const cards = [
    {
      icon: <Calendar className="w-5 h-5 text-[var(--accent)] shrink-0" />,
      label: 'DATES',
      value: EVENT_CONFIG.dates,
    },
    {
      icon: <Users className="w-5 h-5 text-[var(--accent)] shrink-0" />,
      label: 'TEAM SIZE',
      value: EVENT_CONFIG.teamSize,
    },
    {
      icon: <MapPin className="w-5 h-5 text-[var(--accent)] shrink-0" />,
      label: 'FORMAT',
      value: EVENT_CONFIG.venue,
    },
    {
      icon: <Trophy className="w-5 h-5 text-[var(--accent)] shrink-0" />,
      label: 'PRIZE POOL',
      value: EVENT_CONFIG.prizePool,
    },
  ];

  return (
    <section id="hackathon" className="py-14 md:py-20 bg-[var(--bg-main)] border-b border-[var(--border-color)] transition-colors">
      <Container size="lg">
        <Reveal>
          <div className="text-center">
            <SectionHeading
              badge="THE HACKATHON"
              title="Build. Compete. Win."
              subtitle="Pick a track, form a team of 2 to 4, and turn a real-world problem into a working solution with mentors and judges beside you."
              className="mb-10"
            />

            {/* 4 Info Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-10 text-left">
              {cards.map((card, idx) => (
                <div
                  key={idx}
                  className="bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--accent)]/50 rounded-2xl p-5 shadow-xs transition-all duration-200 flex flex-col justify-between group"
                >
                  <div className="mb-3">{card.icon}</div>
                  <div>
                    <span className="text-[11px] font-mono font-bold tracking-wider text-[var(--text-secondary)] uppercase">
                      {card.label}
                    </span>
                    <p className="text-sm sm:text-[15px] font-bold text-[var(--text-primary)] mt-1 tracking-tight">
                      {card.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <Link
                to="/hackathon"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--accent)] text-[var(--bg-main)] hover:brightness-110 font-bold text-sm rounded-xl sm:rounded-full transition-all shadow-md group"
              >
                <span>View hackathon details</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--bg-surface)] hover:bg-[var(--accent-muted)] border border-[var(--border-color)] hover:border-[var(--accent)] text-[var(--text-primary)] dark:hover:text-[var(--accent)] font-semibold text-sm rounded-xl sm:rounded-full transition-all shadow-xs"
              >
                <span>Register your team</span>
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
};

export default HackathonSection;
