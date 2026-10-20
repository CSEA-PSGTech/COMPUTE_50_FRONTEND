import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, School, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { GoogleIcon } from '../common/GoogleIcon';
import { DecryptText } from '../common/DecryptText';
import { soundModalOpen, soundSuccess, soundWarning } from '../../lib/sound';

export const LoginForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [college, setCollege] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string | undefined }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  const shouldReduceMotion = useReducedMotion();
  const { login, register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const stateFrom = (location.state as { from?: { pathname?: string } })?.from?.pathname;
  const targetDestination = stateFrom && stateFrom !== '/' && stateFrom !== '/login' ? stateFrom : '/register';
  const isFromRegister = stateFrom === '/register';

  // Sound effect on sci-fi laser projection activation
  useEffect(() => {
    soundModalOpen();
  }, []);

  const validateForm = () => {
    const errors: { [key: string]: string | undefined } = {};
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

    if (isSignUp) {
      if (!name.trim()) {
        errors.name = 'Full name is required';
      }
      if (!college.trim()) {
        errors.college = 'College name is required';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAuthSuccess = (toastMsg: string) => {
    addToast(toastMsg, 'success');
    soundSuccess();
    // Trigger sci-fi laser roll-up / ascending wipe (bottom to top)
    setIsExiting(true);
    setTimeout(() => {
      navigate(targetDestination, { replace: true });
    }, 820);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      soundWarning();
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        await register({
          name: name.trim(),
          email: email.trim(),
          college: college.trim(),
          phone: '+91 9876543210',
          department: 'Computer Science & Engineering',
          year: '3rd Year',
          password,
        });
        handleAuthSuccess('Account created! Welcome to Compute 50.');
      } else {
        await login({ email, password });
        handleAuthSuccess('Welcome back! Login successful.');
      }
    } catch {
      soundWarning();
      const msg = isSignUp
        ? 'Account creation failed. Please try again.'
        : 'Invalid credentials. Please verify your email & password.';
      setError(msg);
      addToast(msg, 'error');
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email.trim())) {
      setError('Enter the email address for this demo sign-in.');
      soundWarning();
      return;
    }

    if (isSignUp && !validateForm()) {
      soundWarning();
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await register({
          name: name.trim(),
          email: email.trim(),
          college: college.trim(),
          phone: '+91 9876543210',
          department: 'Computer Science & Engineering',
          year: '3rd Year',
        });
        handleAuthSuccess('Demo account created successfully.');
      } else {
        await login({ email: email.trim() });
        handleAuthSuccess('Demo sign-in successful.');
      }
    } catch {
      soundWarning();
      addToast('Google authentication failed. Please try again.', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-[420px] mx-auto select-none">
      {/* Sci-Fi Hologram Laser Scanline (Sweeping Down on Enter, Sweeping UP on Exit) */}
      {!shouldReduceMotion && (
        <motion.div
          initial={{ top: '0%', opacity: 1 }}
          animate={
            isExiting
              ? { top: ['100%', '-5%'], opacity: [1, 1, 0] }
              : { top: ['0%', '102%'], opacity: [1, 1, 0] }
          }
          transition={
            isExiting
              ? { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
              : { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
          }
          className="absolute -left-3 -right-3 h-[2px] bg-[var(--accent)] shadow-[0_0_15px_var(--accent),0_0_30px_var(--accent),0_0_6px_#ffffff] z-30 pointer-events-none"
        >
          {/* Laser light flare fan trailing behind the beam */}
          <div
            className={`w-full ${
              isExiting
                ? 'h-10 bg-gradient-to-t from-[var(--accent)]/30 to-transparent'
                : 'h-10 bg-gradient-to-b from-[var(--accent)]/30 to-transparent'
            }`}
          />
        </motion.div>
      )}

      {/* Top Cyber Circuit Line with Yellow/Gold Accents (Expanding on Entry, Retracting on Exit) */}
      <div className="flex items-center justify-between mb-1.5 px-1 select-none">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs sm:text-sm font-black text-[var(--accent)] tracking-tighter animate-pulse">
            //
          </span>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isExiting ? { scaleX: 0 } : { scaleX: 1 }}
            transition={isExiting ? { duration: 0.5 } : { duration: 0.8, delay: 0.25 }}
            className="w-12 sm:w-20 h-[1px] bg-gradient-to-r from-[var(--accent)]/60 to-transparent origin-left"
          />
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isExiting ? { scaleX: 0 } : { scaleX: 1 }}
            transition={isExiting ? { duration: 0.5 } : { duration: 0.8, delay: 0.25 }}
            className="w-12 sm:w-20 h-[1px] bg-gradient-to-l from-[var(--accent)]/60 to-transparent origin-right"
          />
          <span className="font-mono text-xs sm:text-sm font-black text-[var(--accent)] tracking-tighter animate-pulse">
            \\
          </span>
        </div>
      </div>

      {/* Holographic Projected Cyber Card (Top-to-Bottom on Enter, Rolling UP on Exit) */}
      <motion.div
        initial={
          shouldReduceMotion
            ? { opacity: 0 }
            : { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)', opacity: 0.3 }
        }
        animate={
          shouldReduceMotion
            ? { opacity: isExiting ? 0 : 1 }
            : isExiting
            ? {
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
                opacity: 0,
                transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
              }
            : {
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                opacity: 1,
                transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] },
              }
        }
        className="relative bg-[var(--bg-surface)]/90 backdrop-blur-md border border-[var(--border-color)] rounded-2xl p-4 sm:p-5 shadow-2xl transition-all overflow-hidden"
      >
        {/* Subtle Sci-Fi CRT scanline texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.06] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px]"
          aria-hidden="true"
        />

        {/* Redirect Notice if coming from Register */}
        {isFromRegister && (
          <div className="mb-3 py-1.5 px-3 rounded-xl bg-[var(--accent-muted)] border border-[var(--accent)]/40 text-[10px] sm:text-[11px] font-mono font-bold text-[var(--accent)] text-center flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(var(--accent-rgb),0.12)]">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--accent)]" />
            </span>
            <span>PLEASE SIGN IN TO CONTINUE TO EVENT REGISTRATION</span>
          </div>
        )}

        {/* Terminal Header with Decrypt Animation */}
        <div className="text-center mb-3">
          <h2 className="text-xl sm:text-2xl font-black font-mono tracking-[0.25em] text-[var(--text-primary)] uppercase flex items-center justify-center">
            <DecryptText
              key={isSignUp ? 'mode_register' : 'mode_login'}
              text={isSignUp ? 'REGISTER' : 'LOGIN'}
              speed={36}
            />
          </h2>
          <p className="text-[10px] sm:text-[11px] font-mono text-[var(--text-secondary)] mt-0.5 tracking-wider uppercase">
            {isSignUp ? 'CREATE YOUR PARTICIPANT PROFILE' : 'ENTER CREDENTIALS TO ACCESS SYSTEM'}
          </p>
        </div>

        {error && (
          <div className="mb-3 p-2 bg-red-500/10 border border-red-500/30 rounded-xl text-xs font-mono text-red-600 dark:text-red-400 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-2.5">
          {/* Sign Up: Full Name */}
          {isSignUp && (
            <div className="space-y-1 text-left">
              <div className="relative rounded-lg bg-[var(--bg-main)]/80 border border-[var(--border-color)] focus-within:border-[var(--accent)] focus-within:shadow-[0_0_10px_rgba(var(--accent-rgb),0.2)] transition-all">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-secondary)]">
                  <User className="w-3.5 h-3.5 text-[var(--accent)]" />
                </div>
                <input
                  type="text"
                  placeholder="FULL NAME"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: undefined });
                  }}
                  className="block w-full pl-9 pr-3.5 py-1.5 sm:py-2 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/60 text-xs font-mono tracking-wider focus:outline-none"
                  required
                />
              </div>
              {fieldErrors.name && (
                <p className="text-[10px] font-mono text-red-500 mt-0.5 pl-1">{fieldErrors.name}</p>
              )}
            </div>
          )}

          {/* Email Address */}
          <div className="space-y-1 text-left">
            <div className="relative rounded-lg bg-[var(--bg-main)]/80 border border-[var(--border-color)] focus-within:border-[var(--accent)] focus-within:shadow-[0_0_10px_rgba(var(--accent-rgb),0.2)] transition-all">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-secondary)]">
                <Mail className="w-3.5 h-3.5 text-[var(--accent)]" />
              </div>
              <input
                type="email"
                placeholder="EMAIL"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                }}
                className="block w-full pl-9 pr-3.5 py-1.5 sm:py-2 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/60 text-xs font-mono tracking-wider focus:outline-none"
                required
              />
            </div>
            {fieldErrors.email && (
              <p className="text-[10px] font-mono text-red-500 mt-0.5 pl-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Sign Up: College Name */}
          {isSignUp && (
            <div className="space-y-1 text-left">
              <div className="relative rounded-lg bg-[var(--bg-main)]/80 border border-[var(--border-color)] focus-within:border-[var(--accent)] focus-within:shadow-[0_0_10px_rgba(var(--accent-rgb),0.2)] transition-all">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-secondary)]">
                  <School className="w-3.5 h-3.5 text-[var(--accent)]" />
                </div>
                <input
                  type="text"
                  placeholder="COLLEGE / INSTITUTION"
                  value={college}
                  onChange={(e) => {
                    setCollege(e.target.value);
                    if (fieldErrors.college) setFieldErrors({ ...fieldErrors, college: undefined });
                  }}
                  className="block w-full pl-9 pr-3.5 py-1.5 sm:py-2 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/60 text-xs font-mono tracking-wider focus:outline-none"
                  required
                />
              </div>
              {fieldErrors.college && (
                <p className="text-[10px] font-mono text-red-500 mt-0.5 pl-1">{fieldErrors.college}</p>
              )}
            </div>
          )}

          {/* Password */}
          <div className="space-y-1 text-left">
            <div className="relative rounded-lg bg-[var(--bg-main)]/80 border border-[var(--border-color)] focus-within:border-[var(--accent)] focus-within:shadow-[0_0_10px_rgba(var(--accent-rgb),0.2)] transition-all">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-secondary)]">
                <Lock className="w-3.5 h-3.5 text-[var(--accent)]" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
                }}
                className="block w-full pl-9 pr-9 py-1.5 sm:py-2 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/60 text-xs font-mono tracking-wider focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-[10px] font-mono text-red-500 mt-0.5 pl-1">{fieldErrors.password}</p>
            )}
          </div>

          {/* Forgot Password (Sign-In Mode Only) */}
          {!isSignUp && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => {
                  addToast('Password reset instructions sent to your email address.', 'info');
                }}
                className="text-[10px] font-mono font-bold tracking-wider uppercase text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors cursor-pointer"
              >
                FORGOT PASSWORD?
              </button>
            </div>
          )}

          {/* Action Button: LOGIN / CREATE ACCOUNT */}
          <button
            type="submit"
            disabled={loading || isExiting}
            className="w-full mt-1 py-2 px-4 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-zinc-950 font-mono font-black text-xs tracking-[0.2em] uppercase shadow-[0_0_18px_rgba(var(--accent-rgb),0.25)] hover:shadow-[0_0_24px_rgba(var(--accent-rgb),0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block animate-pulse">PROCESSING...</span>
            ) : isSignUp ? (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                <span>CREATE ACCOUNT</span>
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5" />
                <span>LOGIN</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-2.5 text-center select-none">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border-color)]" />
          </div>
          <span className="relative bg-[var(--bg-surface)] px-2.5 text-[9px] font-mono font-bold text-[var(--text-secondary)] uppercase tracking-widest">
            OR
          </span>
        </div>

        {/* Google Authentication */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={loading || isExiting}
          className="w-full py-1.5 sm:py-2 px-3.5 rounded-lg bg-[var(--bg-main)]/80 hover:bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent)] text-[var(--text-primary)] font-mono font-bold text-[11px] sm:text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
        >
          <GoogleIcon className="w-3.5 h-3.5 shrink-0" />
          <span>{isSignUp ? 'SIGN UP WITH GOOGLE' : 'LOGIN WITH GOOGLE'}</span>
        </button>

        {/* Mode Switch Footer */}
        <div className="text-center mt-2.5 pt-2 border-t border-[var(--border-color)]/70 text-[11px] font-mono">
          <span className="text-[var(--text-secondary)]">
            {isSignUp ? 'Already have an account ? ' : "Don't have an account ? "}
          </span>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setFieldErrors({});
            }}
            className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-black tracking-wider uppercase hover:underline cursor-pointer"
          >
            {isSignUp ? 'LOGIN' : 'REGISTER'}
          </button>
        </div>
      </motion.div>

      {/* Bottom Cyber Circuit Line with Yellow/Gold Accents (Expanding on Entry) */}
      <div className="flex items-center justify-between mt-1.5 px-1 select-none">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs sm:text-sm font-black text-[var(--accent)] tracking-tighter animate-pulse">
            \\
          </span>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="w-12 sm:w-20 h-[1px] bg-gradient-to-r from-[var(--accent)]/60 to-transparent origin-left"
          />
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="w-12 sm:w-20 h-[1px] bg-gradient-to-l from-[var(--accent)]/60 to-transparent origin-right"
          />
          <span className="font-mono text-xs sm:text-sm font-black text-[var(--accent)] tracking-tighter animate-pulse">
            //
          </span>
        </div>
      </div>
    </div>
  );
};
