import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Copy, Users } from 'lucide-react';
import { Card } from '../common/Card';
import { HackathonTeam } from '../../types/user';

interface TeamSectionProps {
  team?: HackathonTeam;
}

export const TeamSection: React.FC<TeamSectionProps> = ({ team }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    if (!team?.code) return;
    try {
      await navigator.clipboard.writeText(team.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Your Team</span>
          <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">{team?.name ?? 'Not in a team yet'}</h3>
        </div>
        {team ? (
          <div className="flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 font-mono text-sm">
            <span className="text-xs text-[var(--text-secondary)]">TEAM ID</span>
            <span className="font-bold text-[var(--accent)]">{team.code}</span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="rounded p-1 text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
              aria-label="Copy team ID"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        ) : (
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-bold text-[var(--accent-text)] transition-colors hover:bg-[var(--accent-hover)]"
          >
            <Users className="h-4 w-4" /> Create or Join
          </Link>
        )}
      </div>

      {team ? (
        <>
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[var(--text-primary)]">Members</h4>
            <span className="text-xs text-[var(--text-secondary)]">{team.members.length} / {team.maxMembers}</span>
          </div>
          <ul className="divide-y divide-[var(--border-color)] rounded-xl border border-[var(--border-color)]">
            {team.members.map((member) => (
              <li key={member.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{member.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{member.email}</p>
                </div>
                <span className="rounded-full bg-[var(--accent-muted)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
                  {member.role}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-[var(--text-secondary)]">Share the Team ID with your teammates so they can join.</p>
        </>
      ) : (
        <p className="text-sm text-[var(--text-secondary)]">Create a team or join one with a teammate’s ID to get started.</p>
      )}
    </Card>
  );
};
