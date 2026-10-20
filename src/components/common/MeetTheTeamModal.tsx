import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  X,
  Code2,
  Server,
  Sparkles,
  Users,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { DEV_TEAM_MEMBERS, DevTeamMember } from '../../data/devTeam';
import { useSmoothScroll } from '../../context/SmoothScrollContext';
import { soundModalClose, soundTap } from '../../lib/sound';

interface MeetTheTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CategoryTab = 'all' | 'frontend' | 'backend' | 'coordinator';

export const MeetTheTeamModal: React.FC<MeetTheTeamModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<CategoryTab>('all');
  const modalRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { stop, start } = useSmoothScroll();

  const handleClose = () => {
    soundModalClose();
    onClose();
  };

  // Lock scroll and handle escape key
  useEffect(() => {
    if (!isOpen) return;

    stop();
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    modalRef.current?.focus();

    return () => {
      start();
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const filteredMembers = DEV_TEAM_MEMBERS.filter((member) => {
    if (activeTab === 'all') return true;
    return member.category === activeTab;
  });

  const getCategoryBadge = (category: DevTeamMember['category']) => {
    switch (category) {
      case 'frontend':
        return {
          label: 'Frontend Engineering',
          color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: <Code2 className="w-3 h-3" />,
          glow: 'from-emerald-500/20 to-teal-500/10',
        };
      case 'backend':
        return {
          label: 'Backend & Systems',
          color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
          icon: <Server className="w-3 h-3" />,
          glow: 'from-cyan-500/20 to-blue-500/10',
        };
      case 'coordinator':
        return {
          label: 'Coordination & Design',
          color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: <Sparkles className="w-3 h-3" />,
          glow: 'from-amber-500/20 to-orange-500/10',
        };
    }
  };

  const tabs: { id: CategoryTab; label: string; count: number }[] = [
    { id: 'all', label: 'All Builders', count: DEV_TEAM_MEMBERS.length },
    {
      id: 'frontend',
      label: 'Frontend',
      count: DEV_TEAM_MEMBERS.filter((m) => m.category === 'frontend').length,
    },
    {
      id: 'backend',
      label: 'Backend',
      count: DEV_TEAM_MEMBERS.filter((m) => m.category === 'backend').length,
    },
    {
      id: 'coordinator',
      label: 'Coordinators',
      count: DEV_TEAM_MEMBERS.filter((m) => m.category === 'coordinator').length,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="meet-team-title"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden z-10 my-auto max-h-[90vh] flex flex-col focus:outline-hidden"
          >
            {/* Header Circuit Banner */}
            <div className="relative px-5 py-5 sm:px-7 sm:py-6 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/60 shrink-0">
              {/* Subtle Ambient Radial Glow */}
              <div
                className="absolute inset-0 pointer-events-none opacity-25"
                style={{
                  background:
                    'radial-gradient(ellipse at top center, var(--accent) 0%, transparent 70%)',
                }}
              />

              <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[var(--accent-muted)] border border-[var(--accent)]/40 text-[10px] font-mono font-bold text-[var(--accent)] uppercase tracking-widest shadow-xs">
                    <Layers className="w-3 h-3 text-[var(--accent)]" />
                    <span>Compute 50 Engineering Core</span>
                  </div>
                  <h2
                    id="meet-team-title"
                    className="text-xl sm:text-2xl font-black font-mono tracking-tight text-[var(--text-primary)]"
                  >
                    Meet The Platform Creators
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)]">
                    The student developers, systems architects, and coordinators who engineered this
                    platform for CSEA, PSG College of Technology.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer shadow-xs shrink-0"
                  aria-label="Close Team Modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2 pt-4 relative z-10">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        soundTap();
                        setActiveTab(tab.id);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[var(--accent)] text-zinc-950 shadow-[0_0_12px_rgba(var(--accent-rgb),0.35)]'
                          : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)] hover:border-[var(--border-color)]/80'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive
                            ? 'bg-zinc-950/20 text-zinc-950'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable Members Grid */}
            <div className="p-5 sm:p-7 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMembers.map((member) => {
                  const categoryInfo = getCategoryBadge(member.category);
                  const initials = member.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();

                  return (
                    <div
                      key={member.id}
                      className="group p-4 sm:p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent)]/60 transition-all shadow-xs relative overflow-hidden flex flex-col justify-between space-y-4"
                    >
                      {/* Top Category Badge & Avatar */}
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryInfo.glow} border border-[var(--border-color)] group-hover:border-[var(--accent)]/50 flex items-center justify-center font-mono font-black text-sm text-[var(--accent)] shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-inner`}
                        >
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          ) : (
                            <span>{initials}</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold border uppercase tracking-wider ${categoryInfo.color}`}
                            >
                              {categoryInfo.icon}
                              <span>{categoryInfo.label}</span>
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-[var(--text-primary)] font-mono truncate group-hover:text-[var(--accent)] transition-colors">
                            {member.name}
                          </h3>
                          <p className="text-xs text-[var(--text-secondary)] line-clamp-1">
                            {member.role}
                          </p>
                        </div>
                      </div>

                      {/* Contribution Skill Badges */}
                      <div className="flex flex-wrap gap-1.5">
                        {member.contributions.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-color)] text-[10px] font-mono text-[var(--text-secondary)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Social & Contact Links */}
                      <div className="pt-2 border-t border-[var(--border-color)]/60 flex items-center justify-between text-xs font-mono">
                        <span className="text-[10px] text-[var(--text-secondary)]">
                          PSG Tech · CSEA
                        </span>

                        <div className="flex items-center gap-2">
                          {member.githubUrl && (
                            <a
                              href={member.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                              aria-label={`${member.name} GitHub`}
                            >
                              <span>GitHub</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                          {member.linkedinUrl && (
                            <a
                              href={member.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors cursor-pointer ml-2"
                              aria-label={`${member.name} LinkedIn`}
                            >
                              <span>LinkedIn</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Footer Note */}
            <div className="px-5 py-3.5 sm:px-7 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/80 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[var(--text-secondary)] gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Crafted with pride by CSEA Student Developers</span>
              </div>
              <span>Compute 50 Platform Edition 1.0</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MeetTheTeamModal;
