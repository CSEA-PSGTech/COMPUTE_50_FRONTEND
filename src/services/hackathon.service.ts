import { mockTracks } from '../data/tracks';
import { mockSpeakers } from '../data/speakers';
import { mockSponsors } from '../data/sponsors';
import { mockEvents } from '../data/events';
import { mockFaqs } from '../data/faqs';
import { mockSchedule } from '../data/schedule';
import { mockClubs } from '../data/clubs';
import axios from 'axios';
import { eventApi } from './api';
import { API_CONFIG } from '../config/api';
import type { BackendEvent } from '../types/backend';
import { Track, Speaker, Sponsor, EventItem, FAQItem, ScheduleItem, ClubItem } from '../types/hackathon';

export const hackathonService = {
  getTracks: async (): Promise<Track[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockTracks;
  },

  getSpeakers: async (): Promise<Speaker[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockSpeakers;
  },

  getSponsors: async (): Promise<Sponsor[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockSponsors;
  },

  getEvents: async (): Promise<EventItem[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockEvents;
  },

  getFaqs: async (): Promise<FAQItem[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockFaqs;
  },

  getSchedule: async (): Promise<ScheduleItem[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockSchedule;
  },

  getClubs: async (): Promise<ClubItem[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockClubs;
  },

  getHackathonEvent: async (): Promise<BackendEvent> => {
    const { data } = await eventApi.get(`/api/events/${hackathonId()}`);
    return data.event as BackendEvent;
  },

  isRegistrationClosed: async (): Promise<boolean> => {
    const { data } = await eventApi.get(`/api/events/${hackathonId()}/isclosed`);
    return data?.event?.closed === true;
  },

  isRegistered: async (): Promise<boolean> => {
    const { data } = await eventApi.get(`/api/events/registrations/${hackathonId()}`);
    return data?.registered === true;
  },

  getStatus: async (): Promise<HackathonStatus> => {
    if (!API_CONFIG.hackathonEventId) return { exists: false, closed: false, registered: false };
    let event: { eventName?: string; closed?: boolean; teamSize?: number };
    try {
      const { data } = await eventApi.get(`/api/events/${hackathonId()}`);
      event = data.event;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return { exists: false, closed: false, registered: false };
      }
      throw err;
    }
    const registered = await hackathonService.isRegistered().catch(() => false);
    return {
      exists: true,
      closed: event?.closed === true,
      registered,
      eventName: event?.eventName,
      teamSize: event?.teamSize,
    };
  },

  register: async (): Promise<string> => {
    const { data } = await eventApi.post(`/api/events/${hackathonId()}/register`);
    return data?.message ?? 'Registered for the hackathon!';
  },
};

export interface HackathonStatus {
  exists: boolean;
  closed: boolean;
  registered: boolean;
  eventName?: string;
  teamSize?: number;
}

function hackathonId(): string {
  if (!API_CONFIG.hackathonEventId) throw new Error('VITE_HACKATHON_EVENT_ID is not configured.');
  return encodeURIComponent(API_CONFIG.hackathonEventId);
}