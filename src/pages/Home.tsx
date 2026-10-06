import React from 'react';
import { Hero } from '../components/home/Hero';
import { PrizePool } from '../components/home/PrizePool';
import { AboutSection } from '../components/home/AboutSection';
import { ScheduleSection } from '../components/home/ScheduleSection';
import { TracksSection } from '../components/home/TracksSection';
import { SpeakersSection } from '../components/home/SpeakersSection';
import { SponsorsSection } from '../components/home/SponsorsSection';
import { EventsSection } from '../components/home/EventsSection';

export const Home: React.FC = () => {
  return (
    <div className="w-full">
      <Hero />
      <PrizePool />
      <AboutSection />
      <ScheduleSection />
      <TracksSection />
      <SpeakersSection />
      <SponsorsSection />
      <EventsSection />
    </div>
  );
};

export default Home;
