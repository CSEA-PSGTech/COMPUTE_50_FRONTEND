import React from 'react';
import { AlertCircle, Clock, Laptop, CheckCircle2, FileCode } from 'lucide-react';
import { Card } from '../common/Card';

export const Round1NoticeBanner: React.FC = () => {
  return (
    <Card className="relative overflow-hidden border-[var(--accent)]/40 bg-[var(--bg-surface)] shadow-[0_4px_24px_-10px_rgba(var(--accent-rgb),0.15)] p-5 sm:p-7">
      {/* Accent corner tag */}
      <div className="absolute top-0 right-0 bg-[var(--accent)] text-[var(--accent-text)] font-mono text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider">
        Important Notice
      </div>

      <div className="flex items-start gap-3.5 mb-5">
        <div className="p-2.5 rounded-xl bg-[var(--accent-muted)] border border-[var(--accent)]/30 text-[var(--accent)] shrink-0">
          <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
            // Round 1 Operational Guidelines
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-tight mt-0.5">
            Round 1 Structure & Submission Rules
          </h2>
        </div>
      </div>

      {/* Grid of Key Directives */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 mb-4">
        {/* 1. Registration Deadline */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] flex flex-col justify-between">
          <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400 font-mono text-xs font-bold mb-1.5">
            <Clock className="w-4 h-4 shrink-0" />
            <span>REGISTRATION DEADLINE</span>
          </div>
          <p className="text-sm font-bold text-[var(--text-primary)]">
            Nov 22, 2026 · Closes strictly at 4:30 PM
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Fee payment and individual registration must be completed before the cutoff.
          </p>
        </div>

        {/* 2. Round 1 Online Prototype */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[var(--accent)] font-mono text-xs font-bold mb-1.5">
            <Laptop className="w-4 h-4 shrink-0" />
            <span>ROUND 1 (ONLINE)</span>
          </div>
          <p className="text-sm font-bold text-[var(--text-primary)]">
            Nov 23, 24 & 25, 2026
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Conducted fully online. Teams must build and submit a <strong className="text-[var(--text-primary)]">working prototype</strong> in one of the 10 domains.
          </p>
        </div>

        {/* 3. Round 1 Results */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] flex flex-col justify-between">
          <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400 font-mono text-xs font-bold mb-1.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>ROUND 1 RESULTS</span>
          </div>
          <p className="text-sm font-bold text-[var(--text-primary)]">
            Nov 30, 2026 · 10:00 AM
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Shortlisted teams advancing to the on-campus finale will be officially published.
          </p>
        </div>
      </div>

      {/* Distinction Callout: Round 1 Domains vs Round 2 Problem Statements */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--accent-muted)]/40 border border-[var(--accent)]/30 text-xs sm:text-[13px] text-[var(--text-primary)] leading-relaxed flex items-start gap-3">
        <FileCode className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--accent)] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[var(--accent)] font-mono font-bold uppercase tracking-wider block mb-0.5">
            Important Note on Domains & Problem Statements:
          </strong>
          The 10 domains listed below apply <span className="underline font-semibold">strictly to Round 1</span> for open prototype development. For <strong className="text-[var(--text-primary)]">Round 2 (Campus Finale at PSG Tech on Dec 4 & 5)</strong>, new, specific problem statements will be revealed directly to the finalists.
        </div>
      </div>
    </Card>
  );
};
