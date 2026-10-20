import { UserProfile } from '../types/user';
import { User } from '../types/auth';
import { teamService } from './team.service';

export const userService = {
  getUserProfile: async (user?: User): Promise<UserProfile> => {
    const currentUser = user ?? JSON.parse(localStorage.getItem('compute50_user') || 'null') as User | null;
    if (!currentUser) throw new Error('A signed-in user is required to load the profile.');

    const team = await teamService.getTeamForUser(currentUser);
    return {
      user: currentUser,
      registrationStatus: 'Pending',
      paymentStatus: 'Not Applicable',
      accommodationStatus: 'Not Requested',
      team,
    };
  },

  updateUserProfile: async (updatedData: Partial<User>): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const current = JSON.parse(localStorage.getItem('compute50_user') || 'null') as User | null;
    if (!current) throw new Error('A signed-in user is required to update the profile.');
    const newUser = { ...current, ...updatedData };
    localStorage.setItem('compute50_user', JSON.stringify(newUser));
    return newUser;
  },
};
