import { authApi, setAccessToken } from './api';
import { mapProfileToUser, buildProfileUpdate, yearToNumber } from './mappers';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '../types/auth';
import type { BackendAuthResponse, BackendProfile } from '../types/backend';
import { googleOAuthUrl } from '../config/api';

const BASE = '/api/auth/user';

const handleAuthResponse = (data: BackendAuthResponse): AuthResponse => {
  setAccessToken(data.accessToken);
  return { user: mapProfileToUser(data.user), token: data.accessToken };
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await authApi.post<BackendAuthResponse>(`${BASE}/login`, credentials);
    return handleAuthResponse(data);
  },

  sendVerificationEmail: async (email: string): Promise<string> => {
    const { data } = await authApi.post<{ message: string }>(`${BASE}/verify-email`, { email });
    return data.message;
  },

  verifyEmailToken: async (token: string): Promise<{ email: string }> => {
    const { data } = await authApi.get<{ message: string; email: string }>(
      `${BASE}/verify-email/${encodeURIComponent(token)}`
    );
    return { email: data.email };
  },

  register: async (input: RegisterData): Promise<AuthResponse> => {
    const source = input.source ?? 'email';
    const { data } = await authApi.post<BackendAuthResponse>(`${BASE}/register`, {
      email: input.email,
      source,
      ...(source === 'google' ? { googleId: input.googleId } : { password: input.password }),
      name: input.name,
      phone: input.phone,
      college: input.college,
      department: input.department,
      year: yearToNumber(input.year),
      referral: input.referral,
      accomodation: input.accommodation,
      discoveryMethod: input.discoveryMethod,
    });
    return handleAuthResponse(data);
  },

  startGoogleLogin: () => {
    window.location.href = googleOAuthUrl();
  },

  completeGoogleLogin: async (email: string, googleId: string): Promise<AuthResponse> => {
    const { data } = await authApi.post<BackendAuthResponse>(`${BASE}/login-google`, {
      email,
      googleId,
      existing_user: true,
    });
    return handleAuthResponse(data);
  },

  forgotPassword: async (email: string): Promise<string> => {
    const { data } = await authApi.post<{ message: string }>(`${BASE}/forgot-password`, { email });
    return data.message;
  },

  resetPassword: async (token: string, newPassword: string): Promise<string> => {
    const { data } = await authApi.post<{ message: string }>(`${BASE}/reset-password`, { token, newPassword });
    return data.message;
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      const { data } = await authApi.get<{ user: BackendProfile }>(`${BASE}/profile`);
      return mapProfileToUser(data.user);
    } catch {
      return null;
    }
  },

  getProfile: async (): Promise<User> => {
    const { data } = await authApi.get<{ user: BackendProfile }>(`${BASE}/profile`);
    return mapProfileToUser(data.user);
  },

  updateProfile: async (current: User, changes: Partial<User>): Promise<User> => {
    const { data } = await authApi.put<{ user: BackendProfile }>(
      `${BASE}/profile`,
      buildProfileUpdate(current, changes)
    );

    return { ...current, ...changes, ...mapProfileToUser({ ...data.user, email: data.user.email || current.email }) };
  },

  uploadProfilePhoto: async (file: File): Promise<string> => {
    const form = new FormData();
    form.append('profilePhoto', file);
    const { data } = await authApi.post<{ profilePhoto: string }>(`${BASE}/profile-photo`, form);
    return data.profilePhoto;
  },

  uploadIdCard: async (file: File): Promise<string> => {
    const form = new FormData();
    form.append('idCard', file);
    const { data } = await authApi.post<{ idCardUrl: string }>(`${BASE}/id-card`, form);
    return data.idCardUrl;
  },

  logout: async (): Promise<void> => {
    try {
      await authApi.post(`${BASE}/logout`);
    } finally {
      setAccessToken(null);

      ['compute50_auth_token', 'compute50_user', 'compute50_profile'].forEach((k) => localStorage.removeItem(k));
    }
  },
};