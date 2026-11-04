import React from 'react';
import { Hero } from '../components/home/Hero';
import { AboutSection } from '../components/home/AboutSection';
import { HackathonSection } from '../components/home/HackathonSection';
import { PrizePool } from '../components/home/PrizePool';
import { SpeakersSection } from '../components/home/SpeakersSection';
import { SponsorsSection } from '../components/home/SponsorsSection';
import { FaqSection } from '../components/home/FaqSection';
import { SectionTransition } from '../components/common/SectionTransition';

export const Home: React.FC = () => {
  return (
    <div className="w-full overflow-hidden">
      <SectionTransition>
        <Hero />
      </SectionTransition>
      <SectionTransition>
        <AboutSection />
      </SectionTransition>
      <SectionTransition>
        <HackathonSection />
      </SectionTransition>
      <SectionTransition>
        <PrizePool />
      </SectionTransition>
      <SectionTransition>
        <SpeakersSection />
      </SectionTransition>
      <SectionTransition>
        <SponsorsSection />
      </SectionTransition>
      <SectionTransition>
        <FaqSection />
      </SectionTransition>
    </div>
  );
};

export default Home;