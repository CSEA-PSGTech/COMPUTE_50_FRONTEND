import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Container } from '../components/common/Container';
import { SectionHeading } from '../components/common/SectionHeading';
import { LoadingState } from '../components/common/LoadingState';
import { StatusCards } from '../components/profile/StatusCards';
import { WhatsAppGroupCard } from '../components/profile/WhatsAppGroupCard';
import { ProfilePhotoCard } from '../components/profile/ProfilePhotoCard';
import { hasProfilePhoto } from '../lib/profilePhoto';
import { userService } from '../services/user.service';
import { getApiErrorMessage } from '../services/api';
import { useToast } from '../hooks/useToast';
import { soundSuccess, soundWarning } from '../lib/sound';
import { UserProfile } from '../types/user';

const celebrate = () => {
  const defaults = {
    spread: 360,
    ticks: 90,
    gravity: 0.8,
    decay: 0.92,
    startVelocity: 28,
    colors: ['#B6FF00', '#C8FF33', '#65A30D', '#22c55e', '#fbbf24', '#f97316'],
  };
  confetti({ ...defaults, particleCount: 50, origin: { x: 0.3, y: 0.6 } });
  confetti({ ...defaults, particleCount: 50, origin: { x: 0.7, y: 0.6 } });
};

export const Register: React.FC = () => {
  const { addToast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setProfile(await userService.getUserProfile());
      setError('');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not load your registration status.'));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRegister = async () => {
    try {
      const msg = await userService.registerForHackathon();
      await load();
      celebrate();
      soundSuccess();
      addToast(msg || "You're registered for the hackathon!", 'success');
    } catch (err) {
      soundWarning();
      addToast(getApiErrorMessage(err, 'Registration failed.'), 'error');
    }
  };

  if (!profile && !error) return <LoadingState message="Loading your registration..." fullScreen />;

  const registered = profile?.registrationStatus === 'Confirmed';

  return (
    <div className="pt-6 sm:pt-12 pb-32 sm:pb-16 bg-[var(--bg-main)] min-h-[calc(100vh-160px)] transition-colors">
      <Container size="md" className="w-full">
        <SectionHeading
          badge="HACKATHON REGISTRATION"
          title={registered ? "You're registered!" : 'Register for Compute 50'}
          subtitle={
            registered
              ? 'Join the participants WhatsApp group below — all further updates will be shared there.'
              : 'Register individually — no team needed. Team formation opens after registrations close.'
          }
        />

        {error ? (
          <p className="text-center text-sm font-mono text-red-500">{error}</p>
        ) : (
          profile && (
            <div className="space-y-6">
              {!hasProfilePhoto(profile.user.profilePhoto) && (
                <ProfilePhotoCard onUploaded={load} />
              )}
              <StatusCards
                registrationStatus={profile.registrationStatus}
                paymentStatus={profile.paymentStatus}
                onRegister={handleRegister}
                hackathon={profile.hackathon}
                user={profile.user}
                onFeeUpdated={load}
                photoOk={hasProfilePhoto(profile.user.profilePhoto)}
              />
              <WhatsAppGroupCard registered={registered} />
            </div>
          )
        )}

        <p className="text-xs text-[var(--text-secondary)] text-center pt-8 mt-8 border-t border-[var(--border-color)]">
          View your details anytime on your{' '}
          <Link to="/profile" className="text-[var(--accent)] hover:text-[var(--accent-hover)] hover:underline font-bold">
            Profile
          </Link>
          , or contact the CSEA helpdesk.
        </p>
      </Container>
    </div>
  );
};

export default Register;