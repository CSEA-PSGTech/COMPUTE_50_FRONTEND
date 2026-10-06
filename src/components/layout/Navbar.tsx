import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User as UserIcon, ArrowRight, LogIn, UserPlus, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { isMuted, setMuted, tone } from '../../lib/sound';
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
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const [muted, setMutedState] = useState<boolean>(isMuted());

  const handleToggleSound = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) tone(600, 0.08, 0.045);
  };

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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Hackathon', path: '/hackathon' },
    ...(isAuthenticated ? [{ label: 'Profile', path: '/profile' }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled
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
              <img src={compute50Logo} alt="Compute 50" className="w-full h-full object-contain transition-transform duration-200" />
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

          {/* Center: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[var(--bg-surface)] border border-[var(--border-color)] px-3 py-1.5 rounded-full shadow-xs">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${active
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
            {/* Top Right Institutional Logos Row */}
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
                onClick={handleToggleSound}
                data-nosound=""
                className="min-h-[40px] min-w-[40px] p-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--accent)] transition-all cursor-pointer flex items-center justify-center"
                aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
                title={muted ? 'Unmute sound effects' : 'Mute sound effects'}
              >
                {muted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-[var(--accent)]" />}
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

            {/* Mobile Actions: Theme Switch & Drawer Toggle */}
            <div className="flex md:hidden items-center gap-1.5">


              <button
                onClick={handleToggleSound}
                data-nosound=""
                className="p-2 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] bg-[var(--bg-surface)] cursor-pointer flex items-center justify-center"
                aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
              >
                {muted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-[var(--accent)]" />}
              </button>

              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] bg-[var(--bg-surface)] cursor-pointer flex items-center justify-center"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5 text-[var(--text-primary)]" />
              </button>
            </div>
          </div>
        </div>
      </Container>

      {/* Slide-In Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
              aria-hidden="true"
            />

            {/* Slide-In Drawer Panel */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={
                shouldReduceMotion
                  ? { duration: 0.1 }
                  : { type: 'spring', stiffness: 350, damping: 35 }
              }
              className="fixed top-0 right-0 bottom-0 w-[300px] max-w-[85vw] bg-[var(--bg-surface)] border-l border-[var(--border-color)] z-50 flex flex-col justify-between p-6 shadow-2xl md:hidden overflow-y-auto"
            >
              {/* Drawer Top / Header */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--accent)]/40 p-1 flex items-center justify-center overflow-hidden">
                      <img src={compute50Logo} alt="Compute 50" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-bold text-base text-[var(--text-primary)] font-mono">
                      COMPUTE <span className="text-[var(--accent)]">50</span>
                    </span>
                  </div>

                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-h-[44px] min-w-[44px] p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center cursor-pointer"
                    aria-label="Close navigation menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Staggered Navigation Links */}
                <nav aria-label="Mobile drawer navigation" className="space-y-2">
                  {navLinks.map((link, idx) => {
                    const active = isActive(link.path);
                    return (
                      <motion.div
                        key={link.path}
                        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 20 }}
                        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.06 + 0.1, duration: 0.3 }}
                      >
                        <Link
                          to={link.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`min-h-[44px] flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${active
                            ? 'bg-[var(--accent-muted)] text-[var(--accent)] font-bold border border-[var(--accent)]/40 shadow-xs'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                            }`}
                        >
                          <span>{link.label}</span>
                          <ArrowRight className={`w-4 h-4 transition-transform ${active ? 'translate-x-1 text-[var(--accent)]' : 'opacity-40'}`} />
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Bottom / Auth Buttons */}
              <div className="pt-6 border-t border-[var(--border-color)] space-y-3">
                {isAuthenticated ? (
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" fullWidth leftIcon={<UserIcon className="w-4 h-4" />}>
                      Profile ({user?.name || 'Account'})
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" fullWidth leftIcon={<LogIn className="w-4 h-4" />}>
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="primary" fullWidth leftIcon={<UserPlus className="w-4 h-4" />}>
                        Register
                      </Button>
                    </Link>
                  </>
                )}
                <p className="text-[11px] text-[var(--text-secondary)] text-center font-mono pt-2">
                  {EVENT_CONFIG.organizerShort} · {EVENT_CONFIG.collegeShort}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
