import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  User as UserIcon,
  ArrowRight,
  LogIn,
  UserPlus,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Home,
  Info,
  Code2,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { isMuted, setMuted } from '../../lib/sound';
import { Container } from '../common/Container';
import { Button } from '../common/Button';
import { EVENT_CONFIG } from '../../config/event';
import compute50Logo from '../../assets/logos/compute 50 logo.png';
import psgLogo from '../../assets/logos/psg-logo.png';
import cseaLogo from '../../assets/logos/csea-logo.png';
import psg100Logo from '../../assets/logos/psg-100years-logo.png';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const { isAuthenticated, user } = useAuth();
  const { theme, toggleTheme, setTheme } = useTheme();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const [muted, setMutedState] = useState<boolean>(isMuted());

  // Focus trap / management refs
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleToggleSound = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const next = !isMuted();
    setMuted(next);
    setMutedState(next);
  };

  useEffect(() => {
    const handleSoundChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ muted: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.muted === 'boolean') {
        setMutedState(customEvent.detail.muted);
      } else {
        setMutedState(isMuted());
      }
    };
    window.addEventListener('compute50_sound_toggle', handleSoundChange);
    window.addEventListener('storage', handleSoundChange);
    return () => {
      window.removeEventListener('compute50_sound_toggle', handleSoundChange);
      window.removeEventListener('storage', handleSoundChange);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileMenuOpen]);

  // Keyboard navigation & focus management
  useEffect(() => {
    if (mobileMenuOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setMobileMenuOpen(false);
          menuTriggerRef.current?.focus();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        clearTimeout(timer);
      };
    }
  }, [mobileMenuOpen]);

  const handleCloseDrawer = () => {
    setMobileMenuOpen(false);
    menuTriggerRef.current?.focus();
  };

  // Primary Navigation Links
  const navLinks = [
    { label: 'Home', path: '/', icon: <Home className="w-4 h-4 shrink-0" /> },
    { label: 'About', path: '/about', icon: <Info className="w-4 h-4 shrink-0" /> },
    { label: 'Hackathon', path: '/hackathon', icon: <Code2 className="w-4 h-4 shrink-0" /> },
    ...(isAuthenticated
      ? [{ label: 'Profile', path: '/profile', icon: <UserIcon className="w-4 h-4 shrink-0" /> }]
      : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[var(--bg-main)]/95 shadow-md backdrop-blur-md border-b border-[var(--border-color)]'
          : 'bg-[var(--bg-main)]/80 backdrop-blur-xs border-b border-[var(--border-color)]/60'
      }`}
    >
      <Container size="lg">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Top Left: Compute 50 Logo & Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-xl p-1 shrink-0"
            aria-label="Compute 50 Homepage"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center transition-transform duration-200 group-hover:scale-110 cursor-pointer">
              <img
                src={compute50Logo}
                alt="Compute 50"
                className="w-full h-full object-contain transition-transform duration-200"
              />
            </div>
            <div>
              <span className="font-black text-lg sm:text-xl text-[var(--text-primary)] tracking-tight block font-mono leading-none">
                COMPUTE <span className="text-[var(--accent)]">50</span>
              </span>
              <span className="text-[10px] text-[var(--text-secondary)] block mt-0.5 tracking-wider uppercase font-semibold">
                CSEA · PSG Tech
              </span>
            </div>
          </Link>

          {/* Center: Desktop Navigation Links */}
          <nav
            aria-label="Desktop primary navigation"
            className="hidden lg:flex items-center gap-1 bg-[var(--bg-surface)] border border-[var(--border-color)] px-3 py-1.5 rounded-full shadow-xs"
          >
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
                    active
                      ? 'text-[var(--accent)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="activeNavTab"
                      className="absolute inset-0 bg-[var(--accent-muted)] border border-[var(--accent)]/30 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Top Right: Institutional Logos & Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Institutional Logos Row */}
            <div className="flex items-center gap-3 px-2 py-1">
              <img
                src={psgLogo}
                alt="PSG Tech"
                className="h-9 sm:h-10 w-auto object-contain transition-transform duration-200 hover:scale-110 cursor-pointer filter drop-shadow-[0_0_6px_rgba(255,255,255,0.25)]"
                title="PSG College of Technology"
              />
              <div className="h-5 w-[1px] bg-[var(--border-color)]" />
              <img
                src={cseaLogo}
                alt="CSEA"
                className="h-9 sm:h-10 w-auto object-contain transition-transform duration-200 hover:scale-110 cursor-pointer filter drop-shadow-[0_0_8px_rgba(34,197,94,0.25)]"
                title="Computer Science & Engineering Association"
              />
              <div className="h-5 w-[1px] bg-[var(--border-color)] hidden sm:block" />
              <img
                src={psg100Logo}
                alt="PSG 100 Years"
                className="h-9 sm:h-10 w-auto object-contain hidden sm:block transition-transform duration-200 hover:scale-110 cursor-pointer filter drop-shadow-[0_0_6px_rgba(255,255,255,0.25)]"
                title="PSG Centenary"
              />
            </div>

            {/* Desktop Theme Switch & Auth Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="min-h-[40px] min-w-[40px] p-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--accent)] transition-all cursor-pointer flex items-center justify-center"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )}
              </button>

              <button
                type="button"
                onClick={handleToggleSound}
                data-nosound="true"
                className="min-h-[40px] min-w-[40px] p-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--accent)] transition-all cursor-pointer flex items-center justify-center"
                aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
                title={muted ? 'Unmute sound effects' : 'Mute sound effects'}
              >
                {muted ? (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[var(--accent)]" />
                )}
              </button>

              {isAuthenticated ? (
                <Link to="/profile">
                  <Button
                    variant={isActive('/profile') ? 'primary' : 'outline'}
                    size="sm"
                    leftIcon={<UserIcon className="w-4 h-4" />}
                  >
                    {user?.name || 'Profile'}
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant={isActive('/login') ? 'primary' : 'ghost'} size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-[var(--accent)] text-slate-950 hover:bg-emerald-400 font-extrabold shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_22px_rgba(34,197,94,0.6)] transition-all transform hover:scale-105"
                    >
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Actions: Drawer Toggle Button */}
            <div className="flex md:hidden items-center gap-1.5">
              <button
                type="button"
                onClick={handleToggleSound}
                data-nosound="true"
                className="min-h-[40px] min-w-[40px] p-2 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] bg-[var(--bg-surface)] cursor-pointer flex items-center justify-center"
                aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
                title={muted ? 'Unmute sound effects' : 'Mute sound effects'}
              >
                {muted ? (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[var(--accent)]" />
                )}
              </button>

              <button
                ref={menuTriggerRef}
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="min-h-[40px] min-w-[40px] p-2 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] bg-[var(--bg-surface)] hover:border-[var(--accent)]/60 transition-colors cursor-pointer flex items-center justify-center"
                aria-label="Open navigation menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation-drawer"
              >
                <Menu className="w-5 h-5 text-[var(--text-primary)]" />
              </button>
            </div>
          </div>
        </div>
      </Container>

      {/* ========================================================= */}
      {/* MOBILE NAVIGATION DRAWER                                   */}
      {/* ========================================================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleCloseDrawer}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 md:hidden"
              aria-hidden="true"
            />

            {/* Slide-In Navigation Drawer Panel */}
            <motion.div
              id="mobile-navigation-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={
                shouldReduceMotion
                  ? { duration: 0.15 }
                  : { type: 'spring', stiffness: 350, damping: 32 }
              }
              className="fixed top-0 right-0 bottom-0 w-[85vw] sm:w-[360px] max-w-[380px] bg-[var(--bg-surface)] border-l border-[var(--border-color)] z-50 flex flex-col justify-between pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))] px-5 sm:px-6 shadow-2xl md:hidden overflow-y-auto"
            >
              {/* Drawer Top / Header */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--accent)]/40 p-1 flex items-center justify-center overflow-hidden shrink-0">
                      <img
                        src={compute50Logo}
                        alt="Compute 50 Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-[var(--text-primary)] font-mono block leading-tight">
                        COMPUTE <span className="text-[var(--accent)]">50</span>
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-secondary)] block">
                        CSEA · PSG Tech
                      </span>
                    </div>
                  </div>

                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={handleCloseDrawer}
                    className="min-h-[40px] min-w-[40px] p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center cursor-pointer transition-colors"
                    aria-label="Close navigation menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 1. PRIMARY NAVIGATION SECTION */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--accent)] uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                    NAVIGATION
                  </span>

                  <nav aria-label="Mobile primary navigation" className="space-y-1.5">
                    {navLinks.map((link, idx) => {
                      const active = isActive(link.path);
                      return (
                        <motion.div
                          key={link.path}
                          initial={shouldReduceMotion ? false : { opacity: 0, x: 14 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.04 + 0.06, duration: 0.2 }}
                        >
                          <Link
                            to={link.path}
                            onClick={handleCloseDrawer}
                            className={`min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-mono transition-all ${
                              active
                                ? 'bg-[var(--accent-muted)] text-[var(--accent)] font-bold border border-[var(--accent)]/40 shadow-xs'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              {link.icon}
                              <span>{link.label}</span>
                            </div>
                            <ArrowRight
                              className={`w-3.5 h-3.5 transition-transform ${
                                active ? 'translate-x-0.5 text-[var(--accent)]' : 'opacity-30'
                              }`}
                            />
                          </Link>
                        </motion.div>
                      );
                    })}
                  </nav>
                </div>

                {/* 2. SECONDARY EXPLORE SECTION */}
                <div className="space-y-2 pt-2 border-t border-[var(--border-color)]/60">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                    EXPLORE
                  </span>

                  <div className="space-y-1.5 font-mono text-xs">
                    <a
                      href={EVENT_CONFIG.collegeWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--accent)]/50 transition-all group"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={psgLogo}
                          alt="PSG Tech Logo"
                          className="w-5 h-5 object-contain shrink-0"
                        />
                        <span className="text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors font-medium">
                          PSG College of Technology
                        </span>
                      </div>
                      <ExternalLink className="w-3 h-3 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors shrink-0" />
                    </a>

                    <a
                      href={EVENT_CONFIG.organizerWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--accent)]/50 transition-all group"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={cseaLogo}
                          alt="CSEA Logo"
                          className="w-5 h-5 object-contain shrink-0"
                        />
                        <span className="text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors font-medium">
                          CSEA Official Portal
                        </span>
                      </div>
                      <ExternalLink className="w-3 h-3 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors shrink-0" />
                    </a>
                  </div>
                </div>

                {/* 3. APPEARANCE & THEME CONTROL SECTION */}
                <div className="space-y-2 pt-2 border-t border-[var(--border-color)]/60">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                    APPEARANCE
                  </span>

                  <div className="p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] grid grid-cols-2 gap-1 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-[var(--bg-surface)] text-[var(--accent)] font-bold shadow-xs border border-[var(--border-color)]'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5" />
                      <span>Dark</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all cursor-pointer ${
                        theme === 'light'
                          ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-bold shadow-xs border border-[var(--border-color)]'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>Light</span>
                    </button>
                  </div>

                  {/* Sound Effects Toggle in Drawer */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                    <div className="flex items-center gap-2 font-mono text-xs text-[var(--text-primary)]">
                      {muted ? (
                        <VolumeX className="w-4 h-4 text-slate-400" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-[var(--accent)]" />
                      )}
                      <span>Sound Effects</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleSound}
                      data-nosound="true"
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        muted
                          ? 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-color)]'
                          : 'bg-[var(--accent)] text-slate-950 shadow-xs'
                      }`}
                    >
                      {muted ? 'Muted' : 'Enabled'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Drawer Bottom / Auth Buttons & Attribution */}
              <div className="pt-5 border-t border-[var(--border-color)] space-y-3">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[var(--accent-muted)] border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] shrink-0">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-mono text-xs font-bold text-[var(--text-primary)] truncate">
                            {user?.name || 'Participant'}
                          </p>
                          <p className="font-mono text-[10px] text-[var(--text-secondary)] truncate">
                            {user?.email || 'Logged in'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Link to="/profile" onClick={handleCloseDrawer} className="block w-full">
                      <Button variant="primary" fullWidth size="sm">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link to="/login" onClick={handleCloseDrawer} className="block w-full">
                      <Button
                        variant="outline"
                        fullWidth
                        size="sm"
                        leftIcon={<LogIn className="w-3.5 h-3.5" />}
                      >
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" onClick={handleCloseDrawer} className="block w-full">
                      <Button
                        variant="primary"
                        fullWidth
                        size="sm"
                        leftIcon={<UserPlus className="w-3.5 h-3.5" />}
                        className="bg-[var(--accent)] text-slate-950 font-bold"
                      >
                        Register
                      </Button>
                    </Link>
                  </div>
                )}

                <p className="text-[10px] text-[var(--text-secondary)] text-center font-mono pt-1">
                  © 2026 Compute 50 · PSG Tech & CSEA
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
