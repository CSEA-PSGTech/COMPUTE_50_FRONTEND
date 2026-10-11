import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { mockSponsors } from '../../data/sponsors';
import { EVENT_CONFIG } from '../../config/event';
import { Badge } from '../common/Badge';
import { Reveal } from '../common/Reveal';
import { EmptyState } from '../common/EmptyState';
import { useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Sponsor } from '../../types/hackathon';

interface SponsorCardProps {
  sponsor: Sponsor;
  isDuplicate?: boolean;
}

const SponsorCard: React.FC<SponsorCardProps> = ({ sponsor, isDuplicate = false }) => {
  return (
    <a
      href={sponsor.website}
      target={sponsor.website.startsWith('mailto:') ? '_self' : '_blank'}
      rel="noreferrer"
      aria-hidden={isDuplicate ? 'true' : undefined}
      tabIndex={isDuplicate ? -1 : 0}
      className="w-52 sm:w-60 h-40 sm:h-44 p-5 sm:p-6 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl flex flex-col items-center justify-between text-center transition-all duration-300 group hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[0_4px_20px_rgba(182,255,0,0.14)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] shrink-0 select-none"
    >
      <div className="flex-1 w-full flex flex-col items-center justify-center">
        <img
          src={sponsor.logo}
          alt={sponsor.name}
          className="max-h-10 sm:max-h-12 max-w-[85%] w-auto object-contain mb-2 grayscale group-hover:grayscale-0 opacity-75 group-hover:opacity-100 transition-all duration-300"
        />
        <span className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors line-clamp-1">
          {sponsor.name}
        </span>
      </div>
      <Badge variant="outline" className="text-[10px] shrink-0 mt-2">
        {sponsor.category}
      </Badge>
    </a>
  );
};

export const SponsorsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const [isInView, setIsInView] = useState<boolean>(true);
  const [isTabVisible, setIsTabVisible] = useState<boolean>(true);

  // Tab visibility: pause marquee when page is in background
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // IntersectionObserver: pause marquee when section is not in viewport
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Ensure each rendered track has sufficient items to span wide displays without breaks
  const trackSponsors = useMemo(() => {
    if (!mockSponsors || mockSponsors.length === 0) return [];
    const minItemsNeeded = 10;
    const repeatCount = Math.max(2, Math.ceil(minItemsNeeded / mockSponsors.length));
    return Array.from({ length: repeatCount }).flatMap(() => mockSponsors);
  }, []);

  // Empty state if no sponsors
  if (!mockSponsors || mockSponsors.length === 0) {
    return (
      <section
        id="sponsors"
        ref={sectionRef}
        className="py-16 md:py-24 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] transition-colors"
      >
        <Container size="lg">
          <Reveal>
            <SectionHeading
              badge="SPONSORS & PARTNERS"
              title="Backing Technical Excellence"
              subtitle="Sponsors and partners will be announced soon."
            />
          </Reveal>
          <Reveal>
            <EmptyState
              category="SPONSORS & PARTNERS"
              title="Sponsors & Partners Announcing Soon"
              subtitle={`We are actively onboarding sponsors for Compute 50. Interested in partnering? Reach out at ${EVENT_CONFIG.contactEmail}`}
              icon={<Sparkles className="w-7 h-7" />}
            />
          </Reveal>
        </Container>
      </section>
    );
  }

  // Reduced motion: Accessible static horizontal scroll
  if (shouldReduceMotion) {
    return (
      <section
        id="sponsors"
        ref={sectionRef}
        className="py-16 md:py-24 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] transition-colors"
      >
        <Container size="lg">
          <Reveal>
            <SectionHeading
              badge="SPONSORS & PARTNERS"
              title="Backing Technical Excellence"
              subtitle="Sponsors and partners will be announced soon."
            />
          </Reveal>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin">
            {mockSponsors.map((sponsor) => (
              <SponsorCard key={sponsor.id} sponsor={sponsor} />
            ))}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section
      id="sponsors"
      ref={sectionRef}
      className="py-16 md:py-24 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] transition-colors"
      role="region"
      aria-roledescription="carousel"
      aria-label="Sponsors & Partners"
    >
      <Container size="lg">
        {/* Balanced, centered SectionHeading without controls */}
        <Reveal>
          <SectionHeading
            badge="SPONSORS & PARTNERS"
            title="Backing Technical Excellence"
            subtitle="Sponsors and partners will be announced soon."
            className="mb-10 text-center"
          />
        </Reveal>

        {/* Continuous Automatic Sliding Marquee */}
        <div
          className="relative w-full overflow-hidden py-4"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
            maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
          }}
        >
          <div
            className="flex w-max animate-sponsor-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]"
            style={{
              animationPlayState: isInView && isTabVisible ? 'running' : 'paused',
            }}
          >
            {/* Primary Track */}
            <div className="flex shrink-0 items-center gap-6 pr-6">
              {trackSponsors.map((sponsor, idx) => (
                <SponsorCard
                  key={`track-primary-${sponsor.id}-${idx}`}
                  sponsor={sponsor}
                />
              ))}
            </div>

            {/* Seamless Looping Duplicate Track */}
            <div
              className="flex shrink-0 items-center gap-6 pr-6"
              aria-hidden="true"
            >
              {trackSponsors.map((sponsor, idx) => (
                <SponsorCard
                  key={`track-loop-${sponsor.id}-${idx}`}
                  sponsor={sponsor}
                  isDuplicate
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
