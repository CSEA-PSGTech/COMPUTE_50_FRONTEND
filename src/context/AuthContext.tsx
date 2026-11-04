import React, { createContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData } from '../types/auth';
import { authService } from '../services/auth.service';
import { getAccessToken, setUnauthorizedHandler } from '../services/api';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;

  register: (data: RegisterData) => Promise<void>;

  completeGoogleLogin: (email: string, googleId: string) => Promise<void>;
  logout: () => Promise<void>;

  refreshUser: () => Promise<User | null>;
  updateUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const authVersion = useRef(0);

  const refreshUser = useCallback(async () => {
    const version = authVersion.current;
    const current = await authService.getCurrentUser();
    if (version !== authVersion.current) return current;
    setUser(current);
    setToken(getAccessToken());
    return current;
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      setToken(null);
    });
    refreshUser()
      .catch((err) => console.error('Auth initialization error:', err))
      .finally(() => setIsLoading(false));
    return () => setUnauthorizedHandler(null);
  }, [refreshUser]);

  const applyLogin = async (promise: Promise<{ user: User; token: string }>) => {
    const res = await promise;
    authVersion.current += 1;
    setToken(res.token);
    setUser(res.user);

    authService
      .getProfile()
      .then(setUser)
      .catch(() => undefined);
  };

  const login = (credentials: LoginCredentials) => applyLogin(authService.login(credentials));
  const register = (data: RegisterData) => applyLogin(authService.register(data));
  const completeGoogleLogin = (email: string, googleId: string) =>
    applyLogin(authService.completeGoogleLogin(email, googleId));

  const logout = async () => {
    authVersion.current += 1;
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout request failed (clearing local session anyway):', err);
    } finally {
      setUser(null);
      setToken(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        completeGoogleLogin,
        logout,
        refreshUser,
        updateUser: setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};