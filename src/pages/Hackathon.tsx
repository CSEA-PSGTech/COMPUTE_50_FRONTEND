import React from 'react';
import { Container } from '../components/common/Container';
import { SectionHeading } from '../components/common/SectionHeading';
import { PrizeBreakdown } from '../components/hackathon/PrizeBreakdown';
import { RulesGuidelines } from '../components/hackathon/RulesGuidelines';
import { ImportantInfo } from '../components/hackathon/ImportantInfo';
import { TracksSection } from '../components/home/TracksSection';
import { ScheduleSection } from '../components/home/ScheduleSection';

export const Hackathon: React.FC = () => {
  return (
    <div className="py-16 bg-[var(--bg-main)] min-h-screen transition-colors">
      <Container size="lg">
        <SectionHeading
          badge="HACKATHON DETAILS"
          title="Compute 50 Event Portal"
          subtitle="Everything you need to compete, build, and submit your project successfully."
        />

        <div className="space-y-12">
          <PrizeBreakdown />
          <TracksSection />
          <RulesGuidelines />
          <ScheduleSection />
          <ImportantInfo />
        </div>
      </Container>
    </div>
  );
};

export default Hackathon;
