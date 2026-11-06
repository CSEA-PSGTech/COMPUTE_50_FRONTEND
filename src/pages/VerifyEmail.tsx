import React, { useEffect, useRef, useState } from 'react';
import { COLLEGES } from '../data/colleges';
import { DEPARTMENTS, psgCollegeForEmail } from '../data/departments';
import { isStrongPassword, PASSWORD_RULES_MESSAGE } from '../lib/password';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { authService } from '../services/auth.service';
import { getApiErrorMessage } from '../services/api';
import { YEAR_LABELS } from '../services/mappers';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { LoadingState } from '../components/common/LoadingState';
import { PasswordStrength } from '../components/auth/PasswordStrength';
import { GOOGLE_REG_KEY, readGoogleRegistration } from '../lib/googleRegistration';
import { validatePhotoFile } from '../lib/profilePhoto';

interface CompleteRegistrationProps {
  email: string;
  source: 'email' | 'google';
  googleId?: string;
}

export const CompleteRegistration: React.FC<CompleteRegistrationProps> = ({ email, source, googleId }) => {
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const psgCollege = psgCollegeForEmail(email);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    college: psgCollege ?? '',
    department: '',
    year: '3rd Year',
    password: '',
    confirm: '',
    accommodation: false,
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const photoInputRef = useRef<HTMLInputElement>(null);

  const pickPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const invalid = validatePhotoFile(file);
    if (invalid) {
      setError(invalid);
      return;
    }
    setError('');
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (source === 'email') {
      if (!isStrongPassword(form.password)) return setError(PASSWORD_RULES_MESSAGE);
      if (form.password !== form.confirm) return setError('Passwords do not match.');
    }
    const phone = form.phone.replace(/\D/g, '').slice(-10);
    if (!/^\d{10}$/.test(phone)) return setError('Enter a valid 10-digit phone number.');
    if (!photo) return setError('Please add a profile photo.');
    setSubmitting(true);
    try {
      await register({
        email,
        source,
        password: source === 'email' ? form.password : undefined,
        googleId: source === 'google' ? googleId : undefined,
        name: form.name.trim(),
        phone,
        college: form.college.trim(),
        department: form.department.trim(),
        year: form.year,
        accommodation: form.accommodation,
        referral: localStorage.getItem('compute50_referral') || undefined,
        discoveryMethod: 'Website',
      });
      sessionStorage.removeItem(GOOGLE_REG_KEY);
      try {
        await authService.uploadProfilePhoto(photo);
        addToast('Account created! Welcome to Compute 50.', 'success');
      } catch {
        addToast('Account created, but the photo upload failed. Please upload it from your profile.', 'info');
      }
      navigate('/profile', { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Registration failed.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-10 px-4">
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-black font-mono text-[var(--text-primary)]">COMPLETE YOUR PROFILE</h2>
        <p className="text-xs text-[var(--text-secondary)]">
          {source === 'google' ? 'Signed in with Google' : 'Email verified'}: <strong>{email}</strong>
        </p>
        {error && <p className="text-xs font-mono text-red-500">{error}</p>}
        <form onSubmit={submit} className="space-y-3">
          <Input label="Full Name" value={form.name} onChange={set('name')} required />
          <div className="space-y-1.5">
            <span className="block text-sm font-medium text-[var(--text-primary)]">
              Profile Photo <span className="text-red-500">*</span>
            </span>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center text-[10px] text-[var(--text-secondary)] shrink-0">
                {photoPreview ? (
                  <img src={photoPreview} alt="Selected profile" className="w-full h-full object-cover" />
                ) : (
                  'No photo'
                )}
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => photoInputRef.current?.click()}>
                {photo ? 'Change Photo' : 'Choose Photo'}
              </Button>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={pickPhoto}
              />
            </div>
            <p className="text-xs text-[var(--text-secondary)]">A clear photo of your face. JPEG, PNG or WebP, up to 5 MB.</p>
          </div>
          <Input label="Phone (WhatsApp)" value={form.phone} onChange={set('phone')} required />
          <Input
            label="College"
            value={form.college}
            onChange={set('college')}
            list="college-options"
            placeholder="Start typing your college name"
            autoComplete="off"
            readOnly={!!psgCollege}
            helperText={psgCollege ? 'Set from your PSG email address.' : 'Pick from the list, or type it if your college is not listed.'}
            required
          />
          <datalist id="college-options">
            {COLLEGES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <Input
            label="Department"
            value={form.department}
            onChange={set('department')}
            list="department-options"
            placeholder="Select or type your department"
            autoComplete="off"
            required
          />
          <datalist id="department-options">
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
          <label className="block text-sm font-medium text-[var(--text-primary)]">
            Year <span className="text-red-500">*</span>
            <select
              value={form.year}
              onChange={set('year')}
              className="mt-1.5 block w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)] px-3 py-2 text-sm"
            >
              {YEAR_LABELS.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </label>
          {source === 'email' && (
            <>
              <Input label="Password" type="password" value={form.password} onChange={set('password')} required />
              <PasswordStrength password={form.password} />
              <Input label="Confirm Password" type="password" value={form.confirm} onChange={set('confirm')} required />
            </>
          )}
          <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <input type="checkbox" checked={form.accommodation} onChange={set('accommodation')} />
            I need accommodation
          </label>
          <Button type="submit" fullWidth isLoading={submitting}>
            Create Account
          </Button>
        </form>
      </Card>
    </div>
  );
};

export const GoogleRegistration: React.FC = () => {
  const data = readGoogleRegistration();
  if (!data) {
    return (
      <div className="max-w-md mx-auto text-center space-y-4 py-16">
        <p className="text-sm font-mono text-red-500">Google sign-in session expired. Please try again.</p>
        <Link to="/login" className="text-[var(--accent)] font-bold underline">
          Back to login
        </Link>
      </div>
    );
  }
  return <CompleteRegistration email={data.email} source="google" googleId={data.googleId} />;
};

export const VerifyEmail: React.FC<{ token?: string }> = ({ token: tokenProp }) => {
  const { token: pathToken = '' } = useParams();
  const token = tokenProp || pathToken;
  const ran = useRef(false);
  const [status, setStatus] = useState<'verifying' | 'verified' | 'error'>('verifying');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    if (!token) {
      setError('Invalid verification link.');
      setStatus('error');
      return;
    }
    authService
      .verifyEmailToken(token)
      .then((res) => {
        setEmail(res.email);
        setStatus('verified');
      })
      .catch((err) => {
        setError(getApiErrorMessage(err, 'Invalid or expired verification link.'));
        setStatus('error');
      });
  }, [token]);

  if (status === 'verifying') return <LoadingState message="Verifying your email..." fullScreen />;

  if (status === 'error') {
    return (
      <div className="max-w-md mx-auto text-center space-y-4 py-16">
        <p className="text-sm font-mono text-red-500">{error}</p>
        <Link to="/login" className="text-[var(--accent)] font-bold underline">
          Request a new link
        </Link>
      </div>
    );
  }

  return <CompleteRegistration email={email} source="email" />;
};

export default VerifyEmail;