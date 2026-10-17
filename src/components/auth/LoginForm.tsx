import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

import { GoogleIcon } from '../common/GoogleIcon';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState<boolean>(false);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/profile';

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await login({ email, password });
      addToast('Welcome back! Login successful.', 'success');
      navigate(from, { replace: true });
    } catch {
      setError('Invalid login credentials. Please try again.');
      addToast('Login failed. Please check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await login({ email: 'google.user@psgtech.ac.in' });
      addToast('Welcome back! Signed in with Google.', 'success');
      navigate(from, { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Welcome Back</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">Sign in to manage your team & profile</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs font-medium text-red-600 dark:text-red-400 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="student@psgtech.ac.in"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
          }}
          error={fieldErrors.email}
          leftIcon={<Mail className="w-4 h-4" />}
          required
        />

        <div className="space-y-1">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
            }}
            error={fieldErrors.password}
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-slate-200 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            required
          />
          <div className="text-right">
            <button
              type="button"
              onClick={() => {
                addToast('Password reset instructions sent to your email.', 'info');
              }}
              className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] hover:underline cursor-pointer font-medium"
            >
              Forgot password?
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={loading}
          leftIcon={<LogIn className="w-4 h-4" />}
        >
          Sign In
        </Button>
      </form>

      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--border-color)]" />
        </div>
        <span className="relative bg-[var(--bg-surface)] px-3 text-xs text-[var(--text-secondary)]">OR</span>
      </div>

      <Button
        type="button"
        variant="outline"
        fullWidth
        onClick={handleGoogleLogin}
        disabled={loading}
        leftIcon={<GoogleIcon className="w-4 h-4" />}
      >
        Sign in with Google
      </Button>

      <p className="text-xs text-[var(--text-secondary)] text-center mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-[var(--accent)] hover:text-[var(--accent-hover)] hover:underline font-bold">
          Register
        </Link>
      </p>
    </Card>
  );
};
