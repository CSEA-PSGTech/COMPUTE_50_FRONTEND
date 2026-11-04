import axios, { AxiosError, AxiosInstance } from 'axios';
import { API_CONFIG } from '../config/api';

let accessToken: string | null = null;
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};
export const getAccessToken = () => accessToken;

type UnauthorizedHandler = () => void;
let onUnauthorized: UnauthorizedHandler | null = null;

export const setUnauthorizedHandler = (handler: UnauthorizedHandler | null) => {
  onUnauthorized = handler;
};

const createClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    withCredentials: true,
    timeout: API_CONFIG.timeoutMs,
  });

  client.interceptors.request.use((config) => {
    (config as typeof config & { _sentToken?: string | null })._sentToken = accessToken;
    if (API_CONFIG.sendBearer && accessToken && config.headers && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type'];
    }
    return config;
  });

  client.interceptors.response.use(
    (res) => res,
    (error: AxiosError) => {
      const url = error.config?.url || '';

      const isAuthAttempt = /\/(login|login-google|register|onspot)$/.test(url);
      const sentToken = (error.config as { _sentToken?: string | null } | undefined)?._sentToken ?? null;
      const staleRequest = sentToken !== accessToken;
      if (error.response?.status === 401 && !isAuthAttempt && !staleRequest) {
        accessToken = null;
        onUnauthorized?.();
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const authApi = createClient(API_CONFIG.authBaseUrl);
export const eventApi = createClient(API_CONFIG.eventBaseUrl);
export const paymentApi = createClient(API_CONFIG.paymentBaseUrl);

export const apiClient = authApi;
export default apiClient;

export const getApiErrorMessage = (err: unknown, fallback = 'Something went wrong. Please try again.'): string => {
  if (axios.isAxiosError(err)) {
    if (!err.response) {
      return err.code === 'ECONNABORTED'
        ? 'The server took too long to respond.'
        : 'Cannot reach the server. Check your connection.';
    }
    const data = err.response.data as
      | {
          message?: string;
          error?: string | { message?: string; code?: number; keyPattern?: Record<string, unknown> };
          errors?: Array<string | { message?: string; path?: string[] }>;
        }
      | undefined;
    const mongoErr = typeof data?.error === 'object' ? data.error : undefined;
    if (mongoErr?.code === 11000) {
      const field = Object.keys(mongoErr.keyPattern ?? {})[0];
      const label = field === 'phone' ? 'phone number' : field === 'email' ? 'email' : field || 'value';
      return `This ${label} is already registered with another account.`;
    }
    const firstDetail = data?.errors?.[0];
    const detail =
      typeof firstDetail === 'string'
        ? firstDetail
        : firstDetail?.message
        ? `${firstDetail.path?.join('.') ? firstDetail.path.join('.') + ': ' : ''}${firstDetail.message}`
        : undefined;
    const errorField = typeof data?.error === 'string' ? data.error : data?.error?.message;
    if (data?.message && detail && data.message === 'Validation failed') return `${data.message} — ${detail}`;
    return data?.message || errorField || detail || fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
};