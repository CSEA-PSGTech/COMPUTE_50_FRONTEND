import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { TeamRevealCards, MemberData } from '../hackathon/TeamRevealCards';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

export const RegisterForm: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const fireConfetti = () => {
    const defaults = {
      spread: 360,
      ticks: 90,
      gravity: 0.8,
      decay: 0.92,
      startVelocity: 28,
      colors: ['#B6FF00', '#C8FF33', '#65A30D', '#22c55e', '#fbbf24', '#f97316'],
    };

    confetti({ ...defaults, particleCount: 50, origin: { x: 0.3, y: 0.6 } });
    confetti({ ...defaults, particleCount: 50, origin: { x: 0.7, y: 0.6 } });

    setTimeout(() => {
      confetti({ ...defaults, particleCount: 40, origin: { x: 0.5, y: 0.4 }, startVelocity: 35 });
    }, 200);
  };

  const handleTeamSubmit = async (members: MemberData[]) => {
    setLoading(true);
    setError('');

    try {
      const activeMembers = members.filter((m) => m.isCompleted && m.name.trim().length > 0);

      // Simulate sending team registration request
      await new Promise((resolve) => setTimeout(resolve, 600));

      fireConfetti();
      addToast(`🎉 Hackathon Team Registered successfully with ${activeMembers.length} members!`, 'success');
      setTimeout(() => navigate('/profile'), 1200);
    } catch {
      setError('Team registration submission failed. Please try again.');
      addToast('Submission failed. Your entered data is preserved.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs font-medium text-red-600 dark:text-red-400 text-center">
          {error}
        </div>
      )}

      {/* Interactive Deck of Cards Registration */}
      <TeamRevealCards
        currentUser={
          user || {
            id: 'usr_leader',
            name: 'Alex Rivera',
            email: 'alex.rivera@psgtech.ac.in',
            phone: '+91 9876543210',
            college: 'PSG College of Technology',
            department: 'Computer Science & Engineering',
            year: '3rd Year',
            rollNumber: '21MX101',
          }
        }
        onSubmitTeam={handleTeamSubmit}
        isLoading={loading}
      />

      <p className="text-xs text-[var(--text-secondary)] text-center pt-6 border-t border-[var(--border-color)]">
        Need to update an existing submission or have questions?{' '}
        <Link to="/profile" className="text-[var(--accent)] hover:text-[var(--accent-hover)] hover:underline font-bold">
          View Profile
        </Link>{' '}
        or contact CSEA Helpdesk.
      </p>
    </div>
  );
};
