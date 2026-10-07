import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Card } from '../common/Card';
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
      const activeMembers = members.filter((m) => m.isRevealed && m.name.trim().length > 0);

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
    <Card className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold font-mono text-[var(--text-primary)]">
          Hackathon Team Registration
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
          Tap each card below to reveal and configure your team members for Compute 50 National Innovation Challenge.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs font-medium text-red-600 dark:text-red-400 text-center">
          {error}
        </div>
      )}

      {/* 4 Interactive Team Reveal Cards */}
      <div className="pt-2">
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
      </div>

      <p className="text-xs text-[var(--text-secondary)] text-center pt-2 border-t border-[var(--border-color)]">
        Already registered?{' '}
        <Link to="/login" className="text-lime-800 dark:text-[var(--accent)] hover:underline font-bold">
          Login here
        </Link>
      </p>
    </Card>
  );
};
