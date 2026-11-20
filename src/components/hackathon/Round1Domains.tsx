import React from 'react';
import {
  Leaf,
  Building2,
  ShieldAlert,
  HeartPulse,
  Sprout,
  GraduationCap,
  ShoppingBag,
  Film,
  Wrench,
  Scale,
  Sparkles,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { round1Domains } from '../../data/round1Domains';
import { SectionHeading } from '../common/SectionHeading';
import { Card } from '../common/Card';

const getDomainIcon = (iconName: string) => {
  const iconProps = { className: 'w-5 h-5 text-[var(--accent)] transition-transform duration-200 group-hover:scale-110' };
  switch (iconName) {
    case 'Leaf':
      return <Leaf {...iconProps} />;
    case 'Building2':
      return <Building2 {...iconProps} />;
    case 'ShieldAlert':
      return <ShieldAlert {...iconProps} />;
    case 'HeartPulse':
      return <HeartPulse {...iconProps} />;
    case 'Sprout':
      return <Sprout {...iconProps} />;
    case 'GraduationCap':
      return <GraduationCap {...iconProps} />;
    case 'ShoppingBag':
      return <ShoppingBag {...iconProps} />;
    case 'Film':
      return <Film {...iconProps} />;
    case 'Wrench':
      return <Wrench {...iconProps} />;
    case 'Scale':
      return <Scale {...iconProps} />;
    default:
      return <Sparkles {...iconProps} />;
  }
};

export const Round1Domains: React.FC = () => {
  const reduceMotion = useReducedMotion();

  return (
    <div id="round1-domains" className="scroll-mt-24 sm:scroll-mt-28">
      <SectionHeading
        badge="ROUND 1 DOMAINS"
        title="Explore Round 1 Domains"
        subtitle="Select one domain for your team's project. Round 1 requires an end-to-end working prototype submission."
        className="mb-8"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {round1Domains.map((domain, index) => (
          <motion.div
            key={domain.id}
            initial={reduceMotion ? false : { opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.04, duration: 0.3 }}
            className="h-full"
          >
            <Card
              hoverable
              className={`group h-full flex flex-col justify-between p-5 sm:p-6 transition-all duration-200 hover:border-[var(--accent)] hover:shadow-[0_4px_20px_-8px_rgba(var(--accent-rgb),0.2)] ${
                domain.id === 'domain-3' ? 'border-[var(--accent)]/50 bg-[var(--accent-muted)]/10' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] group-hover:border-[var(--accent)]/50 flex items-center justify-center shrink-0 transition-colors">
                    {getDomainIcon(domain.iconName)}
                  </div>
                  <span className="font-mono text-[10px] sm:text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider px-2.5 py-1 rounded-md bg-[var(--bg-main)] border border-[var(--border-color)]">
                    {domain.tag}
                  </span>
                </div>

                <h3 className="text-base sm:text-[17px] font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                  {domain.title}
                </h3>

                <p className="mt-2.5 text-xs sm:text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  {domain.description}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-[var(--border-color)]/60 flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)]">
                <span>Domain #{index + 1}</span>
                <span className="text-[var(--accent)] font-semibold">Round 1 Prototype</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
