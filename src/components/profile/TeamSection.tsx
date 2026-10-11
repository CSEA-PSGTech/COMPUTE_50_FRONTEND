import React, { useState } from 'react';
import { Card } from '../common/Card';
import { HackathonTeam } from '../../types/user';
import { TeamRevealCards } from '../hackathon/TeamRevealCards';
import { Copy, Check } from 'lucide-react';

interface TeamSectionProps {
  team?: HackathonTeam;
  onCreateTeam?: (name: string) => void;
}

export const TeamSection: React.FC<TeamSectionProps> = ({ team }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyCode = () => {
    if (team?.code) {
      navigator.clipboard.writeText(team.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <span className="text-[13px] text-[var(--text-secondary)] uppercase font-semibold">Registered Team</span>
          <h3 className="text-xl font-bold text-[var(--text-primary)]">{team?.name || 'CyberPunks 50'}</h3>
        </div>
        {team?.code && (
          <div className="flex items-center gap-2 bg-[var(--bg-secondary)] px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-[13px] font-mono">
            <span className="text-[var(--text-secondary)]">Join Code:</span>
            <span className="text-[var(--accent)] font-bold">{team.code}</span>
            <button
              onClick={handleCopyCode}
              className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              aria-label="Copy team code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>

      {/* Interactive Deck of Team Cards */}
      <TeamRevealCards initialTeamName={team?.name} />
    </Card>
  );
};

