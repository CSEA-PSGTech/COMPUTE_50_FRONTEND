import React, { useState } from 'react';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Card } from '../common/Card';
import { mockSchedule } from '../../data/schedule';
import { Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';


export const ScheduleSection: React.FC = () => {
  const [activeDay, setActiveDay] = useState<'Day 1' | 'Day 2'>('Day 1');
  const [direction, setDirection] = useState<number>(0);

  const filteredSchedule = mockSchedule.filter((item) => item.day === activeDay);

  const switchDay = (newDay: 'Day 1' | 'Day 2') => {
    if (newDay === activeDay) return;
    setDirection(newDay === 'Day 2' ? 1 : -1);
    setActiveDay(newDay);
  };

  const handleSwipe = (_: unknown, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold && activeDay === 'Day 1') {
      switchDay('Day 2');
    } else if (info.offset.x > threshold && activeDay === 'Day 2') {
      switchDay('Day 1');
    }
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -200 : 200,
      opacity: 0,
    }),
  };

  return (
    <section id="schedule" className="py-16 md:py-24 bg-transparent border-b border-[var(--border-color)] transition-colors">
      <Container size="lg">
        <SectionHeading
          badge="TIMELINE"
          title="2-Day Event Schedule"
          subtitle="Explore the breakdown of check-in, keynotes, hacking sessions, and judging."
        />

        {/* Day Selector Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-1.5 rounded-xl inline-flex gap-2 relative">
            <button
              onClick={() => switchDay('Day 1')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer relative z-10 ${activeDay === 'Day 1'
                  ? 'text-[var(--accent-text)] font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
            >
              {activeDay === 'Day 1' && (
                <motion.div
                  layoutId="scheduleDayTab"
                  className="absolute inset-0 bg-[var(--accent)] rounded-lg shadow-xs"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">Day 1 — Kickoff & Coding</span>
            </button>
            <button
              onClick={() => switchDay('Day 2')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer relative z-10 ${activeDay === 'Day 2'
                  ? 'text-[var(--accent-text)] font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
            >
              {activeDay === 'Day 2' && (
                <motion.div
                  layoutId="scheduleDayTab"
                  className="absolute inset-0 bg-[var(--accent)] rounded-lg shadow-xs"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">Day 2 — Mentorship & Finale</span>
            </button>
          </div>
        </div>

        {/* Swipe hint on mobile */}
        <div className="flex md:hidden items-center justify-center gap-2 mb-4 text-[10px] text-[var(--text-secondary)] font-medium uppercase tracking-wider">
          <ChevronLeft className="w-3 h-3" />
          <span>Swipe to switch days</span>
          <ChevronRight className="w-3 h-3" />
        </div>

        {/* Timeline list with swipe support */}
        <div className="max-w-3xl mx-auto overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeDay}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleSwipe}
              className="space-y-4 touch-pan-y"
            >
              {filteredSchedule.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06, duration: 0.3 }}
                >
                  <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 text-[13px] text-[var(--accent)] font-mono font-semibold">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {item.time}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-[var(--text-primary)]">{item.title}</h4>
                      <p className="text-[13px] text-[var(--text-secondary)]">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-3 py-1.5 rounded-lg border border-[var(--border-color)] shrink-0 self-start sm:self-center font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                      <span>{item.venue}</span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
};
