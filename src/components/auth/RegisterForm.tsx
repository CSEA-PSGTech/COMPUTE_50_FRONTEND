import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Building, BookOpen, Calendar, Lock, UserPlus, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { PasswordStrength } from './PasswordStrength';
import { TeamRevealCards, MemberData } from '../hackathon/TeamRevealCards';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { GoogleIcon } from '../common/GoogleIcon';

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    department: '',
    year: '3rd Year',
    rollNumber: '',
    password: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { register, user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Mode: 'account' (step 1 account creation) or 'team' (4 reveal cards)
  const [activeTab, setActiveTab] = useState<'account' | 'team'>('account');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateAccountForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.college.trim()) errors.college = 'College or Institution is required';
    if (!formData.department.trim()) errors.department = 'Department is required';
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

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

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateAccountForm()) {
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        college: formData.college,
        department: formData.department,
        year: formData.year,
        rollNumber: formData.rollNumber,
        password: formData.password,
      });

      addToast('Leader account created! Now assemble your team.', 'info');
      setActiveTab('team');
    } catch {
      setError('Registration failed. Please check form fields.');
      addToast('Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTeamSubmit = async (members: MemberData[]) => {
    setLoading(true);
    setError('');

    try {
      // Filter revealed and valid members
      const activeMembers = members.filter((m) => m.isRevealed && m.name.trim().length > 0);

      // Simulate sending team payload
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

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      await register({
        name: 'Google Participant',
        email: 'google.student@psgtech.ac.in',
        phone: '+91 9876543210',
        college: 'PSG College of Technology',
        department: 'CSE',
        year: '3rd Year',
        rollNumber: '21MX101',
      });
      addToast('🎉 Leader account registered via Google! Complete team reveal.', 'info');
      setActiveTab('team');
    } catch {
      addToast('Google sign-up failed. Please try again.', 'error');
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
          Create your leader profile and reveal your team members for Compute 50 National Innovation Challenge.
        </p>

        {/* Tab Toggle */}
        <div className="inline-flex p-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl mt-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('account')}
            className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'account'
                ? 'bg-[var(--accent)] text-slate-950 shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            1. Leader Account
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('team')}
            className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'team'
                ? 'bg-[var(--accent)] text-slate-950 shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            2. Team Reveal Cards (4 Members)
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs font-medium text-red-600 dark:text-red-400 text-center">
          {error}
        </div>
      )}

      {activeTab === 'account' ? (
        <form onSubmit={handleAccountSubmit} className="space-y-4 max-w-lg mx-auto">
          <Input
            label="Full Name"
            name="name"
            placeholder="e.g. Alex Rivera"
            value={formData.name}
            onChange={handleChange}
            error={fieldErrors.name}
            leftIcon={<User className="w-4 h-4" />}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="student@college.edu"
              value={formData.email}
              onChange={handleChange}
              error={fieldErrors.email}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={handleChange}
              error={fieldErrors.phone}
              leftIcon={<Phone className="w-4 h-4" />}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="College / Institution"
              name="college"
              placeholder="PSG College of Technology"
              value={formData.college}
              onChange={handleChange}
              error={fieldErrors.college}
              leftIcon={<Building className="w-4 h-4" />}
              required
            />

            <Input
              label="Roll Number / Student ID"
              name="rollNumber"
              placeholder="e.g. 21MX101"
              value={formData.rollNumber}
              onChange={handleChange}
              error={fieldErrors.rollNumber}
              leftIcon={<FileText className="w-4 h-4" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Department"
              name="department"
              placeholder="e.g. Computer Science"
              value={formData.department}
              onChange={handleChange}
              error={fieldErrors.department}
              leftIcon={<BookOpen className="w-4 h-4" />}
              required
            />

            <div className="space-y-1.5 text-left">
              <label className="block text-sm font-medium text-[var(--text-primary)]">Year of Study</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 dark:text-zinc-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="block w-full rounded-lg bg-[var(--bg-surface)] border border-zinc-300 dark:border-[var(--border-color)] text-[var(--text-primary)] text-sm pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] cursor-pointer transition-colors"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={fieldErrors.password}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />
            <PasswordStrength password={formData.password} />
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={loading}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Create Leader Account & Continue
          </Button>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border-color)]" />
            </div>
            <span className="relative bg-[var(--bg-surface)] px-3 text-xs text-[var(--text-secondary)]">OR</span>
          </div>

          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={handleGoogleSignup}
            disabled={loading}
            leftIcon={<GoogleIcon className="w-4 h-4" />}
          >
            Sign up with Google
          </Button>
        </form>
      ) : (
        <div className="pt-2">
          <TeamRevealCards
            currentUser={
              user || {
                id: 'usr_leader',
                name: formData.name || 'Alex Rivera',
                email: formData.email || 'alex.rivera@psgtech.ac.in',
                phone: formData.phone || '+91 9876543210',
                college: formData.college || 'PSG College of Technology',
                department: formData.department || 'CSE',
                year: formData.year || '3rd Year',
                rollNumber: formData.rollNumber || '21MX101',
              }
            }
            onSubmitTeam={handleTeamSubmit}
            isLoading={loading}
          />
        </div>
      )}

      <p className="text-xs text-[var(--text-secondary)] text-center pt-2 border-t border-[var(--border-color)]">
        Already registered?{' '}
        <Link to="/login" className="text-lime-800 dark:text-[var(--accent)] hover:underline font-bold">
          Login here
        </Link>
      </p>
    </Card>
  );
};

