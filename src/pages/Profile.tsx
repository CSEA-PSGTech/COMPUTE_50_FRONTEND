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
import { LogOut } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const fetchProfileData = useCallback(async () => {
    try {
      const data = await userService.getUserProfile();
      if (user) {
        data.user = user;
      }
      setProfile(data);
    } catch (err) {
      console.error('Failed to load profile:', err);
      addToast('Failed to load profile data.', 'error');
    } finally {
      setLoading(false);
    }
  }, [user, addToast]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleRefresh = async () => {
    await fetchProfileData();
    addToast('Profile data refreshed!', 'info');
  };

  const handleLogout = async () => {
    await logout();
    addToast('Logged out successfully.', 'info');
    navigate('/');
  };

  const handleSaveProfile = async (updatedData: Partial<User>) => {
    if (profile) {
      try {
        const updatedUser = await userService.updateUserProfile(updatedData);
        updateUser(updatedUser);
        setProfile({ ...profile, user: updatedUser });
        addToast('Profile updated successfully!', 'success');
      } catch {
        addToast('Failed to update profile.', 'error');
      }
    }
  };

  const handleCreateTeam = async (teamName: string) => {
    if (profile) {
      try {
        const newTeam = await userService.createTeam(teamName);
        setProfile({ ...profile, team: newTeam });
        addToast(`Team "${teamName}" created successfully!`, 'success');
      } catch {
        addToast('Failed to create team.', 'error');
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
          <PersonalDetails user={profile.user} onEdit={() => setIsEditModalOpen(true)} />
          <StatusCards registrationStatus={profile.registrationStatus} />
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
      {/* Mobile: pull-to-refresh wrapping */}
      <div className="block md:hidden">
        <PullToRefresh onRefresh={handleRefresh}>{content}</PullToRefresh>
      </div>
      {/* Desktop: regular rendering */}
      <div className="hidden md:block">{content}</div>
    </>
  );
};

export default Profile;
