import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const RegistrationDeadlineAlert: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="w-full max-w-xl sm:max-w-2xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl border-2 border-rose-500/40 bg-gradient-to-r from-rose-500/10 via-[var(--bg-surface)] to-amber-500/10 p-4 sm:p-5 shadow-md">
        {/* Subtle pulsing background highlight */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 shrink-0 mt-0.5">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500 text-white font-mono text-[10px] font-black uppercase tracking-wider">
                  <AlertTriangle className="w-3 h-3" />
                  Urgent Cutoff
                </span>
                <span className="font-mono text-xs font-bold text-rose-500 dark:text-rose-400 uppercase tracking-wide">
                  Registration Closes Soon
                </span>
              </div>

              <p className="text-sm sm:text-[15px] font-bold text-[var(--text-primary)] leading-snug">
                Portal closes on <span className="text-rose-500 underline underline-offset-2">Nov 22 at 4:30 PM</span>.
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                Complete your registration and ₹150 fee payment to participate in Round 1 (Online, Nov 23–25).
              </p>
            </div>
          </div>

          <div className="shrink-0 self-stretch sm:self-auto flex items-center justify-end">
            <Link
              to={isAuthenticated ? '/profile' : '/register'}
              className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow-rose-600/30 group"
            >
              <span>{isAuthenticated ? 'View Profile' : 'Register Soon'}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
