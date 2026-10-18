import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Award, Users, MapPin, Trophy } from 'lucide-react';
import { EVENT_CONFIG } from '../../config/event';

export const HackathonOverview: React.FC = () => {
  return (
    <Card className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <Badge variant="primary" className="mb-2">COMPUTE 50 HACKATHON</Badge>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Innovation Challenge</h2>
        </div>
        <Badge variant="success" className="px-3 py-1 text-[13px]">REGISTRATIONS OPEN</Badge>
      </div>

      <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
        COMPUTE 50 HACKATHON brings together students from diverse academic backgrounds to identify real-world problems and engineer technology-driven solutions during a two-day event.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] text-center">
          <Award className="w-5 h-5 text-[var(--accent)] mx-auto mb-1" />
          <span className="block text-[13px] font-bold text-[var(--text-primary)] font-mono">50 Years</span>
          <span className="text-[11px] text-[var(--text-secondary)]">M.E. CSE Legacy</span>
        </div>
        <div className="p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] text-center">
          <Users className="w-5 h-5 text-[var(--accent)] mx-auto mb-1" />
          <span className="block text-[13px] font-bold text-[var(--text-primary)] font-mono">{EVENT_CONFIG.teamSize}</span>
          <span className="text-[11px] text-[var(--text-secondary)]">Team Size</span>
        </div>
        <div className="p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] text-center">
          <MapPin className="w-5 h-5 text-[var(--accent)] mx-auto mb-1 text-center" />
          <span className="block text-[13px] font-bold text-[var(--text-primary)] font-mono">Round 1 Online</span>
          <span className="text-[11px] text-[var(--text-secondary)]">Finals at PSG Tech</span>
        </div>
        <div className="p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] text-center">
          <Trophy className="w-5 h-5 text-[var(--accent)] mx-auto mb-1" />
          <span className="block text-[13px] font-bold text-[var(--text-primary)] font-mono">{EVENT_CONFIG.prizePool}</span>
          <span className="text-[11px] text-[var(--text-secondary)]">Prize Pool</span>
        </div>
      </div>

      {/* Key-Facts Eligibility Tile */}
      <div className="p-3.5 bg-[var(--bg-secondary)]/60 rounded-xl border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <span className="font-mono font-bold text-[var(--accent)] uppercase tracking-wider shrink-0">
          ELIGIBILITY
        </span>
        <span className="text-[var(--text-secondary)] font-medium">
          {EVENT_CONFIG.eligibility}
        </span>
      </div>
    </Card>
  );
};
