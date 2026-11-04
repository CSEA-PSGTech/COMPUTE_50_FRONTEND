export interface User {

  id: string;

  uniqueId: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  department: string;

  year: string;
  rollNumber?: string;
  teamId?: string;
  role?: 'user' | 'leader' | 'admin';

  verified?: boolean;
  isPSGStudent?: boolean;
  generalFeePaid?: boolean;
  accommodation?: boolean;
  referral?: string;
  discoveryMethod?: string;
  source?: 'email' | 'google';
  profilePhoto?: string;
  idCardUrl?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  source?: 'email' | 'google';
  password?: string;
  googleId?: string;
  phone?: string;
  college?: string;
  department?: string;
  year?: string;
  referral?: string;
  accommodation?: boolean;
  discoveryMethod?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}