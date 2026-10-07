export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  rollNumber?: string;
  teamId?: string;
  role?: 'user' | 'leader' | 'admin';
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  rollNumber?: string;
  password?: string;
  teamMembers?: Array<{
    name: string;
    rollNumber: string;
    email: string;
    phone: string;
    college: string;
    role: 'Leader' | 'Member';
  }>;
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
