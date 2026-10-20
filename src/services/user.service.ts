import { UserProfile, HackathonTeam } from '../types/user';
import { User } from '../types/auth';

const MOCK_PROFILE: UserProfile = {
  user: {
    id: 'usr_mock_123',
    name: 'Alex Rivera',
    email: 'alex.rivera@psgtech.ac.in',
    phone: '+91 9876543210',
    college: 'PSG College of Technology',
    department: 'Computer Science and Engineering',
    year: '3rd Year',
    role: 'leader',
    teamId: 'team_c50_001',
  },
  registrationStatus: 'Confirmed',
  paymentStatus: 'Paid',
  accommodationStatus: 'Confirmed',
  receiptUrl: '#',
  team: {
    id: 'team_c50_001',
    name: 'CyberPunks 50',
    code: 'C50-TEAM-8942',
    leaderId: 'usr_mock_123',
    trackId: 'track-1',
    maxMembers: 4,
    members: [
      {
        id: 'usr_mock_123',
        name: 'Alex Rivera',
        email: 'alex.rivera@psgtech.ac.in',
        role: 'Leader',
        college: 'PSG College of Technology',
      },
      {
        id: 'usr_mock_124',
        name: 'Samantha Lee',
        email: 'sam.lee@psgtech.ac.in',
        role: 'Member',
        college: 'PSG College of Technology',
      },
      {
        id: 'usr_mock_125',
        name: 'Rohan Sharma',
        email: 'rohan.s@psgtech.ac.in',
        role: 'Member',
        college: 'PSG College of Technology',
      },
    ],
  },
};

export const userService = {
  getUserProfile: async (): Promise<UserProfile> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const saved = localStorage.getItem('compute50_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return MOCK_PROFILE;
  },

  updateUserProfile: async (updatedData: Partial<User>): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const current = MOCK_PROFILE.user;
    const newUser = { ...current, ...updatedData };
    localStorage.setItem('compute50_user', JSON.stringify(newUser));
    return newUser;
  },

  createTeam: async (teamName: string, leaderData?: Partial<User>): Promise<HackathonTeam> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const teamCode = 'C50-' + Math.floor(1000 + Math.random() * 9000);
    const leaderUser = leaderData || MOCK_PROFILE.user;

    const newTeam: HackathonTeam = {
      id: 'team_' + Date.now(),
      name: teamName,
      code: teamCode,
      leaderId: leaderUser.id || 'usr_mock_123',
      maxMembers: 4,
      members: [
        {
          id: leaderUser.id || 'usr_' + Date.now(),
          name: leaderUser.name || 'Team Leader',
          email: leaderUser.email || 'leader@psgtech.ac.in',
          phone: leaderUser.phone,
          rollNumber: leaderUser.rollNumber,
          role: 'Leader',
          college: leaderUser.college || 'PSG College of Technology',
          department: leaderUser.department,
          year: leaderUser.year,
        },
      ],
    };

    // Store team in localStorage
    const storedTeams: Record<string, HackathonTeam> = JSON.parse(
      localStorage.getItem('compute50_teams') || '{}'
    );
    storedTeams[teamCode.toUpperCase()] = newTeam;
    localStorage.setItem('compute50_teams', JSON.stringify(storedTeams));

    // Update active profile
    const currentProfile: UserProfile = {
      ...MOCK_PROFILE,
      user: { ...MOCK_PROFILE.user, ...leaderUser, role: 'leader', teamId: newTeam.id },
      team: newTeam,
      registrationStatus: 'Confirmed',
    };
    localStorage.setItem('compute50_profile', JSON.stringify(currentProfile));
    localStorage.setItem('compute50_user', JSON.stringify(currentProfile.user));

    return newTeam;
  },

  joinTeam: async (
    teamCode: string,
    memberData: {
      name: string;
      email: string;
      phone: string;
      college: string;
      department: string;
      year: string;
      rollNumber: string;
    }
  ): Promise<HackathonTeam> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const cleanCode = teamCode.trim().toUpperCase();

    // Check stored teams or mock profile
    const storedTeams: Record<string, HackathonTeam> = JSON.parse(
      localStorage.getItem('compute50_teams') || '{}'
    );

    let targetTeam: HackathonTeam | undefined = storedTeams[cleanCode];

    if (!targetTeam) {
      if (cleanCode === MOCK_PROFILE.team?.code.toUpperCase()) {
        targetTeam = { ...MOCK_PROFILE.team };
      } else {
        // Dynamically instantiate team if code is valid syntax
        targetTeam = {
          id: 'team_' + Date.now(),
          name: `Squad ${cleanCode}`,
          code: cleanCode,
          leaderId: 'usr_leader_auto',
          maxMembers: 4,
          members: [
            {
              id: 'usr_leader_auto',
              name: 'Team Captain',
              email: 'captain@psgtech.ac.in',
              role: 'Leader',
              college: memberData.college || 'PSG College of Technology',
            },
          ],
        };
      }
    }

    if (targetTeam.members.length >= targetTeam.maxMembers) {
      throw new Error(`Team ${targetTeam.name} is already full (maximum ${targetTeam.maxMembers} members).`);
    }

    // Add new member
    const newMemberId = 'usr_' + Date.now();
    targetTeam.members.push({
      id: newMemberId,
      name: memberData.name,
      email: memberData.email,
      phone: memberData.phone,
      rollNumber: memberData.rollNumber,
      college: memberData.college,
      department: memberData.department,
      year: memberData.year,
      role: 'Member',
    });

    storedTeams[cleanCode] = targetTeam;
    localStorage.setItem('compute50_teams', JSON.stringify(storedTeams));

    // Update active profile
    const currentProfile: UserProfile = {
      ...MOCK_PROFILE,
      user: {
        ...MOCK_PROFILE.user,
        id: newMemberId,
        name: memberData.name,
        email: memberData.email,
        phone: memberData.phone,
        college: memberData.college,
        department: memberData.department,
        year: memberData.year,
        rollNumber: memberData.rollNumber,
        role: 'user',
        teamId: targetTeam.id,
      },
      team: targetTeam,
      registrationStatus: 'Confirmed',
    };
    localStorage.setItem('compute50_profile', JSON.stringify(currentProfile));
    localStorage.setItem('compute50_user', JSON.stringify(currentProfile.user));

    return targetTeam;
  },
};
