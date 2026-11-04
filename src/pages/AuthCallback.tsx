import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { getApiErrorMessage } from '../services/api';
import { LoadingState } from '../components/common/LoadingState';
import { VerifyEmail, GoogleRegistration } from './VerifyEmail';
import { saveGoogleRegistration } from '../lib/googleRegistration';
import { ResetPassword } from './ResetPassword';

const GoogleCallback: React.FC = () => {
  const [params] = useSearchParams();
  const { completeGoogleLogin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const email = params.get('email');
    const googleId = params.get('googleId');
    const existingUser = params.get('existing_user') === 'true';
    const source = params.get('source');

    if (!email || !googleId) {
      setError('Google sign-in did not return your account details. Please try again.');
      return;
    }

    if (existingUser && source === 'email') {
      setError('This email is registered with a password. Please log in with your email and password instead.');
      return;
    }

    if (!existingUser) {
      saveGoogleRegistration(email, googleId);
      navigate('/auth?type=complete-registration&source=google', { replace: true });
      return;
    }

    completeGoogleLogin(email, googleId)
      .then(() => {
        addToast('Welcome! Authenticated with Google.', 'success');
        const target = sessionStorage.getItem('compute50_post_login_redirect') || '/profile';
        sessionStorage.removeItem('compute50_post_login_redirect');
        navigate(target, { replace: true });
      })
      .catch((err) => setError(getApiErrorMessage(err, 'Google sign-in failed.')));
  }, [params, completeGoogleLogin, addToast, navigate]);

  if (!error) return <LoadingState message="Completing Google sign-in..." fullScreen />;

  return (
    <div className="max-w-md mx-auto text-center space-y-4 py-16">
      <p className="text-sm font-mono text-red-500">{error}</p>
      <Link to="/login" className="text-[var(--accent)] font-bold underline">
        Back to login
      </Link>
    </div>
  );
};

export const AuthCallback: React.FC = () => {
  const [params] = useSearchParams();
  const { pathname } = useLocation();
  const type = params.get('type');

  if (pathname !== '/auth') return null;

  switch (type) {
    case 'callback':
      return <GoogleCallback />;
    case 'complete-registration':
      return <GoogleRegistration />;
    case 'verify-email':
      return <VerifyEmail token={params.get('token') || ''} />;
    case 'reset-password':
      return <ResetPassword />;
    case 'login': {
      const error = params.get('error');
      if (!error) return <Navigate to="/login" replace />;
      const message =
        error === 'auth_failed'
          ? 'Google sign-in was cancelled or failed. Please try again.'
          : 'Something went wrong on the server during Google sign-in. Please try again.';
      return (
        <div className="max-w-md mx-auto text-center space-y-4 py-16">
          <p className="text-sm font-mono text-red-500">{message}</p>
          <Link to="/login" className="text-[var(--accent)] font-bold underline">
            Back to login
          </Link>
        </div>
      );
    }
    default:
      return <Navigate to="/login" replace />;
  }
};

export default AuthCallback;