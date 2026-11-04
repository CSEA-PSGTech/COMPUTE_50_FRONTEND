export const GOOGLE_REG_KEY = 'compute50_google_registration';

export const saveGoogleRegistration = (email: string, googleId: string) =>
  sessionStorage.setItem(GOOGLE_REG_KEY, JSON.stringify({ email, googleId }));

export const readGoogleRegistration = (): { email: string; googleId: string } | null => {
  try {
    return JSON.parse(sessionStorage.getItem(GOOGLE_REG_KEY) || 'null');
  } catch {
    return null;
  }
};