import React from 'react';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Card } from '../common/Card';
import { mockTracks } from '../../data/tracks';
import { Cpu, Shield, Activity, Zap, Lightbulb } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Reveal } from '../common/Reveal';
import { motion, useReducedMotion } from 'framer-motion';

export const TracksSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const getIcon = (name: string) => {
    switch (name) {
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-[var(--accent)] transition-transform duration-200 group-hover:scale-110" />;
      case 'Shield':
        return <Shield className="w-6 h-6 text-[var(--accent)] transition-transform duration-200 group-hover:scale-110" />;
      case 'Activity':
        return <Activity className="w-6 h-6 text-[var(--accent)] transition-transform duration-200 group-hover:scale-110" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-[var(--accent)] transition-transform duration-200 group-hover:scale-110" />;
      default:
        return <Lightbulb className="w-6 h-6 text-[var(--accent)] transition-transform duration-200 group-hover:scale-110" />;
    }
  };

  return (
    <section id="tracks" className="py-14 md:py-20 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] transition-colors">
      <Container size="lg">
        <Reveal>
          <SectionHeading
            badge="HACKATHON TRACKS"
            title="Choose Your Challenge Area"
            subtitle="Diverse technical tracks catered to AI, blockchain, medical engineering, clean energy, and open innovation."
          />
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mockTracks.map((track, idx) => (
            <Reveal key={track.id} delay={idx * 0.06}>
              <Card
                hoverable
                className="group flex flex-col justify-between p-5 sm:p-6 transition-all duration-200 hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.12)] hover:border-[var(--accent)]/60"
              >
                <div className="flex items-center justify-between mb-5">
                  <motion.div
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.05, rotate: 2 }}
                    transition={{ duration: 0.2 }}
                    className="p-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)] group-hover:border-[var(--accent)]/40 transition-colors"
                  >
                    {getIcon(track.iconName)}
                  </motion.div>
                  <Badge variant="outline" className="text-xs font-mono font-medium">
                    {track.problemCount} Problem Statements
                  </Badge>
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors tracking-tight">
                  {track.title}
                </h3>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
};

