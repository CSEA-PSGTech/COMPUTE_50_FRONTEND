import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { CircuitNav } from './CircuitNav';
import type { NavLinkItem } from '../../types/common';

export const BottomNav: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const navItems: NavLinkItem[] = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Hackathon', path: '/hackathon' },
    // Profile only appears once logged in; no Login tab
    ...(isAuthenticated ? [{ label: 'Profile', path: '/profile' }] : []),
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[var(--bg-surface)]/95 backdrop-blur-lg border-t border-[var(--border-color)] shadow-[0_-4px_25px_rgba(0,0,0,0.2)] pb-[env(safe-area-inset-bottom)] transition-colors">
      {/* Mobile navigation tabs */}
      <CircuitNav items={navItems} compact className="mx-auto max-w-lg px-2" />
    </div>
  );
};