import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  User as UserIcon,
  Volume2,
  VolumeX,
  Sun,
  Moon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { isMuted, setMuted, soundSwitch } from '../../lib/sound';
import { Container } from '../common/Container';
import { Button } from '../common/Button';
import compute50Logo from '../../assets/logos/compute 50 logo.png';
import psgLogo from '../../assets/logos/psg-logo.png';
import cseaLogo from '../../assets/logos/csea-logo.png';
import psg100Logo from '../../assets/logos/psg-100years-logo.png';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const { isAuthenticated, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [muted, setMutedState] = useState<boolean>(isMuted());

  const handleToggleSound = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const currentlyMuted = isMuted();
    if (!currentlyMuted) {
      soundSwitch();
      setMuted(true);
      setMutedState(true);
    } else {
      setMuted(false);
      setMutedState(false);
      soundSwitch();
    }
  };

  const handleToggleTheme = () => {
    soundSwitch();
    toggleTheme();
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

  // Primary Navigation Links
  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Hackathon', path: '/hackathon' },
    ...(isAuthenticated
      ? [{ label: 'Profile', path: '/profile' }]
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
            {/* Institutional Logos Row: Hidden on narrow mobile (<640px) to prevent pushing sound & menu off-screen */}
            <div className="hidden sm:flex items-center gap-2 sm:gap-3 px-2 py-1">
              <img
                src={psgLogo}
                alt="PSG Tech"
                className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform duration-200 hover:scale-110 cursor-pointer filter drop-shadow-[0_0_6px_rgba(255,255,255,0.25)]"
                title="PSG College of Technology"
              />
              <div className="h-4 sm:h-5 w-[1px] bg-[var(--border-color)]" />
              <img
                src={cseaLogo}
                alt="CSEA"
                className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform duration-200 hover:scale-110 cursor-pointer filter drop-shadow-[0_0_8px_rgba(34,197,94,0.25)]"
                title="Computer Science & Engineering Association"
              />
              <div className="h-4 sm:h-5 w-[1px] bg-[var(--border-color)] hidden md:block" />
              <img
                src={psg100Logo}
                alt="PSG 100 Years"
                className="h-8 sm:h-9 md:h-10 w-auto object-contain hidden md:block transition-transform duration-200 hover:scale-110 cursor-pointer filter drop-shadow-[0_0_6px_rgba(255,255,255,0.25)]"
                title="PSG Centenary"
              />
            </div>

            {/* Desktop Theme Switch & Auth Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleTheme}
                data-nosound="true"
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
                      className="bg-[var(--accent)] text-[var(--accent-text)] hover:bg-[var(--accent-hover)] font-extrabold shadow-[0_0_15px_rgba(var(--accent-rgb),0.35)] hover:shadow-[0_0_22px_rgba(var(--accent-rgb),0.55)] transition-all transform hover:scale-105"
                    >
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Actions: Compact Theme & Sound Controls Pill */}
            <div className="flex md:hidden items-center gap-1 p-1 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-xs shrink-0">
              <button
                type="button"
                onClick={handleToggleTheme}
                data-nosound="true"
                className="w-9 h-9 rounded-xl text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--accent)] transition-all cursor-pointer flex items-center justify-center shrink-0"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )}
              </button>

              <div className="w-[1px] h-4 bg-[var(--border-color)]" />

              <button
                type="button"
                onClick={handleToggleSound}
                data-nosound="true"
                className="w-9 h-9 rounded-xl text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--accent)] transition-all cursor-pointer flex items-center justify-center shrink-0"
                aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
                title={muted ? 'Unmute sound effects' : 'Mute sound effects'}
              >
                {muted ? (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[var(--accent)]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </Container>


    </header>
  );
};
