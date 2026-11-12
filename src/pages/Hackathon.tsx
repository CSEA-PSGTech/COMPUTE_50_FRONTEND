import React from 'react';
import { Container } from '../components/common/Container';
import { SectionHeading } from '../components/common/SectionHeading';
import { DecryptText } from '../components/common/DecryptText';
import { RoundsTimeline } from '../components/hackathon/RoundsTimeline';
import { PaymentGuidelines } from '../components/hackathon/PaymentGuidelines';

export const Hackathon: React.FC = () => {
  return (
    <div className="py-16 bg-[var(--bg-main)] min-h-screen transition-colors">
      <Container size="lg">
        <header className="text-center mb-16 sm:mb-20">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs font-bold text-[var(--accent)] tracking-widest uppercase py-1 px-3 bg-[var(--accent-muted)] rounded-full border border-[var(--accent)]/30">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            // Hackathon Details
          </span>
          <h1
            aria-label="COMPUTE 50"
            className="mt-5 font-mono font-extrabold uppercase leading-none tracking-[-0.04em] text-[var(--text-primary)] select-none whitespace-nowrap"
            style={{ fontSize: 'clamp(2.75rem, 10vw, 7rem)' }}
          >
            <span aria-hidden="true">
              <DecryptText
                text="COMPUTE 50"
                highlightText="50"
                highlightClassName="text-[var(--accent)]"
                speed={40}
              />
            </span>
            <span
              aria-hidden="true"
              className="inline-block w-[0.08em] h-[0.78em] ml-[0.12em] align-baseline bg-[var(--accent)] animate-pulse motion-reduce:animate-none"
            />
          </h1>
          <p className="mt-5 text-[15px] sm:text-base text-[var(--text-secondary)] leading-[1.7]">
            Key dates and how to pay your registration fee.
          </p>
        </header>

        <div className="space-y-16">
          <section id="timeline" className="scroll-mt-24 sm:scroll-mt-28">
            <SectionHeading
              badge="TIMELINE"
              title="Event Timeline"
              subtitle="Key dates from Round 1 to the finals."
            />
            <RoundsTimeline />
          </section>

          <section id="payment" className="scroll-mt-24 sm:scroll-mt-28">
            <SectionHeading
              badge="PAYMENT"
              title="Payment Guidelines"
              subtitle="Registration fee is ₹150 per person. Follow these steps so your payment is verified."
            />
            <PaymentGuidelines />
          </section>
        </div>
      </Container>
    </div>
  );
};

export default Hackathon;