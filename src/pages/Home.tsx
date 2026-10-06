import React from 'react';
import { Hero } from '../components/home/Hero';
import { PrizePool } from '../components/home/PrizePool';
import { TracksSection } from '../components/home/TracksSection';
import { SpeakersSection } from '../components/home/SpeakersSection';
import { SponsorsSection } from '../components/home/SponsorsSection';
import { EventsSection } from '../components/home/EventsSection';
import { SectionTransition } from '../components/common/SectionTransition';

export const Home: React.FC = () => {
  return (
    <div className="w-full overflow-hidden">
      <SectionTransition>
        <Hero />
      </SectionTransition>
      <SectionTransition>
        <PrizePool />
      </SectionTransition>
      <SectionTransition>
        <TracksSection />
      </SectionTransition>
      <SectionTransition>
        <SpeakersSection />
      </SectionTransition>
      <SectionTransition>
        <SponsorsSection />
      </SectionTransition>
      <SectionTransition>
        <EventsSection />
      </SectionTransition>
    </div>
  );
};

export default Home;
