import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  User as UserIcon,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { isMuted, setMuted, soundSwitch } from '../../lib/sound';
import { Container } from '../common/Container';
import { Button } from '../common/Button';
import { CircuitNav } from './CircuitNav';
import compute50Logo from '../../assets/logos/compute 50_logo.png';
import psgLogo from '../../assets/logos/psg-logo.png';
import cseaLogo from '../../assets/logos/csea-logo.png';
import psg75Logo from '../../assets/logos/psg-75-logo.png';

// Wordmark fonts are loaded here so the change stays inside the navbar.
const NAVBAR_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&display=swap';

const useNavbarFonts = () => {
  useEffect(() => {
    if (document.querySelector(`link[href="${NAVBAR_FONTS_URL}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = NAVBAR_FONTS_URL;
    document.head.appendChild(link);
  }, []);
};

export const Navbar: React.FC = () => {
  useNavbarFonts();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const { isAuthenticated, user } = useAuth();
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
        <div className="flex items-center justify-between h-16 sm:h-20 lg:h-[88px] gap-3">
          {/* Top Left: Compute 50 Logo & Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-xl p-1 shrink-0"
            aria-label="Compute 50 Homepage"
          >
            <div className="w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center transition-transform duration-200 group-hover:scale-110 cursor-pointer">
              <img
                src={compute50Logo}
                alt="Compute 50"
                className="w-full h-full object-contain transition-transform duration-200"
              />
            </div>
            <div className="flex flex-col justify-center pl-3 sm:pl-3.5 border-l border-[var(--border-color)]">
              <span className="flex items-baseline gap-2 leading-none">
                <span
                  className="text-[17px] sm:text-[20px] font-bold tracking-[0.14em] text-[var(--text-primary)]"
                  style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                >
                  COMPUTE
                </span>
                <span
                  className="text-[17px] sm:text-[20px] font-bold tracking-[0.14em] text-[var(--accent)]"
                  style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                >
                  50
                </span>
              </span>
              <span
                className="flex items-center gap-1.5 mt-1.5 leading-none text-[10px] sm:text-[11px] font-light text-[var(--text-secondary)]"
                style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
              >
                <span className="h-px w-3 bg-[var(--accent)]/70" aria-hidden="true" />
                <span className="tracking-[0.12em]">powered by</span>
                <span className="font-medium tracking-[0.32em] text-[var(--accent-hover)]">CSEA</span>
              </span>
            </div>
          </Link>

          {/* Center: Desktop Navigation Links */}
          <CircuitNav items={navLinks} className="hidden lg:block w-[400px] xl:w-[460px]" />

          {/* Top Right: Institutional Logos & Actions */}
          <div className="flex items-center gap-3 md:gap-5 shrink-0">
            {/* Institutional Logos Row: Hidden on narrow mobile (<640px) to prevent pushing sound & menu off-screen */}
            <div className="hidden sm:flex items-center gap-3 md:gap-4 lg:gap-5 px-1">
              <img
                src={psgLogo}
                alt="PSG Tech"
                className="h-10 md:h-12 lg:h-14 w-auto object-contain transition-transform duration-300 hover:scale-105 cursor-pointer"
                title="PSG College of Technology"
              />
              <div className="h-8 md:h-9 w-px bg-[var(--border-color)]" />
              <img
                src={cseaLogo}
                alt="CSEA"
                className="h-10 md:h-12 lg:h-14 w-auto object-contain transition-transform duration-300 hover:scale-105 cursor-pointer"
                title="Computer Science & Engineering Association"
              />
              <div className="h-8 md:h-9 w-px bg-[var(--border-color)] hidden md:block" />
              <img
                src={psg75Logo}
                alt="PSG 75 Years"
                className="h-10 md:h-12 lg:h-14 w-auto object-contain hidden md:block transition-transform duration-300 hover:scale-105 cursor-pointer"
                title="PSG Centenary"
              />
            </div>

            {/* Desktop Sound Switch & Profile Button (only when logged in) */}
            <div className="hidden md:flex items-center gap-2">
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

              {isAuthenticated && (
                <Link to="/profile">
                  <Button
                    variant={isActive('/profile') ? 'primary' : 'outline'}
                    size="sm"
                    leftIcon={<UserIcon className="w-4 h-4" />}
                  >
                    {user?.name || 'Profile'}
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Actions: Compact Sound Control Pill */}
            <div className="flex md:hidden items-center gap-1 p-1 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-xs shrink-0">
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