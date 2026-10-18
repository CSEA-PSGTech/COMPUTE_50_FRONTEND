import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Crown,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Edit2,
  Trash2,
  Check,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { User as AuthUser } from '../../types/auth';
import { soundTap, soundSave, soundTeamComplete, soundReveal } from '../../lib/sound';

export interface MemberData {
  id: string;
  slotNumber: string;
  slotTitle: string;
  role: 'Leader' | 'Member';
  name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  rollNumber: string;
  isRequired: boolean;
  isCompleted: boolean;
  isRevealed?: boolean;
}

interface TeamRevealCardsProps {
  currentUser?: AuthUser | null;
  initialTeamName?: string;
  onTeamDataChange?: (members: MemberData[], isValid: boolean) => void;
  onSubmitTeam?: (members: MemberData[], teamName?: string) => void;
  isLoading?: boolean;
}

const YEAR_OPTIONS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  'Postgraduate (M.E. / M.Tech / MCA)',
];

export const TeamRevealCards: React.FC<TeamRevealCardsProps> = ({
  currentUser,
  initialTeamName,
  onTeamDataChange,
  onSubmitTeam,
  isLoading = false,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Screen size detection for stable mobile rendering
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Team Name state
  const [teamName, setTeamName] = useState<string>(initialTeamName || 'CyberPunks 50');
  const [isEditingTeamName, setIsEditingTeamName] = useState<boolean>(false);

  // Active view: 'deck' | 'flip-form' | 'review'
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showReview, setShowReview] = useState<boolean>(false);

  // Team Member Slots (Leader + 3 Members = 4 max, 2 min required)
  const [members, setMembers] = useState<MemberData[]>([
    {
      id: 'member-1',
      slotNumber: '01',
      slotTitle: 'TEAM LEADER',
      role: 'Leader',
      name: currentUser?.name || 'Alex Rivera',
      email: currentUser?.email || 'alex.rivera@psgtech.ac.in',
      phone: currentUser?.phone || '9876543210',
      college: currentUser?.college || 'PSG College of Technology',
      department: currentUser?.department || 'Computer Science & Engineering',
      year: currentUser?.year || '3rd Year',
      rollNumber: currentUser?.rollNumber || '21MX101',
      isRequired: true,
      isCompleted: true,
      isRevealed: true,
    },
    {
      id: 'member-2',
      slotNumber: '02',
      slotTitle: 'TEAM MEMBER',
      role: 'Member',
      name: '',
      email: '',
      phone: '',
      college: 'PSG College of Technology',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      rollNumber: '',
      isRequired: true,
      isCompleted: false,
      isRevealed: false,
    },
    {
      id: 'member-3',
      slotNumber: '03',
      slotTitle: 'TEAM MEMBER',
      role: 'Member',
      name: '',
      email: '',
      phone: '',
      college: 'PSG College of Technology',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      rollNumber: '',
      isRequired: false,
      isCompleted: false,
      isRevealed: false,
    },
    {
      id: 'member-4',
      slotNumber: '04',
      slotTitle: 'TEAM MEMBER',
      role: 'Member',
      name: '',
      email: '',
      phone: '',
      college: 'PSG College of Technology',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      rollNumber: '',
      isRequired: false,
      isCompleted: false,
      isRevealed: false,
    },
  ]);

  // Form State for Active Card
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    college: string;
    department: string;
    year: string;
    rollNumber: string;
  }>({
    name: '',
    email: '',
    phone: '',
    college: 'PSG College of Technology',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    rollNumber: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Accessibility refs
  const firstInputRef = useRef<HTMLInputElement>(null);
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Sync with currentUser when it updates
  const prevUserRef = useRef(currentUser);
  useEffect(() => {
    if (currentUser && currentUser !== prevUserRef.current) {
      prevUserRef.current = currentUser;
      setMembers((prev) =>
        prev.map((m, index) =>
          index === 0
            ? {
              ...m,
              name: currentUser.name || m.name,
              email: currentUser.email || m.email,
              phone: currentUser.phone || m.phone,
              college: currentUser.college || m.college,
              department: currentUser.department || m.department,
              year: currentUser.year || m.year,
              rollNumber: currentUser.rollNumber || m.rollNumber,
              isCompleted: true,
              isRevealed: true,
            }
            : m
        )
      );
    }
  }, [currentUser]);

  // Member validity helper
  const isMemberDataValid = (m: MemberData): boolean => {
    return (
      m.name.trim().length >= 2 &&
      /\S+@\S+\.\S+/.test(m.email.trim()) &&
      m.phone.replace(/\D/g, '').length === 10 &&
      m.college.trim().length >= 2 &&
      m.department.trim().length >= 2 &&
      m.year.trim().length > 0
    );
  };

  // Required cards (0 and 1) must be valid; any completed optional cards must also be valid
  const requiredValid =
    isMemberDataValid(members[0]) &&
    members[1].isCompleted &&
    isMemberDataValid(members[1]);

  const allFilledValid =
    requiredValid &&
    (!members[2].isCompleted || isMemberDataValid(members[2])) &&
    (!members[3].isCompleted || isMemberDataValid(members[3]));

  const completedCount = members.filter((m) => m.isCompleted).length;

  // Find next incomplete required card
  const nextRequiredIndex = members.findIndex((m) => m.isRequired && !m.isCompleted);

  // Notify parent of changes
  useEffect(() => {
    if (onTeamDataChange) {
      onTeamDataChange(members, allFilledValid);
    }
  }, [members, allFilledValid, onTeamDataChange]);

  // Open a card to flip and edit
  const handleOpenCard = (member: MemberData) => {
    soundReveal();
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      college: member.college || 'PSG College of Technology',
      department: member.department || 'Computer Science & Engineering',
      year: member.year || '3rd Year',
      rollNumber: member.rollNumber || '',
    });
    setFormErrors({});
    setActiveCardId(member.id);
    setShowReview(false);

    // Smoothly scroll mobile viewport to the card form
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      window.scrollTo({ top: 30, behavior: 'smooth' });
    }

    // Trigger smooth 3D flip for desktop
    setIsFlipped(false);
    requestAnimationFrame(() => {
      setIsFlipped(true);
    });

    setTimeout(() => {
      firstInputRef.current?.focus();
    }, shouldReduceMotion ? 50 : 450);
  };

  // Return from form back to deck
  const handleBackToDeck = React.useCallback(() => {
    soundTap();
    setIsFlipped(false);
    setTimeout(() => {
      const closedId = activeCardId;
      setActiveCardId(null);
      setFormErrors({});
      if (closedId && cardRefs.current[closedId]) {
        cardRefs.current[closedId]?.focus();
      }
    }, shouldReduceMotion ? 0 : 420);
  }, [activeCardId, shouldReduceMotion]);

  // Escape key listener for modal/flip view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeCardId) {
          handleBackToDeck();
        } else if (showReview) {
          setShowReview(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCardId, showReview, handleBackToDeck]);

  // Validate form fields
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Full name is required (minimum 2 characters)';
    }

    if (!formData.email.trim()) {
      errors.email = 'College email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      errors.email = 'Enter a valid email address';
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim()) {
      errors.phone = 'Mobile number is required';
    } else if (cleanPhone.length !== 10) {
      errors.phone = 'Enter a valid 10-digit mobile number';
    }

    if (!formData.college.trim()) {
      errors.college = 'College or institution is required';
    }

    if (!formData.department.trim()) {
      errors.department = 'Department is required';
    }

    if (!formData.year.trim()) {
      errors.year = 'Year of study is required';
    }

    // Duplicate checks across team members
    members.forEach((m) => {
      if (m.id !== activeCardId && m.isCompleted) {
        if (
          formData.email.trim() &&
          m.email.trim().toLowerCase() === formData.email.trim().toLowerCase()
        ) {
          errors.email = 'This email is already added for another member';
        }
        if (
          formData.phone.trim() &&
          m.phone.replace(/\D/g, '') === cleanPhone
        ) {
          errors.phone = 'This mobile number is already used for another member';
        }
        if (
          formData.rollNumber.trim() &&
          m.rollNumber.trim().toUpperCase() ===
          formData.rollNumber.trim().toUpperCase()
        ) {
          errors.rollNumber = 'This roll number is already used for another member';
        }
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save member form
  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !activeCardId) return;

    soundSave();

    const updatedMembers = members.map((m) =>
      m.id === activeCardId
        ? {
          ...m,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          college: formData.college.trim(),
          department: formData.department.trim(),
          year: formData.year.trim(),
          rollNumber: formData.rollNumber.trim().toUpperCase(),
          isCompleted: true,
          isRevealed: true,
        }
        : m
    );

    setMembers(updatedMembers);

    const newCompletedCount = updatedMembers.filter((m) => m.isCompleted).length;
    if (newCompletedCount === 4) {
      soundTeamComplete();
    }

    // Flip card back into the deck
    setIsFlipped(false);
    setTimeout(() => {
      setActiveCardId(null);
      setFormErrors({});
    }, shouldReduceMotion ? 0 : 450);
  };

  // Remove optional member
  const handleRemoveOptionalMember = (id: string) => {
    soundTap();
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
            ...m,
            name: '',
            email: '',
            phone: '',
            rollNumber: '',
            isCompleted: false,
            isRevealed: false,
          }
          : m
      )
    );
    handleBackToDeck();
  };

  const activeMember = members.find((m) => m.id === activeCardId);

  // -------------------------------------------------------------
  // SHARED MEMBER FORM CONTENT (Crisp, Solid, Box-Sized)
  // -------------------------------------------------------------
  const renderMemberFormContent = () => {
    if (!activeMember) return null;

    return (
      <div className="w-full min-w-0 box-border space-y-5 sm:space-y-6">
        {/* Form Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3.5 gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[var(--accent-muted)] border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] shrink-0">
              {activeMember.role === 'Leader' ? (
                <Crown className="w-4 h-4" />
              ) : (
                <UserIcon className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono font-bold tracking-wider text-[var(--accent)] uppercase">
                  CARD {activeMember.slotNumber}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)]">
                  {activeMember.isRequired ? 'REQUIRED' : 'OPTIONAL'}
                </span>
              </div>
              <h3 className="font-mono font-bold text-sm sm:text-base text-[var(--text-primary)] truncate">
                {activeMember.role === 'Leader'
                  ? 'Team Leader Details'
                  : `Teammate ${activeMember.slotNumber} Details`}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleBackToDeck}
            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border border-[var(--border-color)] hover:border-[var(--accent)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-secondary)] transition-colors cursor-pointer shrink-0 min-h-[36px]"
            aria-label="Back to deck"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Deck</span>
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSaveMember} className="w-full min-w-0 box-border space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5 min-w-0">
              <label
                htmlFor="member-name-input"
                className="block text-xs font-mono font-semibold text-[var(--text-primary)]"
              >
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                ref={firstInputRef}
                id="member-name-input"
                type="text"
                name="name"
                placeholder="e.g. Alex Rivera"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full min-w-0 box-border h-11 px-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm font-mono text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all"
              />
              {formErrors.name && (
                <p role="alert" className="text-xs text-red-400 flex items-center gap-1 break-words">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {formErrors.name}
                </p>
              )}
            </div>

            {/* College Email */}
            <div className="space-y-1.5 min-w-0">
              <label
                htmlFor="member-email-input"
                className="block text-xs font-mono font-semibold text-[var(--text-primary)]"
              >
                College Email <span className="text-red-400">*</span>
              </label>
              <input
                id="member-email-input"
                type="email"
                name="email"
                placeholder="e.g. student@psgtech.ac.in"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full min-w-0 box-border h-11 px-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm font-mono text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all"
              />
              {formErrors.email && (
                <p role="alert" className="text-xs text-red-400 flex items-center gap-1 break-words">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {formErrors.email}
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5 min-w-0">
              <label
                htmlFor="member-phone-input"
                className="block text-xs font-mono font-semibold text-[var(--text-primary)]"
              >
                Phone Number <span className="text-red-400">*</span>
              </label>
              <input
                id="member-phone-input"
                type="tel"
                inputMode="numeric"
                name="phone"
                placeholder="10-digit mobile number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full min-w-0 box-border h-11 px-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm font-mono text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all"
              />
              {formErrors.phone && (
                <p role="alert" className="text-xs text-red-400 flex items-center gap-1 break-words">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {formErrors.phone}
                </p>
              )}
            </div>

            {/* Year of Study */}
            <div className="space-y-1.5 min-w-0">
              <label
                htmlFor="member-year-select"
                className="block text-xs font-mono font-semibold text-[var(--text-primary)]"
              >
                Year of Study <span className="text-red-400">*</span>
              </label>
              <select
                id="member-year-select"
                name="year"
                value={formData.year}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, year: e.target.value }))
                }
                className="w-full min-w-0 box-border h-11 px-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all cursor-pointer"
              >
                {YEAR_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-[var(--bg-surface)]">
                    {opt}
                  </option>
                ))}
              </select>
              {formErrors.year && (
                <p role="alert" className="text-xs text-red-400 flex items-center gap-1 break-words">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {formErrors.year}
                </p>
              )}
            </div>

            {/* College / Institution */}
            <div className="space-y-1.5 min-w-0">
              <label
                htmlFor="member-college-input"
                className="block text-xs font-mono font-semibold text-[var(--text-primary)]"
              >
                College / Institution <span className="text-red-400">*</span>
              </label>
              <input
                id="member-college-input"
                type="text"
                name="college"
                placeholder="e.g. PSG College of Technology"
                value={formData.college}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, college: e.target.value }))
                }
                className="w-full min-w-0 box-border h-11 px-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm font-mono text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all"
              />
              {formErrors.college && (
                <p role="alert" className="text-xs text-red-400 flex items-center gap-1 break-words">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {formErrors.college}
                </p>
              )}
            </div>

            {/* Department */}
            <div className="space-y-1.5 min-w-0">
              <label
                htmlFor="member-dept-input"
                className="block text-xs font-mono font-semibold text-[var(--text-primary)]"
              >
                Department <span className="text-red-400">*</span>
              </label>
              <input
                id="member-dept-input"
                type="text"
                name="department"
                placeholder="e.g. Computer Science & Engineering"
                value={formData.department}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, department: e.target.value }))
                }
                className="w-full min-w-0 box-border h-11 px-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm font-mono text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all"
              />
              {formErrors.department && (
                <p role="alert" className="text-xs text-red-400 flex items-center gap-1 break-words">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {formErrors.department}
                </p>
              )}
            </div>
          </div>

          {/* Roll Number (Optional) */}
          <div className="space-y-1.5 min-w-0">
            <label
              htmlFor="member-roll-input"
              className="block text-xs font-mono font-semibold text-[var(--text-secondary)]"
            >
              Roll Number / Student ID <span className="text-zinc-500">(Optional)</span>
            </label>
            <input
              id="member-roll-input"
              type="text"
              name="rollNumber"
              placeholder="e.g. 21MX101"
              value={formData.rollNumber}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  rollNumber: e.target.value.toUpperCase(),
                }))
              }
              className="w-full sm:w-1/2 min-w-0 box-border h-11 px-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm font-mono text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all uppercase"
            />
            {formErrors.rollNumber && (
              <p role="alert" className="text-xs text-red-400 flex items-center gap-1 break-words">
                <AlertCircle className="w-3 h-3 shrink-0" /> {formErrors.rollNumber}
              </p>
            )}
          </div>

          {/* Action Buttons: Stacks cleanly on mobile, side-by-side on desktop */}
          <div className="pt-3 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              {!activeMember.isRequired && activeMember.isCompleted && (
                <button
                  type="button"
                  onClick={() => handleRemoveOptionalMember(activeMember.id)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-mono font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition-all cursor-pointer min-h-[44px]"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove Member
                </button>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2.5 sm:ml-auto w-full sm:w-auto">
              <button
                type="button"
                onClick={handleBackToDeck}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-xs font-mono font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)] text-center transition-all cursor-pointer min-h-[44px]"
              >
                Cancel / Back to Deck
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] text-xs font-mono font-extrabold shadow-sm text-center transition-all cursor-pointer min-h-[44px]"
              >
                Save Member
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  };

  // -------------------------------------------------------------
  // REVIEW TEAM SCREEN
  // -------------------------------------------------------------
  if (showReview) {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-6 text-left pb-8 sm:pb-2">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div>
            <span className="text-[11px] font-mono font-bold tracking-widest text-[var(--accent)] uppercase">
              FINAL VERIFICATION
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-[var(--text-primary)]">
              Review Your Team
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              Verify your team roster before final submission. Minimum 2 members required.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowReview(false)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-mono font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]/50 transition-colors cursor-pointer self-start sm:self-auto min-h-[38px]"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Deck
          </button>
        </div>

        {/* Team Name Card */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
              TEAM NAME
            </span>
            <h3 className="text-lg font-bold font-mono text-[var(--text-primary)]">
              {teamName}
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[var(--accent-muted)] text-[var(--accent)] border border-[var(--accent)]/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            {completedCount} / 4 Members Ready
          </span>
        </div>

        {/* Members Roster List */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            TEAM ROSTER
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {members.map((member) => {
              if (member.isCompleted && member.name.trim()) {
                return (
                  <div
                    key={member.id}
                    className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--accent)]/60 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-[var(--border-color)] pb-2.5">
                      <div className="flex items-center gap-2">
                        {member.role === 'Leader' ? (
                          <div className="w-7 h-7 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/30 flex items-center justify-center">
                            <Crown className="w-4 h-4 text-[var(--accent)]" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-[var(--text-secondary)]" />
                          </div>
                        )}
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--accent)]">
                            CARD {member.slotNumber} · {member.role === 'Leader' ? 'LEADER' : 'MEMBER'}
                          </span>
                          <h5 className="font-mono font-bold text-sm text-[var(--text-primary)] leading-tight">
                            {member.name}
                          </h5>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenCard(member)}
                        className="p-2 rounded-lg border border-[var(--border-color)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors cursor-pointer min-h-[36px]"
                        title="Edit member"
                        aria-label={`Edit ${member.name}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1 text-xs font-mono text-[var(--text-secondary)]">
                      <p className="truncate">
                        <span className="text-[10px] text-[var(--text-secondary)]/70">Email:</span>{' '}
                        <span className="text-[var(--text-primary)]">{member.email}</span>
                      </p>
                      <p>
                        <span className="text-[10px] text-[var(--text-secondary)]/70">Phone:</span>{' '}
                        <span className="text-[var(--text-primary)]">{member.phone}</span>
                      </p>
                      <p className="truncate">
                        <span className="text-[10px] text-[var(--text-secondary)]/70">College:</span>{' '}
                        <span className="text-[var(--text-primary)]">{member.college}</span>
                      </p>
                      <p className="truncate">
                        <span className="text-[10px] text-[var(--text-secondary)]/70">Dept:</span>{' '}
                        <span className="text-[var(--text-primary)]">
                          {member.department} ({member.year})
                        </span>
                      </p>
                      {member.rollNumber && (
                        <p>
                          <span className="text-[10px] text-[var(--text-secondary)]/70">Roll:</span>{' '}
                          <span className="text-[var(--text-primary)]">{member.rollNumber}</span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              }

              // Incomplete optional slot
              return (
                <div
                  key={member.id}
                  className="p-4 rounded-xl bg-[var(--bg-secondary)]/60 border border-dashed border-[var(--border-color)] flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono tracking-widest text-[var(--text-secondary)]">
                      CARD {member.slotNumber} · OPTIONAL
                    </span>
                    <p className="text-xs font-mono text-[var(--text-secondary)]">
                      Slot is empty
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenCard(member)}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-[var(--border-color)] hover:border-[var(--accent)] text-xs font-mono font-bold text-[var(--text-primary)] dark:hover:text-[var(--accent)] transition-colors cursor-pointer min-h-[38px]"
                  >
                    + Add Member
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Actions: Stacks cleanly on mobile, side-by-side on desktop */}
        <div className="pt-4 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowReview(false)}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-mono font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer min-h-[44px] text-center"
          >
            ← Back to Deck
          </button>

          {onSubmitTeam && (
            <button
              type="button"
              disabled={!allFilledValid || isLoading}
              onClick={() => onSubmitTeam(members, teamName)}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px] ${allFilledValid && !isLoading
                  ? 'bg-[var(--accent)] text-[var(--accent-text)] shadow-[0_0_20px_rgba(var(--accent-rgb),0.35)] hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.5)] hover:scale-[1.01]'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]/50 border border-[var(--border-color)] cursor-not-allowed'
                }`}
            >
              {isLoading ? (
                <span>Submitting Registration...</span>
              ) : (
                <>
                  <Crown className="w-4 h-4" />
                  <span>Submit Hackathon Registration</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ACTIVE CARD FORM VIEW (Desktop 3D Flip & Mobile Crisp Solid View)
  // -------------------------------------------------------------
  if (activeCardId && activeMember) {
    return (
      <div className="w-full max-w-2xl mx-auto py-2">
        {isMobile ? (
          /* MOBILE VIEW: Solid, opaque, crisp surface without 3D transforms on inputs */
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="w-full min-w-0 box-border rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-2xl p-4 sm:p-6 text-left"
          >
            {renderMemberFormContent()}
          </motion.div>
        ) : (
          /* DESKTOP VIEW: Full 3D vertical-axis flip animation */
          <div style={{ perspective: '1200px' }} className="w-full">
            <motion.div
              initial={shouldReduceMotion ? false : { rotateY: 0 }}
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { rotateY: isFlipped ? 180 : 0 }
              }
              transition={{
                duration: shouldReduceMotion ? 0.2 : 0.48,
                ease: [0.25, 1, 0.5, 1],
              }}
              style={{ transformStyle: 'preserve-3d' }}
              className="w-full relative min-h-0"
            >
              {/* FRONT FACE (Visible during flip, hidden when turned) */}
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
                className={`absolute inset-0 w-full h-full rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex flex-col items-center justify-center p-6 text-center space-y-3 z-10 ${isFlipped ? 'pointer-events-none' : ''
                  }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--accent)]">
                  {activeMember.role === 'Leader' ? (
                    <Crown className="w-7 h-7" />
                  ) : (
                    <UserIcon className="w-7 h-7" />
                  )}
                </div>
                <span className="font-mono text-xs font-bold tracking-widest text-[var(--accent)]">
                  CARD {activeMember.slotNumber}
                </span>
                <h3 className="font-mono text-lg font-bold text-[var(--text-primary)] uppercase">
                  {activeMember.slotTitle}
                </h3>
              </div>

              {/* BACK FACE: EXPANDED MEMBER REGISTRATION FORM (In-flow relative element) */}
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
                className="relative w-full rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-2xl p-6 sm:p-7 text-left space-y-6"
              >
                {renderMemberFormContent()}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // INITIAL VIEW: COMPACT STACKED DECK OF CARDS
  // -------------------------------------------------------------
  return (
    <div className="w-full space-y-6 select-none">
      {/* 1. Deck Heading & Subtitle */}
      <div className="text-center space-y-1.5 max-w-lg mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[var(--text-primary)]">
          Build Your Team
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
          Select a card to add a teammate.
        </p>

        {/* Team Name Inline Bar */}
        <div className="pt-1 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl font-mono text-xs text-[var(--text-secondary)]">
            <span className="font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              TEAM:
            </span>
            {isEditingTeamName ? (
              <input
                type="text"
                value={teamName}
                autoFocus
                onBlur={() => setIsEditingTeamName(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingTeamName(false)}
                onChange={(e) => setTeamName(e.target.value)}
                className="bg-transparent border-b border-[var(--accent)] text-[var(--accent)] font-bold focus:outline-none w-36 text-center"
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingTeamName(true)}
                className="font-bold text-[var(--accent)] hover:underline inline-flex items-center gap-1 cursor-pointer"
                title="Click to rename team"
              >
                <span>{teamName}</span>
                <Edit2 className="w-3 h-3 text-[var(--text-secondary)] hover:text-[var(--accent)]" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Dots Indicator */}
        <div className="flex items-center justify-center gap-2.5 pt-1">
          <div className="flex items-center gap-1.5">
            {members.map((m) => (
              <span
                key={m.id}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${m.isCompleted
                    ? 'bg-[var(--accent)] shadow-[0_0_8px_rgba(var(--accent-rgb),0.6)] scale-110'
                    : 'bg-[var(--border-color)]'
                  }`}
                title={`${m.slotTitle} (${m.isRequired ? 'Required' : 'Optional'}): ${m.isCompleted ? 'Completed' : 'Pending'
                  }`}
              />
            ))}
          </div>
          <span className="font-mono text-xs font-semibold text-[var(--text-secondary)]">
            {completedCount} / 4 Members Ready
            {completedCount < 2 ? ' (Min 2 Required)' : ''}
          </span>
        </div>
      </div>

      {/* 2. Interactive Stacked Deck View */}
      {/* Container provides comfortable spacing without squeezing */}
      <div className="w-full py-4 flex flex-col items-center justify-center">
        {/* Desktop & Tablet Stacked Deck (Overlapping Layered Deck) */}
        <div className="hidden sm:flex items-center justify-center -space-x-12 md:-space-x-16 hover:-space-x-8 transition-all duration-300 py-6 px-4">
          {members.map((member, index) => {
            const isCompleted = member.isCompleted;
            const isNext = index === nextRequiredIndex;
            const zIndex = 10 + index * 5;

            return (
              <motion.button
                key={member.id}
                ref={(el) => {
                  cardRefs.current[member.id] = el;
                }}
                type="button"
                onClick={() => handleOpenCard(member)}
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                      y: -24,
                      scale: 1.04,
                      zIndex: 60,
                      transition: { duration: 0.2 },
                    }
                }
                whileTap={{ scale: 0.98 }}
                style={{ zIndex }}
                aria-label={`Card ${member.slotNumber}: ${member.slotTitle}. ${isCompleted ? `Completed - ${member.name}` : member.isRequired ? 'Required' : 'Optional'
                  }`}
                className={`group relative w-56 md:w-64 h-80 rounded-2xl p-5 flex flex-col justify-between text-left cursor-pointer transition-all duration-300 outline-none focus:ring-2 focus:ring-[var(--accent)] shadow-xl ${isCompleted
                    ? 'bg-[var(--bg-surface)] border-2 border-[var(--accent)]/80 shadow-[0_10px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                    : isNext
                      ? 'bg-[var(--bg-surface)] border-2 border-[var(--accent)] shadow-[0_0_20px_rgba(var(--accent-rgb),0.25)] ring-1 ring-[var(--accent)]/40'
                      : 'bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--accent)]/60'
                  }`}
              >
                {/* Top Card Badge / Meta */}
                <div className="flex items-center justify-between border-b border-[var(--border-color)]/70 pb-2.5">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold">
                    <span className="text-[var(--accent)]">{member.slotNumber}</span>
                    <span className="text-[var(--text-secondary)]">·</span>
                    <span className="text-[var(--text-secondary)] text-[10px]">
                      {member.role === 'Leader' ? 'LEADER' : member.isRequired ? 'REQUIRED' : 'OPTIONAL'}
                    </span>
                  </div>

                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[var(--accent)]">
                      <Check className="w-3 h-3 text-[var(--accent)]" />
                      DONE
                    </span>
                  ) : isNext ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-black uppercase tracking-wider bg-[var(--accent)] text-[var(--accent-text)] animate-pulse">
                      NEXT
                    </span>
                  ) : null}
                </div>

                {/* Card Artwork / Center Content */}
                <div className="my-auto py-2 space-y-2.5 text-center">
                  <div
                    className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center border transition-all ${isCompleted
                        ? 'bg-[var(--accent-muted)] border-[var(--accent)]/40 text-[var(--accent)]'
                        : isNext
                          ? 'bg-[var(--bg-secondary)] border-[var(--accent)] text-[var(--accent)]'
                          : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] group-hover:border-[var(--border-color)]'
                      }`}
                  >
                    {member.role === 'Leader' ? (
                      <Crown className="w-7 h-7" />
                    ) : isCompleted ? (
                      <ShieldCheck className="w-7 h-7" />
                    ) : (
                      <UserIcon className="w-7 h-7" />
                    )}
                  </div>

                  {isCompleted ? (
                    <div className="space-y-0.5 px-1">
                      <h4 className="font-mono text-sm font-bold text-[var(--text-primary)] truncate">
                        {member.name}
                      </h4>
                      <p className="text-[10px] font-mono text-[var(--text-secondary)] truncate">
                        {member.department}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      <span className="block font-mono text-xs font-bold text-[var(--text-primary)]">
                        {member.slotTitle}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-secondary)] block">
                        {member.isRequired ? 'Required slot' : 'Optional slot'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Status / Action Prompt */}
                <div className="pt-2.5 border-t border-[var(--border-color)]/70 flex items-center justify-between text-[11px] font-mono">
                  {isCompleted ? (
                    <>
                      <span className="text-[10px] text-[var(--accent)] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[var(--accent)]" /> Completed
                      </span>
                      <span className="text-[10px] text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">
                        Edit →
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] text-[var(--text-secondary)]">
                        {member.isRequired ? 'Must be added' : 'Can leave empty'}
                      </span>
                      <span className="text-[10px] text-[var(--accent)] font-bold">
                        Add +
                      </span>
                    </>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Mobile View: Clean Touch Cards Grid (Prevents any horizontal overflow) */}
        <div className="sm:hidden w-full grid grid-cols-2 gap-3 px-1">
          {members.map((member, index) => {
            const isCompleted = member.isCompleted;
            const isNext = index === nextRequiredIndex;

            return (
              <button
                key={member.id}
                type="button"
                onClick={() => handleOpenCard(member)}
                className={`relative w-full aspect-[3/4.2] rounded-2xl p-3.5 flex flex-col justify-between text-left cursor-pointer transition-all outline-none focus:ring-2 focus:ring-[var(--accent)] ${isCompleted
                    ? 'bg-[var(--bg-surface)] border-2 border-[var(--accent)] shadow-md'
                    : isNext
                      ? 'bg-[var(--bg-surface)] border-2 border-[var(--accent)] ring-1 ring-[var(--accent)]/50'
                      : 'bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--accent)]/60'
                  }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="text-[var(--accent)] font-bold">{member.slotNumber}</span>
                  <span className="text-[var(--text-secondary)] text-[9px]">
                    {member.role === 'Leader' ? 'LEADER' : member.isRequired ? 'REQ' : 'OPT'}
                  </span>
                </div>

                <div className="my-auto text-center space-y-1.5 py-1">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--accent)]">
                    {member.role === 'Leader' ? (
                      <Crown className="w-5 h-5" />
                    ) : isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <UserIcon className="w-5 h-5" />
                    )}
                  </div>
                  <h4 className="font-mono text-xs font-bold text-[var(--text-primary)] truncate">
                    {isCompleted ? member.name : member.slotTitle}
                  </h4>
                </div>

                <div className="pt-1.5 border-t border-[var(--border-color)] text-[10px] font-mono text-center">
                  <span className={isCompleted ? 'text-[var(--accent)] font-bold' : 'text-[var(--text-secondary)]'}>
                    {isCompleted ? '✓ Completed' : '+ Add Info'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Review Team / Submission CTA */}
      <div className="pt-2 flex flex-col items-center justify-center space-y-2">
        <button
          type="button"
          disabled={!requiredValid}
          onClick={() => setShowReview(true)}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px] ${requiredValid
              ? 'bg-[var(--accent)] text-[var(--accent-text)] shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] hover:shadow-[0_0_28px_rgba(var(--accent-rgb),0.45)] hover:scale-[1.01]'
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]/50 border border-[var(--border-color)] cursor-not-allowed'
            }`}
        >
          <span>Review Team ({completedCount} / 4 Members Ready)</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {!requiredValid && (
          <p className="text-[11px] font-mono text-[var(--text-secondary)] text-center">
            Complete Card 02 (required teammate) to unlock team review.
          </p>
        )}
      </div>
    </div>
  );
};
