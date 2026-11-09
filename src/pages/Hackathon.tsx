import React from 'react';
import { Container } from '../components/common/Container';
import { SectionHeading } from '../components/common/SectionHeading';
import { RulesGuidelines } from '../components/hackathon/RulesGuidelines';
import { ImportantInfo } from '../components/hackathon/ImportantInfo';
import { ScheduleSection } from '../components/home/ScheduleSection';
/* =========================================================================
 * STASHED HACKATHON TRACKS (PRESERVED FOR FUTURE USE)
 * Uncomment the import and component below if organizers ask for it back:
 * import { TracksSection } from '../components/home/TracksSection';
 * ========================================================================= */

export const Hackathon: React.FC = () => {
  return (
    <div className="py-16 bg-[var(--bg-main)] min-h-screen transition-colors">
      <Container size="lg">
        <SectionHeading
          badge="HACKATHON DETAILS"
          title="Compute 50"
          subtitle="Everything you need to compete, build, and submit your project successfully."
        />

        <div className="space-y-12">
          {/* STASHED: <TracksSection /> */}
          <RulesGuidelines />
          <ScheduleSection />
          <ImportantInfo />
        </div>
      </Container>
    </div>
  );
};

export default Hackathon;
