const trim = (url: string) => url.replace(/\/+$/, '');

const GATEWAY = trim(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');

export const API_CONFIG = {

  authBaseUrl: trim(import.meta.env.VITE_AUTH_API_URL || GATEWAY),

  eventBaseUrl: trim(import.meta.env.VITE_EVENT_API_URL || GATEWAY),
  paymentEventKey: (import.meta.env.VITE_PAYMENT_EVENT_KEY || '').trim(),

  hackathonEventId: import.meta.env.VITE_HACKATHON_EVENT_ID || '',

  requireGeneralFee: (import.meta.env.VITE_REQUIRE_GENERAL_FEE ?? 'true') === 'true',

  sendBearer: (import.meta.env.VITE_SEND_BEARER ?? 'false') === 'true',

  profileEditEnabled: (import.meta.env.VITE_PROFILE_EDIT ?? 'false') === 'true',

  participantWhatsappUrl: import.meta.env.VITE_PARTICIPANT_WHATSAPP_URL || '',

  paymentPortalUrl: import.meta.env.VITE_PAYMENT_PORTAL_URL || '',

  timeoutMs: 15000,
} as const;

export const googleOAuthUrl = () => `${API_CONFIG.authBaseUrl}/api/auth/user/google`;

export const fileUrl = (fileNameOrPath: string) =>
  fileNameOrPath.startsWith('http')
    ? fileNameOrPath
    : fileNameOrPath.startsWith('/api/')
    ? `${API_CONFIG.authBaseUrl}${fileNameOrPath}`
    : `${API_CONFIG.authBaseUrl}/api/auth/files/${encodeURIComponent(fileNameOrPath)}`;