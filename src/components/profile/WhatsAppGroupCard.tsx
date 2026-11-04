import React from 'react';
import { Lock, Users, CalendarClock, ExternalLink } from 'lucide-react';
import { Card } from '../common/Card';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { API_CONFIG } from '../../config/api';
import { EVENT_CONFIG } from '../../config/event';

interface WhatsAppGroupCardProps {
  registered: boolean;
}

const groupUrl = () => API_CONFIG.participantWhatsappUrl || EVENT_CONFIG.whatsappLink;

export const WhatsAppGroupCard: React.FC<WhatsAppGroupCardProps> = ({ registered }) => {
  if (!registered) {
    return (
      <Card className="p-5 sm:p-6">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[15px] font-semibold text-[var(--text-primary)]">Participants WhatsApp Group</h4>
            <p className="text-[13px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
              The group link unlocks once you are registered for the hackathon. All updates — team formation, Round 1
              details and schedules — will be shared there.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5 sm:p-6 border-emerald-500/40">
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shrink-0">
            <WhatsAppIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[15px] font-semibold text-[var(--text-primary)]">Join the Participants WhatsApp Group</h4>
            <p className="text-[13px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
              You&apos;re registered! This group is the official channel for all hackathon communication — please join
              it right away.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-start gap-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] p-3.5">
            <Users className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
            <p className="text-[12.5px] leading-relaxed text-[var(--text-secondary)]">
              <strong className="text-[var(--text-primary)]">Team formation</strong> will open once registrations close.
              You don&apos;t need a team to register.
            </p>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] p-3.5">
            <CalendarClock className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
            <p className="text-[12.5px] leading-relaxed text-[var(--text-secondary)]">
              <strong className="text-[var(--text-primary)]">Round 1 procedures</strong>, problem statements and
              schedules will be announced in the group.
            </p>
          </div>
        </div>

        {groupUrl() ? (
          <a
            href={groupUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto self-start px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>Join WhatsApp Group</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        ) : (
          <p className="text-[13px] text-[var(--text-secondary)]">
            The group link will be shared with you by email shortly.
          </p>
        )}
      </div>
    </Card>
  );
};

export default WhatsAppGroupCard;