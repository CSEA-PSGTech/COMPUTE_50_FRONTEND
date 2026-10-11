import React, { useState, useEffect } from 'react';
import { Container } from '../common/Container';

interface NavItem {
  id: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'theme', label: 'Theme' },
  { id: 'event', label: 'Event' },
  { id: 'psg-tech', label: 'PSG Tech' },
  { id: 'csea', label: 'CSEA' },
];

export const AboutStickyNav: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('theme');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;

      for (const item of navItems) {
        const element = document.getElementById(item.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;

          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 120;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="sticky top-16 sm:top-20 z-30 bg-[var(--bg-main)]/90 backdrop-blur-md border-b border-[var(--border-color)] transition-colors py-2 mb-8">
      <Container size="lg">
        <nav
          aria-label="About page section navigation"
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 -mx-1"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`min-h-[40px] px-4 py-1.5 rounded-full text-xs font-mono font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0 ${
                  isActive
                    ? 'bg-[var(--accent)] text-slate-950 shadow-sm shadow-[var(--accent)]/30 font-extrabold'
                    : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </Container>
    </div>
  );
};
