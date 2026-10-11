import React from 'react';
import { Container } from '../components/common/Container';
import { SectionHeading } from '../components/common/SectionHeading';
import { AboutPsgTech } from '../components/about/AboutPsgTech';
import { AboutCsea } from '../components/about/AboutCsea';
import { AboutCompute50 } from '../components/about/AboutCompute50';
import { EventTheme } from '../components/about/EventTheme';
import { PhotoStrip } from '../components/about/PhotoStrip';

export const About: React.FC = () => {
  return (
    <div className="bg-[var(--bg-main)] min-h-screen transition-colors pt-6 sm:pt-10 pb-20">
      <Container size="lg">
        {/* Page Header */}
        <SectionHeading
          badge="ABOUT THE EVENT"
          title="Legacy of Engineering & Innovation"
          subtitle="Learn more about PSG College of Technology, CSEA, and the ethos behind Compute 50."
        />

        {/* Photo Strip Component (renders nothing if photos array is empty) */}
        <PhotoStrip />

        {/* Main Sections with Alternating Rhythm */}
        <div className="space-y-16 pt-4">
          {/* Section 01: Theme & Timeline */}
          <section id="theme" className="relative transition-colors">
            <EventTheme />
          </section>

          {/* Section 02: About Compute 50 (Subtle Surface Band) */}
          <section
            id="event"
            className="relative bg-[var(--bg-surface)] p-6 sm:p-10 rounded-3xl border border-[var(--border-color)] shadow-xs transition-colors"
          >
            <AboutCompute50 />
          </section>

          {/* Section 03 & 04 Grid: PSG Tech & CSEA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Section 03: PSG Tech */}
            <section id="psg-tech" className="relative h-full">
              <AboutPsgTech />
            </section>

            {/* Section 04: CSEA (Subtle Surface Band) */}
            <section
              id="csea"
              className="relative h-full bg-[var(--bg-surface)] p-1 rounded-3xl transition-colors"
            >
              <AboutCsea />
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default About;
