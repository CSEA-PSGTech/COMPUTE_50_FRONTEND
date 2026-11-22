import { eventApi } from './api';
import { API_CONFIG } from '../config/api';

export interface TeamSettings {
  eventId: string;
  eventName?: string;
  open: boolean;
  minSize: number;
  maxSize: number;
}

export interface TeamMember {
  uniqueId: string;
  isLeader: boolean;
  name?: string;
  college?: string;
  department?: string;
  year?: number;
}

export interface Team {
  _id: string;
  eventId: string;
  teamName: string;
  leaderId: string;
  isLeader?: boolean;
  members: TeamMember[];
}

export interface AvailableUser {
  uniqueId: string;
  name?: string;
  college?: string;
}

const base = () => {
  if (!API_CONFIG.hackathonEventId) throw new Error('VITE_HACKATHON_EVENT_ID is not configured.');
  return `/api/events/teams/${encodeURIComponent(API_CONFIG.hackathonEventId)}`;
};

export const teamService = {
  getMine: async (): Promise<{ settings: TeamSettings; team: Team | null }> => {
    const { data } = await eventApi.get(`${base()}/me`);
    return { settings: data.settings, team: data.team ?? null };
  },

  create: async (teamName: string): Promise<Team> => {
    const { data } = await eventApi.post(base(), { teamName });
    return data.team;
  },

  rename: async (teamName: string): Promise<Team> => {
    const { data } = await eventApi.patch(`${base()}/me`, { teamName });
    return data.team;
  },

  addMember: async (uniqueId: string): Promise<Team> => {
    const { data } = await eventApi.post(`${base()}/me/members`, { uniqueId });
    return data.team;
  },

  removeMember: async (uniqueId: string): Promise<Team> => {
    const { data } = await eventApi.delete(`${base()}/me/members/${encodeURIComponent(uniqueId)}`);
    return data.team;
  },

  makeLeader: async (uniqueId: string): Promise<Team> => {
    const { data } = await eventApi.post(`${base()}/me/leader`, { uniqueId });
    return data.team;
  },

  leave: async (): Promise<void> => {
    await eventApi.post(`${base()}/me/leave`);
  },

  remove: async (): Promise<void> => {
    await eventApi.delete(`${base()}/me`);
  },

  available: async (search: string): Promise<AvailableUser[]> => {
    const { data } = await eventApi.get(`${base()}/available`, { params: search ? { search } : undefined });
    return data.users ?? [];
  },
};