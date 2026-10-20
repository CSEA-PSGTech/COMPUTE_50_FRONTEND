import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { HackathonTeam } from '../../types/user';
import {
  Copy,
  Check,
  Crown,
  UserCheck,
  Users,
  Building,
  Mail,
  Phone,
  GraduationCap,
  Key,
  PlusCircle,
} from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

/* =========================================================================
 * STASHED REGISTRATION CARDS (PRESERVED FOR FUTURE REFERENCE)
 * =========================================================================
 * import { TeamRevealCards } from '../hackathon/TeamRevealCards';
 */

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

  const members = team?.members || [];
  const maxSlots = team?.maxMembers || 4;
  const isFull = members.length >= maxSlots;

  return (
    <Card className="p-6 sm:p-8 space-y-6">
      {/* Team Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-xs font-mono font-bold tracking-wider text-[var(--accent)] uppercase">
              Registered Squad
            </span>
          </div>
          <h3 className="text-2xl font-extrabold text-[var(--text-primary)]">
            {team?.name || 'Compute 50 Squad'}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={isFull ? 'success' : 'secondary'} className="font-mono text-xs py-1 px-2.5">
            {isFull ? 'Squad Full (4/4)' : `Active Squad (${members.length}/${maxSlots})`}
          </Badge>

          {team?.code && (
            <div className="flex items-center gap-2 bg-[var(--bg-main)] px-3.5 py-1.5 rounded-xl border border-[var(--border-color)] font-mono text-xs">
              <span className="text-[var(--text-secondary)] font-medium">Team ID:</span>
              <span className="text-[var(--accent)] font-extrabold tracking-wider">{team.code}</span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-1 hover:bg-[var(--bg-secondary)] rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                title="Copy Team ID"
                aria-label="Copy team code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Official WhatsApp Notice */}
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-start gap-3 text-emerald-700 dark:text-emerald-300">
        <WhatsAppIcon className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wide">Official Communication Channel</h4>
          <p className="text-xs sm:text-[13px] leading-relaxed mt-0.5">
            The WhatsApp group invitation link will be sent directly to the team leader for hackathon participation.
          </p>
        </div>
      </div>

      {/* Squad Members Roster */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono font-bold text-[var(--text-secondary)] uppercase tracking-wider">
          Squad Roster ({members.length}/{maxSlots} Members)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map((member, idx) => {
            const isLeader = member.role === 'Leader' || idx === 0;

            return (
              <div
                key={member.id || idx}
                className={`relative rounded-2xl p-4 border transition-all ${
                  isLeader
                    ? 'bg-[var(--accent-muted)]/30 border-[var(--accent)]/50 shadow-xs'
                    : 'bg-[var(--bg-main)] border-[var(--border-color)]'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isLeader
                          ? 'bg-[var(--accent)] text-[var(--bg-main)] shadow-xs'
                          : 'bg-[var(--bg-surface)] text-[var(--accent)] border border-[var(--border-color)]'
                      }`}
                    >
                      {isLeader ? <Crown className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </div>

                    <div>
                      <h5 className="font-mono font-bold text-sm text-[var(--text-primary)] leading-tight">
                        {member.name}
                      </h5>
                      <span className="text-[11px] font-mono font-semibold text-[var(--accent)] uppercase">
                        {isLeader ? 'Team Leader' : 'Team Member'}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-secondary)]">
                    Slot #{idx + 1}
                  </span>
                </div>

                {/* Academic & Contact Details */}
                <div className="space-y-1.5 pt-2 border-t border-[var(--border-color)]/60 text-xs text-[var(--text-secondary)] font-mono">
                  {member.college && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Building className="w-3.5 h-3.5 text-[var(--accent)]/80 shrink-0" />
                      <span className="truncate">{member.college}</span>
                    </div>
                  )}

                  {member.department && (
                    <div className="flex items-center gap-1.5 truncate">
                      <GraduationCap className="w-3.5 h-3.5 text-[var(--accent)]/80 shrink-0" />
                      <span className="truncate">
                        {member.department} {member.year ? `· ${member.year}` : ''}
                      </span>
                    </div>
                  )}

                  {member.rollNumber && (
                    <div className="flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-[var(--accent)]/80 shrink-0" />
                      <span>Roll: {member.rollNumber}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px]">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="inline-flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                      >
                        <Mail className="w-3 h-3 text-[var(--accent)] shrink-0" />
                        <span className="truncate max-w-[140px]">{member.email}</span>
                      </a>
                    )}

                    {member.phone && (
                      <a
                        href={`tel:${member.phone.replace(/\s+/g, '')}`}
                        className="inline-flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                      >
                        <Phone className="w-3 h-3 text-[var(--accent)] shrink-0" />
                        <span>{member.phone}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty Slots */}
          {Array.from({ length: Math.max(0, maxSlots - members.length) }).map((_, emptyIdx) => {
            const slotNum = members.length + emptyIdx + 1;
            return (
              <div
                key={`empty-slot-${emptyIdx}`}
                className="rounded-2xl p-4 border border-dashed border-[var(--border-color)] bg-[var(--bg-main)]/50 flex flex-col justify-center items-center text-center min-h-[140px] space-y-2"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)]">
                  <PlusCircle className="w-4 h-4 opacity-60" />
                </div>
                <div>
                  <p className="font-mono text-xs font-bold text-[var(--text-primary)]">
                    Slot #{slotNum}: Available
                  </p>
                  <p className="text-[11px] text-[var(--text-secondary)] max-w-[200px] mt-0.5">
                    Share Team ID <span className="font-mono text-[var(--accent)] font-bold">{team?.code || 'C50-XXXX'}</span> with your teammate to join this slot.
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
       * STASHED REGISTRATION CARDS (Uncomment if needed)
       * =====================================================================
       * <div className="hidden">
       *   <TeamRevealCards initialTeamName={team?.name} />
       * </div>
       * ===================================================================== */}
    </Card>
  );
};

export default TeamSection;
