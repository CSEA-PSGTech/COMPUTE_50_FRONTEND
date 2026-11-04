import { authService } from './auth.service';
import { hackathonService } from './hackathon.service';
import { API_CONFIG } from '../config/api';
import type { UserProfile, HackathonTeam, PaymentStatus, RegistrationStatus } from '../types/user';
import type { User } from '../types/auth';

const readLocalTeam = (): HackathonTeam | undefined => {
  try {
    return (JSON.parse(localStorage.getItem('compute50_profile') || 'null') as UserProfile | null)?.team;
  } catch {
    return undefined;
  }
};

const MOCK_PROFILE: UserProfile = {
  user: {
    id: 'usr_mock_123',
    uniqueId: 'usr_mock_123',
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
    const user = await authService.getProfile();

    const [receipts, hackathon] = await Promise.all([
      authService.getPaymentReceipts().catch(() => []),
      hackathonService
        .getStatus()
        .catch(() => ({ exists: true, closed: false, registered: false })),
    ]);

    const feeReceipt = receipts.find((r) => r.type === 'STUDENT');
    let paymentStatus: PaymentStatus;
    if (user.generalFeePaid) paymentStatus = 'Paid';
    else paymentStatus = API_CONFIG.requireGeneralFee ? 'Pending' : 'Not Applicable';

    const registrationStatus: RegistrationStatus = hackathon.registered ? 'Confirmed' : 'Pending';

    return {
      user,
      registrationStatus,
      paymentStatus,
      accommodationStatus: user.accommodation ? 'Pending' : 'Not Requested',
      team: readLocalTeam(),
      feeReceipt,
      hackathon,
    };
  },

  updateUserProfile: async (current: User, changes: Partial<User>): Promise<User> =>
    authService.updateProfile(current, changes),

  registerForHackathon: async (): Promise<string> => {
    return hackathonService.register();
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

    const storedTeams: Record<string, HackathonTeam> = JSON.parse(
      localStorage.getItem('compute50_teams') || '{}'
    );
    storedTeams[teamCode.toUpperCase()] = newTeam;
    localStorage.setItem('compute50_teams', JSON.stringify(storedTeams));

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

    const storedTeams: Record<string, HackathonTeam> = JSON.parse(
      localStorage.getItem('compute50_teams') || '{}'
    );

    let targetTeam: HackathonTeam | undefined = storedTeams[cleanCode];

    if (!targetTeam) {
      if (cleanCode === MOCK_PROFILE.team?.code.toUpperCase()) {
        targetTeam = { ...MOCK_PROFILE.team };
      } else {

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