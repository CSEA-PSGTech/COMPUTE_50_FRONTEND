import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { User, Crown, Trash2, Edit3, X, Sparkles, AlertCircle, ShieldCheck, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { User as AuthUser } from '../../types/auth';
import { soundTap, soundReveal, soundSave, soundTeamComplete } from '../../lib/sound';

export interface MemberData {
  id: string;
  slotNumber: string;
  slotTitle: string;
  name: string;
  rollNumber: string;
  phone: string;
  email: string;
  college: string;
  department: string;
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

  // Team Name state
  const [teamName, setTeamName] = useState<string>('CyberPunks 50');

  // Initial 4 Team Member Slots
  const [members, setMembers] = useState<MemberData[]>([
    {
      id: 'leader-1',
      slotNumber: '01',
      slotTitle: 'TEAM LEADER',
      name: currentUser?.name || 'Alex Rivera',
      rollNumber: currentUser?.rollNumber || '21MX101',
      phone: currentUser?.phone || '9876543210',
      email: currentUser?.email || 'alex.rivera@psgtech.ac.in',
      college: currentUser?.college || 'PSG College of Technology',
      department: currentUser?.department || 'CSE',
      isRequired: true,
      isRevealed: true, // Pre-revealed Leader
      hasSpunOnce: true,
    },
    {
      id: 'member-2',
      slotNumber: '02',
      slotTitle: 'MEMBER 2',
      name: '',
      rollNumber: '',
      phone: '',
      email: '',
      college: 'PSG College of Technology',
      department: 'CSE',
      isRequired: true,
      isRevealed: false,
      hasSpunOnce: false,
    },
    {
      id: 'member-3',
      slotNumber: '03',
      slotTitle: 'MEMBER 3',
      name: '',
      rollNumber: '',
      phone: '',
      email: '',
      college: 'PSG College of Technology',
      department: 'CSE',
      isRequired: false,
      isRevealed: false,
      hasSpunOnce: false,
    },
    {
      id: 'member-4',
      slotNumber: '04',
      slotTitle: 'MEMBER 4',
      name: '',
      rollNumber: '',
      phone: '',
      email: '',
      college: 'PSG College of Technology',
      department: 'CSE',
      isRequired: false,
      isRevealed: false,
      hasSpunOnce: false,
    },
  ]);

  // Card Animation & Edit Panel State
  const [spinningCardId, setSpinningCardId] = useState<string | null>(null);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [cardTilts, setCardTilts] = useState<Record<string, { x: number; y: number }>>({});

  // Edit Form State
  const [formData, setFormData] = useState<{
    name: string;
    rollNumber: string;
    phone: string;
    email: string;
    college: string;
  }>({ name: '', rollNumber: '', phone: '', email: '', college: 'PSG College of Technology' });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Focus Trap Refs
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Sync current user profile
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
                college: m.college || currentUser.college || 'PSG College of Technology',
              }
            : m
        )
      );
    }
  }, [currentUser]);

  // Check card validity
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

  // Particle Burst helper (<20 particles, <700ms)
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
      particleCount: 16,
      spread: 50,
      startVelocity: 16,
      ticks: 45,
      gravity: 0.9,
      colors: ['#B6FF00', '#C8FF33', '#22c55e', '#ffffff'],
      origin,
    });
  };

  // Subtle 3D Desktop Card Tilt
  const handleMouseMove = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setCardTilts((prev) => ({
      ...prev,
      [id]: { x: -(y / rect.height) * 10, y: (x / rect.width) * 10 },
    }));
  };

  const handleMouseLeave = (id: string) => {
    setCardTilts((prev) => ({ ...prev, [id]: { x: 0, y: 0 } }));
  };

  // Handle Card Click / Reveal
  const handleCardClick = (member: MemberData) => {
    soundTap();
    const isFirstTime = !member.hasSpunOnce;

    setFormData({
      name: member.name,
      rollNumber: member.rollNumber,
      phone: member.phone,
      email: member.email,
      college: member.college || 'PSG College of Technology',
    });
    setFormErrors({});

    if (isFirstTime && !shouldReduceMotion) {
      soundReveal();
      setSpinningCardId(member.id);
      setTimeout(() => {
        setSpinningCardId(null);
        setActiveCardId(member.id);
        setMembers((prev) =>
          prev.map((m) => (m.id === member.id ? { ...m, hasSpunOnce: true } : m))
        );
      }, 950);
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

  // Dialog Accessibility (Esc key & Focus trap)
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

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    setTimeout(() => firstInputRef.current?.focus(), 100);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCardId]);

  // Validate Member Inputs & Duplicate Checks
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

    // Duplicate detection across team
    members.forEach((m) => {
      if (m.id !== activeCardId && m.isRevealed) {
        if (formData.email.trim() && m.email.trim().toLowerCase() === formData.email.trim().toLowerCase()) {
          errors.email = 'This email is already registered for another member';
        }
        if (formData.rollNumber.trim() && m.rollNumber.trim().toLowerCase() === formData.rollNumber.trim().toLowerCase()) {
          errors.rollNumber = 'This roll number is already registered for another member';
        }
        if (formData.phone.trim() && m.phone.replace(/\D/g, '') === formData.phone.replace(/\D/g, '')) {
          errors.phone = 'This mobile number is already registered for another member';
        }
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save Member
  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFieldValues() || !activeCardId) return;

    soundSave();
    const currentMember = members.find((m) => m.id === activeCardId);
    const wasNewlyRevealed = currentMember && !currentMember.isRevealed;

    const updatedMembers = members.map((m) =>
      m.id === activeCardId
        ? {
            ...m,
            name: formData.name.trim(),
            rollNumber: formData.rollNumber.trim().toUpperCase(),
            phone: formData.phone.trim(),
            email: formData.email.trim(),
            college: formData.college.trim(),
            isRevealed: true,
            hasSpunOnce: true,
          }
        : m
    );

    setMembers(updatedMembers);

    if (wasNewlyRevealed) {
      triggerParticleBurst(cardRefs.current[activeCardId]);
    }

    const newFilledCount = updatedMembers.filter((m) => m.isRevealed && isCardValid(m)).length;
    if (newFilledCount === 4) {
      soundTeamComplete();
    }

    closePanel();
  };

  // Remove Optional Member
  const handleRemoveMember = (id: string) => {
    soundTap();
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

  return (
    <div className="space-y-8 text-center select-none">
      {/* 1. CORE EXPERIENCE HEADER */}
      <div className="space-y-3 max-w-xl mx-auto">
        <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[var(--accent)] uppercase flex items-center justify-center gap-2">
          <Zap className="w-3.5 h-3.5 text-[var(--accent)] animate-pulse" />
          HACKATHON TEAM FORMATION
        </span>

        <h2 className="text-3xl sm:text-4xl font-black font-mono text-[var(--text-primary)] tracking-tight uppercase">
          ASSEMBLE YOUR TEAM
        </h2>

        {/* Team Name Input */}
        <div className="flex justify-center items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl font-mono text-xs sm:text-sm text-[var(--text-primary)] font-bold">
            <span className="text-[var(--text-secondary)]">TEAM:</span>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="bg-transparent text-[var(--accent)] font-bold focus:outline-none w-36 sm:w-48 text-center"
              placeholder="Enter Team Name"
            />
          </div>
        </div>

        {/* Progress Dots Indicator */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <div className="flex items-center gap-1.5">
            {members.map((m) => {
              const isFilled = m.isRevealed && isCardValid(m);
              return (
                <span
                  key={m.id}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    isFilled
                      ? 'bg-[var(--accent)] shadow-[0_0_10px_rgba(182,255,0,0.6)] scale-110'
                      : 'bg-[var(--border-color)]'
                  }`}
                  title={`${m.slotTitle}: ${isFilled ? 'Ready' : 'Pending'}`}
                />
              );
            })}
          </div>
          <span className="font-mono text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
            {filledCount.toString().padStart(2, '0')} / 04 MEMBERS READY
          </span>
        </div>
      </div>

      {/* 2. MEMBER CARDS GRID (Desktop 4-in-a-row, Mobile 2x2) */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-2"
        style={{ perspective: '1200px' }}
      >
        {members.map((member, index) => {
          const isLeader = index === 0;
          const isSpinning = spinningCardId === member.id;
          const isFilled = member.isRevealed && isCardValid(member);
          const tilt = cardTilts[member.id] || { x: 0, y: 0 };

          return (
            <motion.button
              key={member.id}
              ref={(el) => { cardRefs.current[member.id] = el; }}
              type="button"
              onClick={() => handleCardClick(member)}
              onMouseMove={(e) => handleMouseMove(member.id, e)}
              onMouseLeave={() => handleMouseLeave(member.id)}
              aria-label={`${member.slotTitle}: ${isFilled ? member.name : 'Tap to reveal'}`}
              aria-expanded={activeCardId === member.id}
              style={{ transformStyle: 'preserve-3d' }}
              animate={
                isSpinning && !shouldReduceMotion
                  ? { rotateY: [0, 360, 720], scale: [1, 1.08, 1], z: [0, 50, 0] }
                  : { rotateX: tilt.x, rotateY: tilt.y, scale: 1 }
              }
              transition={
                isSpinning
                  ? { duration: 1.1, ease: [0.25, 1, 0.5, 1] }
                  : { type: 'spring', stiffness: 300, damping: 20 }
              }
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className={`relative aspect-[3/4.3] w-full rounded-2xl p-4 sm:p-5 flex flex-col justify-between text-left cursor-pointer transition-all duration-300 outline-none focus:ring-2 focus:ring-[var(--accent)] overflow-hidden ${
                isFilled
                  ? 'bg-gradient-to-b from-[var(--bg-surface)] via-[var(--bg-secondary)] to-[var(--bg-main)] border-2 border-[var(--accent)] shadow-[0_0_20px_rgba(182,255,0,0.25)]'
                  : 'bg-gradient-to-b from-zinc-900/90 via-black to-zinc-950 border border-dashed border-[var(--border-color)] hover:border-[var(--accent)]/70 shadow-lg'
              }`}
            >
              {/* Outer Decorative Tech Brackets */}
              <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-[var(--accent)]/50 pointer-events-none" />
              <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-[var(--accent)]/50 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-[var(--accent)]/50 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-[var(--accent)]/50 pointer-events-none" />

              {/* UNREVEALED STATE */}
              {!isFilled ? (
                <div className="h-full flex flex-col justify-between items-center text-center py-2 relative z-10">
                  {/* Top Slot Header */}
                  <div className="w-full flex items-center justify-between font-mono text-[10px] text-[var(--text-secondary)] tracking-widest border-b border-[var(--border-color)]/50 pb-2">
                    <span className="text-[var(--accent)] font-extrabold">{member.slotNumber}</span>
                    <span>{member.isRequired ? 'REQUIRED' : 'OPTIONAL'}</span>
                  </div>

                  {/* Central Futuristic Tech Emblem */}
                  <div className="my-auto space-y-3 flex flex-col items-center">
                    <div className="relative w-16 h-16 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center group-hover:border-[var(--accent)] transition-all">
                      {/* Technical Circuit Pattern Background */}
                      <svg className="absolute inset-0 w-full h-full opacity-20 text-[var(--accent)]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M10 10 h80 v80 h-80 z M30 30 h40 v40 h-40 z" />
                      </svg>
                      <Sparkles className="w-7 h-7 text-[var(--accent)] animate-pulse" />
                    </div>

                    <div className="space-y-0.5">
                      <span className="block font-mono text-xs font-black text-[var(--text-primary)] tracking-wider uppercase">
                        {member.slotTitle}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-secondary)] block">
                        COMPUTE 50 MEMBER
                      </span>
                    </div>
                  </div>

                  {/* Bottom Reveal Prompt */}
                  <div className="w-full pt-2 border-t border-[var(--border-color)]/50">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--accent-muted)] border border-[var(--accent)]/40 rounded-full text-[10px] font-mono font-bold text-[var(--accent)] tracking-wider uppercase shadow-xs">
                      <Sparkles className="w-3 h-3 text-[var(--accent)]" /> TAP TO REVEAL
                    </span>
                  </div>
                </div>
              ) : (
                /* REVEALED / COMPLETED COLLECTIBLE CARD STATE */
                <div className="h-full flex flex-col justify-between py-1 relative z-10">
                  {/* Top Header */}
                  <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2 font-mono text-[10px]">
                    <span className="font-bold text-[var(--accent)] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
                      {isLeader ? '✓ LEADER' : `✓ ${member.slotTitle}`}
                    </span>
                    <span className="text-[var(--text-secondary)] font-bold">{member.slotNumber}</span>
                  </div>

                  {/* Member Card Information Body */}
                  <div className="my-auto space-y-3">
                    <div>
                      <h4 className="font-mono text-sm sm:text-base font-black text-[var(--text-primary)] tracking-tight uppercase leading-tight truncate">
                        {member.name}
                      </h4>
                      <p className="text-[10px] font-mono font-bold text-[var(--accent)] tracking-wider uppercase pt-0.5 truncate">
                        CSE • PSG TECH
                      </p>
                    </div>

                    <div className="space-y-1.5 font-mono text-[11px] bg-[var(--bg-secondary)]/80 p-2.5 rounded-xl border border-[var(--border-color)]/80">
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)] text-[10px]">ROLL NO</span>
                        <span className="font-bold text-[var(--text-primary)]">{member.rollNumber}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)] text-[10px]">MOBILE</span>
                        <span className="font-bold text-[var(--text-primary)]">{member.phone}</span>
                      </div>
                      <div className="flex items-center justify-between truncate">
                        <span className="text-[var(--text-secondary)] text-[10px]">EMAIL</span>
                        <span className="font-bold text-[var(--text-primary)] truncate max-w-[100px]" title={member.email}>
                          {member.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Ready Badge & Edit Trigger */}
                  <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between font-mono text-[10px]">
                    <span className="text-[var(--accent)] font-extrabold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                      MEMBER READY
                    </span>
                    <span className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold flex items-center gap-0.5">
                      EDIT <Edit3 className="w-3 h-3 ml-0.5 text-[var(--accent)]" />
                    </span>
                  </div>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* 5. EXPANDED MEMBER EDIT DIALOG / MOBILE BOTTOM SHEET */}
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
              className="w-full max-sm:max-h-[90vh] max-sm:overflow-y-auto sm:max-w-md bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl space-y-5 relative text-left"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[var(--accent)]" />
                  <h3 id="member-modal-title" className="text-base sm:text-lg font-bold font-mono text-[var(--text-primary)]">
                    Configure {members.find((m) => m.id === activeCardId)?.slotTitle}
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
              <form onSubmit={handleSaveMember} className="space-y-4">
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all font-mono"
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
                    Roll Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="member-roll"
                    type="text"
                    name="rollNumber"
                    placeholder="e.g. 21MX101"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm font-mono text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                  />
                  {formErrors.email && (
                    <p className="text-xs text-red-400 flex items-center gap-1 pt-0.5">
                      <AlertCircle className="w-3 h-3" /> {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="pt-3 flex flex-wrap items-center justify-between gap-3">
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

      {/* Lock in Team Submission CTA */}
      <div className="pt-4 text-center space-y-3">
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
                <Crown className="w-4 h-4 text-slate-950" />
                <span>LOCK IN TEAM & SUBMIT REGISTRATION</span>
              </>
            )}
          </button>
        )}

        <p className="text-[11px] text-[var(--text-secondary)] font-mono">
          Details are used strictly for hackathon coordination & campus check-in.
        </p>
      </div>
    </div>
  );
};
