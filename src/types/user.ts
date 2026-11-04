import { User } from './auth';
import type { BackendPaymentReceipt } from './backend';

export type RegistrationStatus = 'Pending' | 'Confirmed' | 'Waitlisted' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Paid' | 'Not Applicable' | 'Failed';
export type AccommodationStatus = 'Not Requested' | 'Pending' | 'Confirmed' | 'Declined';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  rollNumber?: string;
  role: 'Leader' | 'Member';
  college: string;
  department?: string;
  year?: string;
}

export interface HackathonTeam {
  id: string;
  name: string;
  code: string;
  leaderId: string;
  trackId?: string;
  members: TeamMember[];
  maxMembers: number;
}

export interface UserProfile {
  user: User;
  registrationStatus: RegistrationStatus;
  paymentStatus: PaymentStatus;
  accommodationStatus: AccommodationStatus;
  receiptUrl?: string;
  team?: HackathonTeam;
  feeReceipt?: BackendPaymentReceipt;
  hackathon?: {
    exists: boolean;
    closed: boolean;
    registered: boolean;
    eventName?: string;
    teamSize?: number;
  };
}