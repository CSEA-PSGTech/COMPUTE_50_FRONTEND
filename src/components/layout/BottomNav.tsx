import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserPlus, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';
import { CircuitNav } from './CircuitNav';
import type { NavLinkItem } from '../../types/common';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const navItems: NavLinkItem[] = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Hackathon', path: '/hackathon' },
    isAuthenticated ? { label: 'Profile', path: '/profile' } : { label: 'Login', path: '/login' },
  ];

  const hideRegisterCTA = location.pathname === '/register' || location.pathname === '/profile';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[var(--bg-surface)]/95 backdrop-blur-lg border-t border-[var(--border-color)] shadow-[0_-4px_25px_rgba(0,0,0,0.2)] pb-[env(safe-area-inset-bottom)] transition-colors">
      {/* Top Stacked Layer: Register Now CTA Button */}
      {!hideRegisterCTA && (
        <div className="px-3 pt-2.5 pb-2 border-b border-[var(--border-color)]/60">
          <Link to="/register" className="block w-full">
            <Button
              variant="primary"
              size="md"
              className="w-full min-h-[48px] text-sm font-bold shadow-md flex items-center justify-center gap-2"
              leftIcon={<UserPlus className="w-4 h-4" />}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              <span>Register Now</span>
            </Button>
          </Link>
        </div>
      )}

      {/* Bottom Stacked Layer: Navigation Tabs */}
      <CircuitNav items={navItems} compact className="mx-auto max-w-lg px-2" />
    </div>
  );
};
