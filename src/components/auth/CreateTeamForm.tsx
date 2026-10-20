import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Key,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { soundSuccess, soundWarning } from '../../lib/sound';
import { userService } from '../../services/user.service';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import confetti from 'canvas-confetti';

interface CreateTeamFormProps {
  onSuccess?: () => void;
}

const YEAR_OPTIONS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  'Postgraduate (M.E. / M.Tech / MCA)',
];

export const CreateTeamForm: React.FC<CreateTeamFormProps> = ({ onSuccess }) => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    teamName: '',
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    college: user?.college || 'PSG College of Technology',
    department: user?.department || 'Computer Science and Engineering',
    year: user?.year || '3rd Year',
    rollNumber: user?.rollNumber || '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [createdTeam, setCreatedTeam] = useState<{ name: string; code: string } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleCopyCode = () => {
    if (createdTeam?.code) {
      navigator.clipboard.writeText(createdTeam.code);
      setCopied(true);
      addToast(`Team ID ${createdTeam.code} copied! Share it with your squad.`, 'info');
      setTimeout(() => setCopied(false), 2000);
    }
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
    setTimeout(() => {
      confetti({ ...defaults, particleCount: 40, origin: { x: 0.5, y: 0.4 }, startVelocity: 35 });
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.teamName.trim()) {
      setError('Please enter a team name.');
      return;
    }

    if (!formData.name.trim()) {
      setError('Please enter team leader full name.');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!formData.phone.trim() || formData.phone.length < 10) {
      setError('Please enter a valid 10-digit WhatsApp phone number.');
      return;
    }

    if (!formData.rollNumber.trim()) {
      setError('Please enter your roll / registration number.');
      return;
    }

    setLoading(true);

    try {
      const leaderPayload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        college: formData.college.trim(),
        department: formData.department.trim(),
        year: formData.year,
        rollNumber: formData.rollNumber.trim(),
        role: 'leader' as const,
      };

      const newTeam = await userService.createTeam(formData.teamName.trim(), leaderPayload);

      if (user) {
        updateUser({
          ...user,
          ...leaderPayload,
          teamId: newTeam.id,
        });
      }

      fireCelebration();
      soundSuccess();
      setCreatedTeam({ name: newTeam.name, code: newTeam.code });
      addToast(`🎉 Team "${newTeam.name}" created successfully with ID ${newTeam.code}!`, 'success');
    } catch {
      soundWarning();
      setError('Failed to create team. Please try again.');
      addToast('Team creation failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS VIEW: Shown after team is created
  if (createdTeam) {
    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 shadow-xl max-w-xl mx-auto space-y-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-[var(--accent)] uppercase">
            SQUAD REGISTRATION SUCCESSFUL
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] mt-1">
            {createdTeam.name}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Your team has been established. Share the Team ID below with teammates so they can join.
          </p>
        </div>

        {/* Team ID Highlight Card */}
        <div className="p-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left">
            <span className="text-[11px] font-mono text-[var(--text-secondary)] uppercase font-semibold">
              Your Squad Join Code
            </span>
            <p className="text-lg sm:text-xl font-mono font-black text-[var(--accent)] tracking-wider">
              {createdTeam.code}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyCode}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--bg-main)] font-mono text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied ID!' : 'Copy Team ID'}</span>
          </button>
        </div>

        {/* WhatsApp Group Invitation Notice */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-start gap-3.5 text-left text-emerald-700 dark:text-emerald-300">
          <WhatsAppIcon className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-mono font-bold tracking-wide uppercase">WhatsApp Group Access</h4>
            <p className="text-xs sm:text-[13px] leading-relaxed mt-0.5">
              The WhatsApp group invitation link will be sent directly to the team leader for hackathon participation.
            </p>
          </div>
        </div>

        {/* Navigation Action */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              if (onSuccess) onSuccess();
              else navigate('/profile');
            }}
            className="w-full py-3 px-6 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--bg-main)] font-mono font-bold text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
          >
            <span>View Squad Dashboard & Status</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 shadow-xl max-w-2xl mx-auto space-y-6"
    >
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--accent)] uppercase tracking-wider mb-1">
          <Users className="w-4 h-4" />
          <span>CREATE NEW TEAM</span>
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Leader & Squad Setup</h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
          Register your team name and leader details. You will receive a unique Team ID for your teammates to join.
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2.5 text-xs font-medium text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* WhatsApp Notice Banner */}
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-start gap-2.5 text-emerald-700 dark:text-emerald-300">
        <WhatsAppIcon className="w-4 h-4 shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed font-medium">
          The WhatsApp group invitation link will be sent directly to the team leader for hackathon participation.
        </p>
      </div>

      <div className="space-y-4">
        {/* Team Name */}
        <div>
          <label className="block text-xs font-mono font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
            Team Name *
          </label>
          <div className="relative">
            <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
            <input
              type="text"
              name="teamName"
              value={formData.teamName}
              onChange={handleChange}
              placeholder="e.g. Byte Warriors, CyberPunks 50"
              required
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-hidden focus:border-[var(--accent)] transition-colors"
            />
          </div>
        </div>

        {/* Leader Details Row: Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
              Leader Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Alex Rivera"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-hidden focus:border-[var(--accent)] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
              Leader Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="leader@psgtech.ac.in"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-hidden focus:border-[var(--accent)] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Leader Phone & Roll Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
              WhatsApp Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-hidden focus:border-[var(--accent)] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
              Roll / Reg Number *
            </label>
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
              <input
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder="e.g. 21MX101"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-hidden focus:border-[var(--accent)] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* College & Department */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
              College *
            </label>
            <div className="relative">
              <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="PSG College of Technology"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-hidden focus:border-[var(--accent)] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
              Department *
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Computer Science & Engineering"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-hidden focus:border-[var(--accent)] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Academic Year */}
        <div>
          <label className="block text-xs font-mono font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
            Year of Study *
          </label>
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm font-medium text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--accent)] transition-colors"
          >
            {YEAR_OPTIONS.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--bg-main)] font-mono font-bold text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md disabled:opacity-50"
      >
        {loading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <span>Create Squad & Generate Team ID</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};

export default CreateTeamForm;
