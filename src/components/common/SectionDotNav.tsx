import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSmoothScroll } from '../../context/SmoothScrollContext';

interface SectionItem {
  id: string;
  label: string;
}

// Matches the exact DOM rendering order in Home.tsx
const HOME_SECTIONS: SectionItem[] = [
  { id: 'hero', label: 'Top' },
  { id: 'about', label: 'About' },
  { id: 'hackathon', label: 'Hackathon' },
  { id: 'prizepool-home', label: 'Prizes' },
  { id: 'speakers', label: 'Speakers' },
  { id: 'sponsors', label: 'Sponsors' },
  { id: 'contact', label: 'Contact' },
];

export const SectionDotNav: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const location = useLocation();
  const { scrollTo, lenis } = useSmoothScroll();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      // 1. Top of page edge case
      if (window.scrollY < 80) {
        setActiveSection('hero');
        return;
      }

      // 2. Bottom of page edge case
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;
      if (isAtBottom) {
        setActiveSection('contact');
        return;
      }

      // 3. Viewport focal anchor (approx 38% down from viewport top)
      const focalPoint = window.innerHeight * 0.38;

      for (const sec of HOME_SECTIONS) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= focalPoint && rect.bottom > focalPoint) {
            setActiveSection(sec.id);
            return;
          }
        }
      }

      // 4. Fallback for fast scrolling
      let closestSection = 'hero';
      let closestDist = Infinity;
      for (const sec of HOME_SECTIONS) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const dist = Math.abs(rect.top - focalPoint);
          if (dist < closestDist) {
            closestDist = dist;
            closestSection = sec.id;
          }
        }
      }
      setActiveSection(closestSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    if (lenis) {
      lenis.on('scroll', handleScroll);
    }

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (lenis) {
        lenis.off('scroll', handleScroll);
      }
    };
  }, [isHomePage, lenis]);

  if (!isHomePage) return null;

  const scrollToSection = (id: string) => {
    if (id === 'hero') {
      scrollTo(0, { duration: 1.0 });
    } else {
      scrollTo(`#${id}`, { offset: -90, duration: 1.0 });
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
