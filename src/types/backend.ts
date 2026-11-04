export interface BackendAuthUserSummary {
  uniqueId: string;
  email: string;
  name?: string;
  verified: boolean;
}

export interface BackendAuthResponse {
  message: string;
  user: BackendAuthUserSummary;
  accessToken: string;
  refreshToken: string;
}

export interface BackendProfile {
  uniqueId: string;
  email: string;
  name?: string;
  phone?: string;
  college?: string;
  department?: string;
  year?: number;
  isPSGStudent?: boolean;
  referral?: string;
  accomodation?: boolean;
  profilePhoto?: string;
  verified?: boolean;
  generalFeePaid?: boolean;
  discoveryMethod?: string;
  source?: 'email' | 'google';
  lastVisited?: string;
  idCardUrl?: string;
  kit?: boolean;
}

export interface BackendRegisterBody {
  email: string;
  password?: string;
  googleId?: string;
  source: 'email' | 'google';
  name?: string;
  phone?: string;
  college?: string;
  department?: string;
  year?: number;
  referral?: string;
  accomodation?: boolean;
  discoveryMethod?: string;
}

export interface BackendProfileUpdateBody {
  name?: string;
  phone?: string;
  college?: string;
  department?: string;
  year?: number;
  isPSGStudent?: boolean;
  referral?: string;
  accomodation?: boolean;
  discoveryMethod?: string;
}

export interface BackendRound {
  title: string;
  description: string;
}
export interface BackendContact {
  name: string;
  mobile: string;
}

export interface BackendEvent {
  eventId: string;
  eventName: string;
  category: string;
  oneLineDescription?: string;
  description: string;
  rounds?: BackendRound[];
  contacts: BackendContact[];
  hall: string;
  eventRules?: string;
  teamSize: number;
  date?: string;
  closed?: boolean;
  timing?: string;
}

export type BackendPaymentStatus = 'SUCCESS' | 'ERROR' | 'PENDING' | 'FAILED' | string;

export interface BackendPaymentRecord {
  transactionId?: string;
  transid?: string;
  uniqueId?: string;
  email?: string;
  eventId?: string;
  fee?: number;
  amount?: number;
  status?: BackendPaymentStatus;
  createdAt?: string;
  [key: string]: unknown;
}

export interface BackendRedirectPayload {
  eventId?: string;
  success?: boolean;
  error?: string;
  status?: BackendPaymentStatus;
  transactionId?: string;
  [key: string]: unknown;
}