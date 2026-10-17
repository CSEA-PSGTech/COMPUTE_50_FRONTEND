import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '../common/Reveal';

export const AboutSection: React.FC = () => {
  const shortSummary =
    "COMPUTE 50 HACKATHON is a two-day technical innovation event organised by CSEA as part of the celebrations commemorating 50 years of the M.E. CSE programme at PSG College of Technology. The hackathon brings together students from diverse academic backgrounds to identify real-world problems and build technology-driven solutions.";

  return (
    <section id="about" className="py-14 md:py-20 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] transition-colors">
      <Container size="lg">
        <Reveal>
          <div className="text-center">
            <SectionHeading
              badge="ABOUT THE HACKATHON"
              title="Empowering Next-Gen Innovators"
              subtitle={shortSummary}
              className="mb-6"
            />
            <div>
              <Link
                to="/about"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--bg-surface)] hover:bg-[var(--accent-muted)] border border-[var(--border-color)] hover:border-[var(--accent)] text-sm font-bold text-[var(--text-primary)] dark:hover:text-[var(--accent)] rounded-xl transition-all shadow-xs group"
              >
                <span>Read more about Compute 50</span>
                <ArrowRight className="w-4 h-4 text-[var(--accent)] transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
};
