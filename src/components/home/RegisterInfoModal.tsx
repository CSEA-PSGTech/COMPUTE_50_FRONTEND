import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock, UserPlus, CreditCard, ClipboardCheck, Users } from 'lucide-react';
import { Modal } from '../common/Modal';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { useAuth } from '../../hooks/useAuth';
import { API_CONFIG } from '../../config/api';
import { EVENT_CONFIG } from '../../config/event';

interface RegisterInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  {
    icon: UserPlus,
    title: 'Create your account',
    text: 'Everyone registers individually with their own details and a profile photo.',
  },
  {
    icon: CreditCard,
    title: 'Pay the ₹150 registration fee',
    text: 'Pay through the college fee portal, then upload the receipt on your profile.',
  },
  {
    icon: ClipboardCheck,
    title: 'Register for the hackathon',
    text: 'Once your fee is confirmed, register for the hackathon from your profile.',
  },
  {
    icon: Users,
    title: 'Form your team later',
    text: `Team formation (${EVENT_CONFIG.teamSize.replace(/\s+/g, ' ')}) opens after registrations close. Round 1 details follow in the participants WhatsApp group.`,
  },
];

export const RegisterInfoModal: React.FC<RegisterInfoModalProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated, user, refreshUser } = useAuth();
  const paid = !!user?.generalFeePaid;
  const groupUrl = API_CONFIG.participantWhatsappUrl || EVENT_CONFIG.whatsappLink;

  useEffect(() => {
    if (isOpen && isAuthenticated && !paid) refreshUser().catch(() => undefined);
  }, [isOpen, isAuthenticated, paid, refreshUser]);

  return createPortal(
    <Modal isOpen={isOpen} onClose={onClose} title="How registration works" maxWidth="lg">
      <ol className="space-y-4">
        {steps.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="flex gap-3.5">
            <div className="relative flex flex-col items-center">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--accent-muted)] border border-[var(--accent)]/30 text-[var(--accent)] shrink-0">
                <Icon className="w-4 h-4" />
              </span>
              {i < steps.length - 1 && <span className="w-px flex-1 mt-1.5 bg-[var(--border-color)]" />}
            </div>
            <div className="pb-1">
              <p className="text-[14px] font-semibold text-[var(--text-primary)]">{title}</p>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mt-0.5">{text}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/60 p-4">
        {isAuthenticated && paid && groupUrl ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div>
              <p className="text-[14px] font-semibold text-[var(--text-primary)]">Participants WhatsApp group</p>
              <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">All updates on team formation and Round 1 are shared here.</p>
            </div>
            <a
              href={groupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:brightness-110 text-[#0b1f12] font-semibold text-sm transition-all shrink-0"
            >
              <WhatsAppIcon className="w-4 h-4" color="#0b1f12" />
              Join group
            </a>
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-secondary)] shrink-0">
              <Lock className="w-4 h-4" />
            </span>
            <div>
              <p className="text-[14px] font-semibold text-[var(--text-primary)]">Participants WhatsApp group</p>
              <p className="text-[13px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                {isAuthenticated
                  ? 'The group link unlocks here once your registration fee is confirmed.'
                  : 'Log in and pay the registration fee to get the group link.'}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col-reverse sm:flex-row gap-2.5 sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm font-semibold transition-colors cursor-pointer"
        >
          Close
        </button>
        <Link
          to={isAuthenticated ? '/profile' : '/register'}
          onClick={onClose}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] text-sm font-bold transition-colors"
        >
          {isAuthenticated ? 'Go to my profile' : 'Start registration'}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </Modal>,
    document.body,
  );
};