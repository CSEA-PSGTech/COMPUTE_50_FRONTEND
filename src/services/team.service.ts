import { User } from '../types/auth';
import { HackathonTeam, TeamMember } from '../types/user';

const STORAGE_KEY = 'compute50_teams';
const TEAM_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const readTeams = (): HackathonTeam[] => {
  try {
    const storedTeams = localStorage.getItem(STORAGE_KEY);
    return storedTeams ? JSON.parse(storedTeams) as HackathonTeam[] : [];
  } catch {
    return [];
  }
};

const saveTeams = (teams: HackathonTeam[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
};

const toMember = (user: User, role: TeamMember['role']): TeamMember => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  rollNumber: user.rollNumber,
  role,
  college: user.college,
});

const createCode = () => {
  const values = crypto.getRandomValues(new Uint8Array(6));
  const suffix = Array.from(values, (value) => TEAM_CODE_ALPHABET[value % TEAM_CODE_ALPHABET.length]).join('');
  return `C50-${suffix}`;
};

const findTeamForUser = (teams: HackathonTeam[], user: User) => {
  const email = user.email.trim().toLowerCase();
  return teams.find((team) =>
    team.members.some((member) => member.id === user.id || member.email.trim().toLowerCase() === email),
  );
};

export const teamService = {
  getTeamForUser: async (user: User): Promise<HackathonTeam | undefined> => {
    return findTeamForUser(readTeams(), user);
  },

  createTeam: async (name: string, user: User): Promise<HackathonTeam> => {
    const teamName = name.trim();
    if (!teamName) throw new Error('Enter a team name.');

    const teams = readTeams();
    if (findTeamForUser(teams, user)) throw new Error('You already belong to a team.');

    let code = createCode();
    while (teams.some((team) => team.code === code)) code = createCode();

    const team: HackathonTeam = {
      id: `team_${code.toLowerCase()}`,
      name: teamName,
      code,
      leaderId: user.id,
      members: [toMember(user, 'Leader')],
      maxMembers: 4,
    };

    saveTeams([...teams, team]);
    return team;
  },

  joinTeam: async (rawCode: string, user: User): Promise<HackathonTeam> => {
    const code = rawCode.trim().toUpperCase().replace(/\s+/g, '');
    if (!code) throw new Error('Enter the team ID.');

    const teams = readTeams();
    if (findTeamForUser(teams, user)) throw new Error('You already belong to a team.');

    const teamIndex = teams.findIndex((team) => team.code.toUpperCase() === code);
    if (teamIndex < 0) throw new Error('We could not find a team with that ID. Check the code and try again.');

    const team = teams[teamIndex];
    if (team.members.length >= team.maxMembers) throw new Error('This team is full. Teams can have up to 4 members.');

    const duplicateEmail = team.members.some(
      (member) => member.email.trim().toLowerCase() === user.email.trim().toLowerCase(),
    );
    if (duplicateEmail) throw new Error('This account is already a member of that team.');

    const updatedTeam = { ...team, members: [...team.members, toMember(user, 'Member')] };
    teams[teamIndex] = updatedTeam;
    saveTeams(teams);
    return updatedTeam;
  },
};
