import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingState } from '../components/common/LoadingState';

interface GuestRouteProps {
  children: React.ReactNode;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [wasInitiallyAuthed] = React.useState(isAuthenticated);

  if (isLoading) {
    return <LoadingState message="Checking authentication..." fullScreen />;
  }

  if (wasInitiallyAuthed) {
    const stateFrom = (location.state as { from?: { pathname?: string } })?.from?.pathname;
    const target = stateFrom && stateFrom !== '/' && stateFrom !== '/login' ? stateFrom : '/register';
    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
};
