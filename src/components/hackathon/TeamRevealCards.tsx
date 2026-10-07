import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { User, HelpCircle, CheckCircle2, Crown, Trash2, Edit3, X, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { User as AuthUser } from '../../types/auth';

export interface MemberData {
  id: string;
  slotTitle: string;
  name: string;
  rollNumber: string;
  phone: string;
  email: string;
  isRequired: boolean;
  isRevealed: boolean;
  hasSpunOnce: boolean;
}

interface TeamRevealCardsProps {
  currentUser?: AuthUser | null;
  onTeamDataChange?: (members: MemberData[], isValid: boolean) => void;
  onSubmitTeam?: (members: MemberData[]) => void;
  isLoading?: boolean;
}

export const TeamRevealCards: React.FC<TeamRevealCardsProps> = ({
  currentUser,
  onTeamDataChange,
  onSubmitTeam,
  isLoading = false,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Initial 4 Team Member Slots
  const [members, setMembers] = useState<MemberData[]>([
    {
      id: 'leader-1',
      slotTitle: 'Team Leader',
      name: currentUser?.name || '',
      rollNumber: currentUser?.rollNumber || '',
      phone: currentUser?.phone || '',
      email: currentUser?.email || '',
      isRequired: true,
      isRevealed: true, // Pre-revealed for Leader
      hasSpunOnce: true,
    },
    {
      id: 'member-2',
      slotTitle: 'Member 2',
      name: '',
      rollNumber: '',
      phone: '',
      email: '',
      isRequired: true,
      isRevealed: false,
      hasSpunOnce: false,
    },
    {
      id: 'member-3',
      slotTitle: 'Member 3',
      name: '',
      rollNumber: '',
      phone: '',
      email: '',
      isRequired: false,
      isRevealed: false,
      hasSpunOnce: false,
    },
    {
      id: 'member-4',
      slotTitle: 'Member 4',
      name: '',
      rollNumber: '',
      phone: '',
      email: '',
      isRequired: false,
      isRevealed: false,
      hasSpunOnce: false,
    },
  ]);

  // Card Animation & Edit Panel State
  const [spinningCardId, setSpinningCardId] = useState<string | null>(null);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  // Edit Form State
  const [formData, setFormData] = useState<{
    name: string;
    rollNumber: string;
    phone: string;
    email: string;
  }>({ name: '', rollNumber: '', phone: '', email: '' });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Focus Trap Refs
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Synchronize leader info when currentUser prop becomes available
  useEffect(() => {
    if (currentUser) {
      setMembers((prev) =>
        prev.map((m, index) =>
          index === 0
            ? {
                ...m,
                name: m.name || currentUser.name || '',
                phone: m.phone || currentUser.phone || '',
                email: m.email || currentUser.email || '',
                rollNumber: m.rollNumber || currentUser.rollNumber || '',
              }
            : m
        )
      );
    }
  }, [currentUser]);

  // Validate overall team state (Cards 1 and 2 required)
  const isCardValid = (m: MemberData): boolean => {
    if (!m.isRevealed) return !m.isRequired;
    return (
      m.name.trim().length > 0 &&
      m.rollNumber.trim().length > 0 &&
      m.phone.replace(/\D/g, '').length === 10 &&
      /\S+@\S+\.\S+/.test(m.email.trim())
    );
  };

  const requiredCardsValid = isCardValid(members[0]) && isCardValid(members[1]);
  const filledCount = members.filter((m) => m.isRevealed && isCardValid(m)).length;

  useEffect(() => {
    if (onTeamDataChange) {
      onTeamDataChange(members, requiredCardsValid);
    }
  }, [members, requiredCardsValid, onTeamDataChange]);

  // Particle Burst on First Reveal
  const triggerParticleBurst = (cardElement?: HTMLElement | null) => {
    if (shouldReduceMotion) return;

    let origin = { x: 0.5, y: 0.5 };
    if (cardElement) {
      const rect = cardElement.getBoundingClientRect();
      origin = {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      };
    }

    confetti({
      particleCount: 18,
      spread: 60,
      startVelocity: 18,
      ticks: 50,
      gravity: 0.9,
      colors: ['#B6FF00', '#C8FF33', '#22c55e', '#4ade80'],
      origin,
    });
  };

  // Handle Card Click (Spin & Reveal Modal)
  const handleCardClick = (member: MemberData) => {
    const isFirstTime = !member.hasSpunOnce;

    // Prefill edit form
    setFormData({
      name: member.name,
      rollNumber: member.rollNumber,
      phone: member.phone,
      email: member.email,
    });
    setFormErrors({});

    if (isFirstTime && !shouldReduceMotion) {
      setSpinningCardId(member.id);
      setTimeout(() => {
        setSpinningCardId(null);
        setActiveCardId(member.id);
        // Mark as spun
        setMembers((prev) =>
          prev.map((m) => (m.id === member.id ? { ...m, hasSpunOnce: true } : m))
        );
      }, 1100);
    } else {
      setActiveCardId(member.id);
    }
  };

  const closePanel = () => {
    const closedId = activeCardId;
    setActiveCardId(null);
    setFormErrors({});
    if (closedId && cardRefs.current[closedId]) {
      cardRefs.current[closedId]?.focus();
    }
  };

  // Panel Keyboard Events (Esc to close, Tab focus trap)
  useEffect(() => {
    if (!activeCardId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePanel();
      }

      if (e.key === 'Tab' && panelRef.current) {
        const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Auto focus first input
    setTimeout(() => firstInputRef.current?.focus(), 100);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCardId]);

  // Form Field Validation
  const validateFieldValues = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.rollNumber.trim()) errors.rollNumber = 'Roll number is required';

    if (!formData.phone.trim()) {
      errors.phone = 'Mobile number is required';
    } else if (formData.phone.replace(/\D/g, '').length !== 10) {
      errors.phone = 'Enter a valid 10-digit Indian mobile number';
    }

    if (!formData.email.trim()) {
      errors.email = 'College email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      errors.email = 'Enter a valid email address';
    }

    // Duplicate Checks across team
    members.forEach((m) => {
      if (m.id !== activeCardId && m.isRevealed) {
        if (formData.email.trim() && m.email.trim().toLowerCase() === formData.email.trim().toLowerCase()) {
          errors.email = 'This email is already added for another team member';
        }
        if (formData.rollNumber.trim() && m.rollNumber.trim().toLowerCase() === formData.rollNumber.trim().toLowerCase()) {
          errors.rollNumber = 'This roll number is already added for another team member';
        }
        if (formData.phone.trim() && m.phone.replace(/\D/g, '') === formData.phone.replace(/\D/g, '')) {
          errors.phone = 'This mobile number is already added for another team member';
        }
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save Member Info
  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFieldValues() || !activeCardId) return;

    const currentMember = members.find((m) => m.id === activeCardId);
    const wasNewlyRevealed = currentMember && !currentMember.isRevealed;

    setMembers((prev) =>
      prev.map((m) =>
        m.id === activeCardId
          ? {
              ...m,
              name: formData.name.trim(),
              rollNumber: formData.rollNumber.trim().toUpperCase(),
              phone: formData.phone.trim(),
              email: formData.email.trim(),
              isRevealed: true,
              hasSpunOnce: true,
            }
          : m
      )
    );

    if (wasNewlyRevealed) {
      triggerParticleBurst(cardRefs.current[activeCardId]);
    }

    closePanel();
  };

  // Remove Optional Member
  const handleRemoveMember = (id: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              name: '',
              rollNumber: '',
              phone: '',
              email: '',
              isRevealed: false,
            }
          : m
      )
    );
    closePanel();
  };

  // Initials Helper
  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header & Progress Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <h3 className="text-lg font-bold text-[var(--text-primary)] font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            Team Member Reveal
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Tap cards to reveal and enter participant details. Leader & Member 2 required.
          </p>
        </div>

        {/* Ready Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-xs font-mono">
          <span className="text-[var(--text-secondary)]">Status:</span>
          <span
            className={`font-bold ${
              requiredCardsValid ? 'text-[var(--accent)]' : 'text-amber-400'
            }`}
          >
            {filledCount} / 4 Members Ready
          </span>
          {requiredCardsValid && <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />}
        </div>
      </div>

      {/* 4 Cards Grid (Desktop 4-in-a-row, Mobile 2x2 grid) */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        style={{ perspective: '1000px' }}
      >
        {members.map((member, index) => {
          const isLeader = index === 0;
          const isSpinning = spinningCardId === member.id;
          const isFilled = member.isRevealed && isCardValid(member);

          return (
            <motion.button
              key={member.id}
              ref={(el) => { cardRefs.current[member.id] = el; }}
              type="button"
              onClick={() => handleCardClick(member)}
              aria-label={`${member.slotTitle}: ${isFilled ? member.name : 'Tap to reveal'}`}
              aria-expanded={activeCardId === member.id}
              animate={
                isSpinning && !shouldReduceMotion
                  ? { rotateY: [0, 720] }
                  : { rotateY: 0 }
              }
              transition={
                isSpinning
                  ? { duration: 1.1, ease: [0.34, 1.56, 0.64, 1] }
                  : { duration: 0.3 }
              }
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative h-44 sm:h-52 rounded-2xl p-4 flex flex-col justify-between items-center text-center cursor-pointer transition-all duration-300 select-none overflow-hidden outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                isLeader
                  ? 'bg-gradient-to-b from-[var(--accent)]/15 via-[var(--bg-surface)] to-[var(--bg-secondary)] border-2 border-[var(--accent)] shadow-[0_0_20px_rgba(182,255,0,0.25)]'
                  : isFilled
                  ? 'bg-[var(--bg-surface)] border border-[var(--accent)]/50 shadow-md'
                  : 'bg-[var(--bg-secondary)]/80 border border-dashed border-[var(--border-color)] hover:border-[var(--accent)]/60'
              }`}
            >
              {/* Leader Ribbon Badge */}
              {isLeader && (
                <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-[var(--accent)] text-slate-950 font-mono text-[10px] font-black rounded-md shadow-xs">
                  <Crown className="w-3 h-3 text-slate-950" />
                  <span>LEADER</span>
                </div>
              )}

              {/* Required / Optional Tag */}
              {!isLeader && (
                <span className="absolute top-2 right-2 text-[10px] font-mono text-[var(--text-secondary)] bg-[var(--bg-surface)] px-2 py-0.5 rounded-md border border-[var(--border-color)]">
                  {member.isRequired ? 'Required' : 'Optional'}
                </span>
              )}

              {/* Center Content */}
              <div className="my-auto space-y-2 flex flex-col items-center">
                {isFilled ? (
                  <>
                    {/* Avatar Initials */}
                    <div className="w-12 h-12 rounded-full bg-[var(--accent)]/20 border border-[var(--accent)] flex items-center justify-center font-mono font-bold text-[var(--accent)] text-base shadow-inner">
                      {getInitials(member.name)}
                    </div>
                    <div className="space-y-0.5 max-w-[130px]">
                      <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate">
                        {member.name}
                      </h4>
                      <p className="text-[11px] font-mono text-[var(--accent)] truncate">
                        {member.rollNumber}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Unrevealed Face-Down State */}
                    <div className="w-12 h-12 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)]">
                      <HelpCircle className="w-6 h-6 animate-pulse text-[var(--text-secondary)]" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[var(--text-secondary)] uppercase tracking-wider block">
                      {member.slotTitle}
                    </span>
                  </>
                )}
              </div>

              {/* Bottom State Label */}
              <div className="w-full pt-1 border-t border-[var(--border-color)]/60 flex items-center justify-between text-[11px] font-mono">
                {isFilled ? (
                  <>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                    </span>
                    <span className="text-[var(--text-secondary)] flex items-center gap-0.5 group-hover:text-[var(--text-primary)]">
                      Edit <Edit3 className="w-3 h-3 ml-0.5" />
                    </span>
                  </>
                ) : (
                  <span className="w-full text-center text-[var(--accent)] font-semibold flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3" /> Tap to reveal
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Edit Panel Modal / Mobile Bottom Sheet */}
      <AnimatePresence>
        {activeCardId && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xs transition-opacity"
            onClick={closePanel}
          >
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="member-modal-title"
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 50, scale: 0.95 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 30, scale: 0.95 }
              }
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-sm:max-h-[90vh] max-sm:overflow-y-auto sm:max-w-md bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl space-y-5 relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[var(--accent)]" />
                  <h3 id="member-modal-title" className="text-base sm:text-lg font-bold font-mono text-[var(--text-primary)]">
                    {members.find((m) => m.id === activeCardId)?.slotTitle} Details
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closePanel}
                  className="p-1 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveMember} className="space-y-4 text-left">
                {/* Full Name */}
                <div className="space-y-1">
                  <label htmlFor="member-name" className="block text-xs font-mono font-bold text-[var(--text-primary)]">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    ref={firstInputRef}
                    id="member-name"
                    type="text"
                    name="name"
                    placeholder="e.g. Alex Rivera"
                    autoComplete="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                  />
                  {formErrors.name && (
                    <p className="text-xs text-red-400 flex items-center gap-1 pt-0.5">
                      <AlertCircle className="w-3 h-3" /> {formErrors.name}
                    </p>
                  )}
                </div>

                {/* Roll Number */}
                <div className="space-y-1">
                  <label htmlFor="member-roll" className="block text-xs font-mono font-bold text-[var(--text-primary)]">
                    Roll Number / Student ID <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="member-roll"
                    type="text"
                    name="rollNumber"
                    placeholder="e.g. 21MX104"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData((prev) => ({ ...prev, rollNumber: e.target.value.toUpperCase() }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm font-mono text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all uppercase"
                  />
                  {formErrors.rollNumber && (
                    <p className="text-xs text-red-400 flex items-center gap-1 pt-0.5">
                      <AlertCircle className="w-3 h-3" /> {formErrors.rollNumber}
                    </p>
                  )}
                </div>

                {/* Mobile Number */}
                <div className="space-y-1">
                  <label htmlFor="member-phone" className="block text-xs font-mono font-bold text-[var(--text-primary)]">
                    Mobile Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="member-phone"
                    type="tel"
                    inputMode="numeric"
                    name="phone"
                    placeholder="10-digit mobile number"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm font-mono text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                  />
                  {formErrors.phone && (
                    <p className="text-xs text-red-400 flex items-center gap-1 pt-0.5">
                      <AlertCircle className="w-3 h-3" /> {formErrors.phone}
                    </p>
                  )}
                </div>

                {/* College Email */}
                <div className="space-y-1">
                  <label htmlFor="member-email" className="block text-xs font-mono font-bold text-[var(--text-primary)]">
                    College Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="member-email"
                    type="email"
                    name="email"
                    placeholder="student@college.edu"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                  />
                  {formErrors.email && (
                    <p className="text-xs text-red-400 flex items-center gap-1 pt-0.5">
                      <AlertCircle className="w-3 h-3" /> {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Form Buttons */}
                <div className="pt-3 flex flex-wrap items-center justify-between gap-3">
                  {/* Remove button for optional member */}
                  {activeCardId !== 'leader-1' && members.find((m) => m.id === activeCardId)?.isRevealed ? (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(activeCardId)}
                      className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-mono font-bold rounded-xl border border-red-500/30 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove Member
                    </button>
                  ) : <div />}

                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={closePanel}
                      className="px-4 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-mono font-bold rounded-xl border border-[var(--border-color)] transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-slate-950 text-xs font-mono font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                      Save Member
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lock in Team CTA Section */}
      <div className="pt-2 text-center space-y-3">
        {onSubmitTeam && (
          <button
            type="button"
            disabled={!requiredCardsValid || isLoading}
            onClick={() => onSubmitTeam(members)}
            className={`w-full py-4 px-8 rounded-xl font-mono font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
              requiredCardsValid && !isLoading
                ? 'bg-[var(--accent)] text-slate-950 shadow-[0_0_25px_rgba(182,255,0,0.35)] hover:shadow-[0_0_35px_rgba(182,255,0,0.55)] hover:scale-[1.01] active:scale-[0.99]'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]/50 border border-[var(--border-color)] cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <span>Submitting Team Registration...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Lock in Team & Submit Registration</span>
              </>
            )}
          </button>
        )}

        <p className="text-[11px] text-[var(--text-secondary)]">
          Details are used strictly for hackathon coordination & campus check-in.
        </p>
      </div>
    </div>
  );
};
