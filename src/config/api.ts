const trim = (url: string) => url.replace(/\/+$/, '');

const runtimeEnv: Record<string, string | undefined> =
  (typeof window !== 'undefined' && (window as unknown as { __ENV__?: Record<string, string> }).__ENV__) || {};

const env = (name: string, buildValue: string | undefined): string | undefined => {
  const value = runtimeEnv[name];
  return value !== undefined && value !== '' ? value : buildValue;
};

const GATEWAY = trim(env('VITE_API_BASE_URL', import.meta.env.VITE_API_BASE_URL) || 'http://localhost:5000');

export const API_CONFIG = {

  authBaseUrl: trim(env('VITE_AUTH_API_URL', import.meta.env.VITE_AUTH_API_URL) || GATEWAY),

  eventBaseUrl: trim(env('VITE_EVENT_API_URL', import.meta.env.VITE_EVENT_API_URL) || GATEWAY),
  paymentEventKey: (env('VITE_PAYMENT_EVENT_KEY', import.meta.env.VITE_PAYMENT_EVENT_KEY) || '').trim(),

  hackathonEventId: env('VITE_HACKATHON_EVENT_ID', import.meta.env.VITE_HACKATHON_EVENT_ID) || '',

  requireGeneralFee: (env('VITE_REQUIRE_GENERAL_FEE', import.meta.env.VITE_REQUIRE_GENERAL_FEE) ?? 'true') === 'true',

  sendBearer: (env('VITE_SEND_BEARER', import.meta.env.VITE_SEND_BEARER) ?? 'false') === 'true',

  profileEditEnabled: (env('VITE_PROFILE_EDIT', import.meta.env.VITE_PROFILE_EDIT) ?? 'false') === 'true',

  participantWhatsappUrl: env('VITE_PARTICIPANT_WHATSAPP_URL', import.meta.env.VITE_PARTICIPANT_WHATSAPP_URL) || '',

  paymentPortalUrl: env('VITE_PAYMENT_PORTAL_URL', import.meta.env.VITE_PAYMENT_PORTAL_URL) || '',

  timeoutMs: 15000,
} as const;

export const googleOAuthUrl = () => `${API_CONFIG.authBaseUrl}/api/auth/user/google`;

export const fileUrl = (fileNameOrPath: string) =>
  fileNameOrPath.startsWith('http')
    ? fileNameOrPath
    : fileNameOrPath.startsWith('/api/')
    ? `${API_CONFIG.authBaseUrl}${fileNameOrPath}`
    : `${API_CONFIG.authBaseUrl}/api/auth/files/${encodeURIComponent(fileNameOrPath)}`;