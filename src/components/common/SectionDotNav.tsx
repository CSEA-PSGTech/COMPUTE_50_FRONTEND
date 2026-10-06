import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SectionItem {
  id: string;
  label: string;
}

// Matches the exact DOM rendering order in Home.tsx
const HOME_SECTIONS: SectionItem[] = [
  { id: 'hero', label: 'Top' },
  { id: 'prizes', label: 'Prizes' },
  { id: 'about', label: 'About' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'tracks', label: 'Tracks' },
  { id: 'speakers', label: 'Speakers' },
  { id: 'sponsors', label: 'Sponsors' },
  { id: 'events', label: 'Events' },
  { id: 'contact', label: 'Contact' },
];

export const SectionDotNav: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;
      let currentSection = 'hero';

      for (const sec of HOME_SECTIONS) {
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            currentSection = sec.id;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  if (!isHomePage) return null;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Section navigation"
      className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-3.5 bg-[var(--bg-surface)]/85 backdrop-blur-md p-2.5 rounded-full border border-[var(--border-color)] shadow-lg transition-opacity duration-300"
    >
      {HOME_SECTIONS.map((sec) => {
        const isActive = activeSection === sec.id;
        return (
          <button
            key={sec.id}
            onClick={() => scrollToSection(sec.id)}
            aria-label={`Scroll to ${sec.label}`}
            className="group relative flex items-center justify-center p-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-full cursor-pointer"
          >
            <span
              className={`block rounded-full transition-all duration-300 ${isActive
                ? 'w-3 h-3 bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]'
                : 'w-2 h-2 bg-[var(--text-secondary)]/40 hover:bg-[var(--text-secondary)] group-hover:scale-125'
                }`}
            />
            {/* Tooltip on hover */}
            <span className="absolute right-8 px-2.5 py-1 bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md text-[11px] font-mono font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-md">
              {sec.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
