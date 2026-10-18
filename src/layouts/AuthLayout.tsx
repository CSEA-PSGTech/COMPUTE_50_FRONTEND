import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Volume2, VolumeX, ArrowLeft, Sun, Moon } from 'lucide-react';
import { TexturedBackground } from '../components/common/TexturedBackground';
import { SoundEffects } from '../components/common/SoundEffects';
import { CursorGlow } from '../components/common/CursorGlow';
import { FloatingSupport } from '../components/common/FloatingSupport';
import { isMuted, setMuted } from '../lib/sound';
import { useTheme } from '../hooks/useTheme';
import cseaLogo from '../assets/logos/csea-logo.png';

export const AuthLayout: React.FC = () => {
  const [muted, setMutedState] = useState<boolean>(isMuted());
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ muted: boolean }>;
      if (customEvent.detail) {
        setMutedState(customEvent.detail.muted);
      }
    };
    window.addEventListener('compute50_sound_toggle', handleToggle);
    return () => window.removeEventListener('compute50_sound_toggle', handleToggle);
  }, []);

  const toggleSound = () => {
    const next = !muted;
    setMutedState(next);
    setMuted(next);
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden flex flex-col justify-between bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors relative select-none">
      <TexturedBackground />
      <SoundEffects />
      <CursorGlow />

      {/* Streamlined Top Header: Home + Center Branding + Theme Toggle */}
      <header className="relative z-20 w-full px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between">
        {/* Top-Left: Return to Home Button */}
        <Link
          to="/"
          className="flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--accent)] text-[var(--text-primary)] hover:text-[var(--accent)] shadow-sm hover:shadow-md transition-all group cursor-pointer"
          aria-label="Return to Homepage"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span className="text-xs font-mono font-bold tracking-tight hidden sm:inline-block">
            Home
          </span>
        </Link>

        {/* Top-Center: Institutional Badge */}
        <div className="flex items-center gap-2 select-none">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-xs">
            <img src={cseaLogo} alt="CSEA" className="w-4 h-4 object-contain" />
            <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-widest text-[var(--accent)] uppercase">
              PSG TECH // CSEA
            </span>
          </div>
        </div>

        {/* Top-Right: Theme Switcher */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] shadow-sm hover:shadow-md transition-all cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Viewport Centered Content Area (Strict Zero-Scroll) */}
      <main id="main-content" className="flex-1 flex items-center justify-center relative z-10 px-4 py-2 overflow-hidden">
        <Outlet />
      </main>

      {/* Bottom Controls */}
      {/* Symmetrical Helpdesk (Bottom-Left) */}
      <FloatingSupport />

      {/* Symmetrical Audio Toggle (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={toggleSound}
          className="p-2.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] shadow-lg hover:shadow-xl transition-all cursor-pointer group"
          aria-label={muted ? 'Unmute Sound FX' : 'Mute Sound FX'}
          title={muted ? 'Sound Muted' : 'Sound Enabled'}
        >
          {muted ? (
            <VolumeX className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
          ) : (
            <Volume2 className="w-4 h-4 text-[var(--accent)] group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>
    </div>
  );
};

export default AuthLayout;
