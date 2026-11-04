import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../components/common/Container';
import { SectionHeading } from '../components/common/SectionHeading';
import { PersonalDetails } from '../components/profile/PersonalDetails';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { TeamSection } from '../components/profile/TeamSection';
import { StatusCards } from '../components/profile/StatusCards';
import { ProfileSkeleton } from '../components/common/Skeleton';
import { PullToRefresh } from '../components/common/PullToRefresh';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { userService } from '../services/user.service';
import { UserProfile } from '../types/user';
import { User } from '../types/auth';
import { getApiErrorMessage } from '../services/api';
import { LogOut } from 'lucide-react';

export const Profile: React.FC = () => {
  const { logout, updateUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const fetchProfileData = useCallback(async () => {
    try {
      const data = await userService.getUserProfile();
      setProfile(data);
    } catch (err) {
      console.error('Failed to load profile:', err);
      addToast('Failed to load profile data.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleRefresh = async () => {
    await fetchProfileData();
    addToast('Profile data refreshed!', 'info');
  };

  const handleLogout = async () => {
    navigate('/', { replace: true });
    await logout();
    addToast('Logged out successfully.', 'info');

  };

  const handleSaveProfile = async (updatedData: Partial<User>) => {
    if (profile) {
      try {
        const updatedUser = await userService.updateUserProfile(profile.user, updatedData);
        updateUser(updatedUser);
        setProfile({ ...profile, user: { ...profile.user, ...updatedUser } });
        addToast('Profile updated successfully!', 'success');
      } catch (err) {
        addToast(getApiErrorMessage(err, 'Failed to update profile.'), 'error');
      }
    }
  };

  const handleRegisterHackathon = async () => {
    try {
      const msg = await userService.registerForHackathon();
      addToast(msg || 'Registered for the hackathon!', 'success');
      await fetchProfileData();
    } catch (err) {
      addToast(getApiErrorMessage(err, 'Registration failed.'), 'error');
    }
  };

  const handleCreateTeam = async (teamName: string) => {
    if (profile) {
      try {
        const newTeam = await userService.createTeam(teamName, profile.user);
        setProfile({ ...profile, team: newTeam });
        addToast(`Team "${teamName}" created successfully!`, 'success');
      } catch (err) {
        addToast(getApiErrorMessage(err, 'Failed to create team.'), 'error');
      }
    }
  };

  if (loading || !profile) {
    return <ProfileSkeleton />;
  }

  const content = (
    <div className="py-16 bg-[var(--bg-main)] min-h-screen">
      <Container size="lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-[var(--border-color)] pb-6">
          <div>
            <SectionHeading
              badge="DASHBOARD"
              title="Participant Profile"
              subtitle="Manage your personal details, team composition, and registration status."
              align="left"
              className="mb-0 max-w-xl"
            />
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={handleLogout}
            leftIcon={<LogOut className="w-4 h-4" />}
          >
            Logout
          </Button>
        </div>

        <div className="space-y-8">
          <PersonalDetails
            user={profile.user}
            onEdit={() => setIsEditModalOpen(true)}
            onPhotoChange={(url) => {
              const updated = { ...profile.user, profilePhoto: url };
              setProfile({ ...profile, user: updated });
              updateUser(updated);
            }}
          />
          <StatusCards registrationStatus={profile.registrationStatus} paymentStatus={profile.paymentStatus}
            onRegister={handleRegisterHackathon}
            hackathon={profile.hackathon}
          />
          <TeamSection team={profile.team} onCreateTeam={handleCreateTeam} />
        </div>

        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={profile.user}
          onSave={handleSaveProfile}
        />
      </Container>
    </div>
  );

  return (
    <>

      <div className="block md:hidden">
        <PullToRefresh onRefresh={handleRefresh}>{content}</PullToRefresh>
      </div>

      <div className="hidden md:block">{content}</div>
    </>
  );
};

export default Profile;