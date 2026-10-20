import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Key, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { userService } from '../../services/user.service';
import { useToast } from '../../hooks/useToast';
import { soundSuccess, soundWarning } from '../../lib/sound';
import confetti from 'canvas-confetti';

interface JoinTeamFormProps {
  onSuccess?: () => void;
}

const YEAR_OPTIONS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  'Postgraduate (M.E. / M.Tech / MCA)',
];

export const JoinTeamForm: React.FC<JoinTeamFormProps> = ({ onSuccess }) => {
  const [teamCode, setTeamCode] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: 'PSG College of Technology',
    department: 'Computer Science and Engineering',
    year: '3rd Year',
    rollNumber: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamCode(e.target.value.toUpperCase());
    if (error) setError('');
  };

  const fireCelebration = () => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanCode = teamCode.trim();
    if (!cleanCode) {
      setError('Please enter a valid Team ID.');
      return;
    }

    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid college email address.');
      return;
    }

    if (!formData.phone.trim() || formData.phone.length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    if (!formData.rollNumber.trim()) {
      setError('Please enter your roll / registration number.');
      return;
    }

    setLoading(true);
    try {
      const updatedTeam = await userService.joinTeam(cleanCode, formData);
      fireCelebration();
      soundSuccess();
      addToast(`🎉 Successfully joined team "${updatedTeam.name}"!`, 'success');

      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/profile');
        }
      }, 900);
    } catch (err: unknown) {
      soundWarning();
      const message = err instanceof Error ? err.message : 'Failed to join team. Please verify the Team ID.';
      setError(message);
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* WhatsApp Message Callout */}
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-start gap-3 text-emerald-700 dark:text-emerald-300">
        <WhatsAppIcon className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm leading-relaxed">
          <p className="font-semibold text-emerald-800 dark:text-emerald-200">
            Hackathon Communications
          </p>
          <p className="mt-0.5">
            The WhatsApp group invitation link will be sent directly to the team leader for hackathon participation.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: Team ID */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
          <Key className="w-4 h-4" />
          <span>Enter Team ID</span>
        </div>
        <p className="text-xs text-[var(--text-secondary)]">
          Ask your team leader for the 8-character code generated when they created your squad (e.g.,{' '}
          <span className="font-mono font-bold text-[var(--text-primary)]">C50-TEAM-8942</span> or{' '}
          <span className="font-mono font-bold text-[var(--text-primary)]">C50-XXXX</span>).
        </p>

        <div>
          <label htmlFor="teamCode" className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
            Unique Team ID *
          </label>
          <div className="relative">
            <input
              id="teamCode"
              name="teamCode"
              type="text"
              required
              value={teamCode}
              onChange={handleCodeChange}
              placeholder="e.g. C50-8942"
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-[var(--accent)] rounded-xl py-3 px-4 text-sm font-mono tracking-wider font-bold text-[var(--text-primary)] focus:outline-hidden transition-colors"
            />
            {teamCode.trim().length >= 4 && (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step 2: Member Details */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
          <UserCheck className="w-4 h-4" />
          <span>Your Member Details</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block uppercase tracking-wider text-[var(--text-secondary)] font-bold mb-1.5">
              Full Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-[var(--accent)] rounded-xl py-2.5 px-3 text-xs text-[var(--text-primary)] focus:outline-hidden transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block uppercase tracking-wider text-[var(--text-secondary)] font-bold mb-1.5">
              College Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. 21mx101@psgtech.ac.in"
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-[var(--accent)] rounded-xl py-2.5 px-3 text-xs text-[var(--text-primary)] focus:outline-hidden transition-colors"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block uppercase tracking-wider text-[var(--text-secondary)] font-bold mb-1.5">
              Phone Number *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +91 9876543210"
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-[var(--accent)] rounded-xl py-2.5 px-3 text-xs text-[var(--text-primary)] focus:outline-hidden transition-colors"
            />
          </div>

          {/* Roll Number */}
          <div>
            <label htmlFor="rollNumber" className="block uppercase tracking-wider text-[var(--text-secondary)] font-bold mb-1.5">
              Roll / Registration Number *
            </label>
            <input
              id="rollNumber"
              name="rollNumber"
              type="text"
              required
              value={formData.rollNumber}
              onChange={handleChange}
              placeholder="e.g. 21MX102"
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-[var(--accent)] rounded-xl py-2.5 px-3 text-xs text-[var(--text-primary)] focus:outline-hidden transition-colors"
            />
          </div>

          {/* College */}
          <div>
            <label htmlFor="college" className="block uppercase tracking-wider text-[var(--text-secondary)] font-bold mb-1.5">
              College Name *
            </label>
            <input
              id="college"
              name="college"
              type="text"
              required
              value={formData.college}
              onChange={handleChange}
              placeholder="PSG College of Technology"
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-[var(--accent)] rounded-xl py-2.5 px-3 text-xs text-[var(--text-primary)] focus:outline-hidden transition-colors"
            />
          </div>

          {/* Department */}
          <div>
            <label htmlFor="department" className="block uppercase tracking-wider text-[var(--text-secondary)] font-bold mb-1.5">
              Department *
            </label>
            <input
              id="department"
              name="department"
              type="text"
              required
              value={formData.department}
              onChange={handleChange}
              placeholder="Computer Science & Engineering"
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-[var(--accent)] rounded-xl py-2.5 px-3 text-xs text-[var(--text-primary)] focus:outline-hidden transition-colors"
            />
          </div>

          {/* Year of Study */}
          <div className="sm:col-span-2">
            <label htmlFor="year" className="block uppercase tracking-wider text-[var(--text-secondary)] font-bold mb-1.5">
              Year of Study *
            </label>
            <select
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-[var(--accent)] rounded-xl py-2.5 px-3 text-xs text-[var(--text-primary)] focus:outline-hidden transition-colors cursor-pointer"
            >
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Submit Action */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 px-6 bg-[var(--accent)] hover:brightness-110 text-[var(--bg-main)] font-mono font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        <span>{loading ? 'Verifying & Joining Team...' : 'Verify & Join Team'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
};
