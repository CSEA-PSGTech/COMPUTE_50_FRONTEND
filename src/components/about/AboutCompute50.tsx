import React from 'react';
import { Card } from '../common/Card';
import { Cpu, Award, Globe, Quote } from 'lucide-react';

export const AboutCompute50: React.FC = () => {
  return (
    <Card className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 text-[var(--accent)] border-b border-[var(--border-color)] pb-4">
        <Cpu className="w-7 h-7 shrink-0" />
        <h3 className="text-2xl font-bold text-[var(--text-primary)]">About Compute 50</h3>
      </div>

      {/* Two-column Layout on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Pull Quote */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-6 bg-[var(--bg-secondary)] border-l-4 border-[var(--accent)] rounded-r-2xl space-y-3 relative shadow-xs">
            <Quote className="w-8 h-8 text-[var(--accent)] opacity-40 shrink-0" />
            <p className="text-lg sm:text-xl font-bold text-[var(--text-primary)] leading-snug font-mono">
              "Bringing together students to engineer technology-driven solutions addressing real-world problems."
            </p>
            <span className="block text-xs font-mono font-semibold text-[var(--text-secondary)] uppercase">
              — Compute 50 Ethos
            </span>
          </div>
        </div>

        {/* Right Column: 3 Short Paragraphs */}
        <div className="md:col-span-7 space-y-4 text-[15px] text-[var(--text-secondary)] leading-[1.7] max-w-[70ch]">
          <p>
            COMPUTE 50 HACKATHON is a two-day technical innovation event organised by the Computer Science & Engineering Association (CSEA) as part of the celebrations commemorating 50 years of the M.E. Computer Science and Engineering programme at PSG College of Technology.
          </p>
          <p>
            The hackathon aims to bring together students from diverse academic backgrounds to identify real-world problems, develop technology-driven solutions, and demonstrate their ideas through working prototypes.
          </p>
          <p>
            The event combines ideation, rapid development, mentorship, technical collaboration, and project evaluation, providing participants with an opportunity to apply their knowledge across cutting-edge technology domains. The first round will be held online and shortlisted teams will be invited to PSG Tech campus.
          </p>
        </div>
      </div>

      {/* Two Highlight Tiles as a Row below */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[var(--border-color)]">
        <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] flex items-center gap-3">
          <Award className="w-6 h-6 text-[var(--accent)] shrink-0" />
          <span className="text-sm text-[var(--text-primary)] font-semibold font-mono">
            50 Years of M.E. CSE Programme
          </span>
        </div>
        <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] flex items-center gap-3">
          <Globe className="w-6 h-6 text-[var(--accent)] shrink-0" />
          <span className="text-sm text-[var(--text-primary)] font-semibold font-mono">
            Round 1 Online · Finals at PSG Tech
          </span>
        </div>
      </div>
    </Card>
  );
};
