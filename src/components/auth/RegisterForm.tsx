import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { PlusCircle, UserPlus, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { CreateTeamForm } from './CreateTeamForm';
import { JoinTeamForm } from './JoinTeamForm';

/* =========================================================================
 * STASHED REGISTRATION CARD (PRESERVED FOR FUTURE REFERENCE)
 * The 4-member deck of cards (TeamRevealCards) is stashed in favor of the
 * distributed "Create Team" and "Join Team" self-service architecture.
 * =========================================================================
 * import { TeamRevealCards, MemberData } from '../hackathon/TeamRevealCards';
 */

export const RegisterForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlMode = searchParams.get('mode');
  const [mode, setMode] = useState<'create' | 'join' | null>(
    urlMode === 'create' ? 'create' : urlMode === 'join' ? 'join' : null
  );
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* INITIAL SELECTION SCREEN: Only ask Create Team vs Join Team */}
      {mode === null ? (
        <div className="max-w-2xl mx-auto space-y-6 pt-2 pb-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-[var(--accent-muted)] text-[var(--accent)] border border-[var(--accent)]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Squad Enrollment</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
              Choose Registration Path
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
              Are you creating a new squad as a team leader, or joining an existing squad with a Team ID?
            </p>
          </div>

          {/* Symmetrical Choice Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Option 1: Create Team */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode('create')}
              className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[var(--bg-surface)] hover:bg-[var(--accent-muted)]/15 border-2 border-[var(--border-color)] hover:border-[var(--accent)] text-left transition-all duration-200 shadow-sm hover:shadow-lg cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] group-hover:scale-110 transition-transform">
                    <PlusCircle className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-[var(--accent)] text-zinc-950 font-black">
                    Leader
                  </span>
                </div>
                <h3 className="text-lg font-mono font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                  Create Team
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
                  Start a new squad, choose your track, and generate an 8-character Team ID to invite teammates.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-color)]/70 flex items-center justify-between text-xs font-mono font-bold text-[var(--accent)]">
                <span>Start as Leader</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.button>

            {/* Option 2: Join Team */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode('join')}
              className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[var(--bg-surface)] hover:bg-[var(--accent-muted)]/15 border-2 border-[var(--border-color)] hover:border-[var(--accent)] text-left transition-all duration-200 shadow-sm hover:shadow-lg cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] group-hover:scale-110 transition-transform">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] font-semibold">
                    Member
                  </span>
                </div>
                <h3 className="text-lg font-mono font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                  Join Team
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
                  Already have a squad? Enter the unique 8-character Team ID shared by your team leader.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-color)]/70 flex items-center justify-between text-xs font-mono font-bold text-[var(--accent)]">
                <span>Enter Team ID</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.button>
          </div>
        </div>
      ) : (
        /* FORM VIEW: When either Create Team or Join Team is selected */
        <div className="space-y-6">
          {/* Top navigation row: Back button & Mode Switcher */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setMode(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-mono font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all cursor-pointer shadow-xs self-start sm:self-center"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Selection</span>
            </button>

            {/* Mode Switcher: Create Team vs Join Team */}
            <div className="inline-flex p-1.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-inner max-w-xs w-full">
              <button
                type="button"
                onClick={() => setMode('create')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'create'
                    ? 'bg-[var(--accent)] text-[var(--bg-main)] shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create Team</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('join')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'join'
                    ? 'bg-[var(--accent)] text-[var(--bg-main)] shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Join Team</span>
              </button>
            </div>
          </div>

          {/* Dynamic View: Create Team vs Join Team */}
          {mode === 'create' ? (
            <CreateTeamForm onSuccess={() => navigate('/profile')} />
          ) : (
            <div className="max-w-2xl mx-auto">
              <JoinTeamForm onSuccess={() => navigate('/profile')} />
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
       * STASHED REGISTRATION CARDS (Uncomment if full simultaneous 4-card deck is needed)
       * =====================================================================
       * <div className="mt-8 opacity-50 pointer-events-none hidden">
       *   <TeamRevealCards
       *     currentUser={user}
       *     onSubmitTeam={handleTeamSubmit}
       *     isLoading={loading}
       *   />
       * </div>
       * ===================================================================== */}

      <p className="text-xs text-[var(--text-secondary)] text-center pt-6 border-t border-[var(--border-color)]">
        Need to update an existing submission or view team status?{' '}
        <Link to="/profile" className="text-[var(--accent)] hover:text-[var(--accent-hover)] hover:underline font-bold">
          View Profile & Squad Status
        </Link>{' '}
        or contact CSEA Helpdesk.
      </p>
    </div>
  );
};

export default RegisterForm;
