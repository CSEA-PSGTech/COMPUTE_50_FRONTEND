import type { User } from '../types/auth';
import type { BackendAuthUserSummary, BackendProfile, BackendProfileUpdateBody } from '../types/backend';

export const YEAR_LABELS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  'Postgraduate (M.E. / M.Tech / MCA)',
] as const;

export const yearToNumber = (label?: string): number | undefined => {
  if (!label) return undefined;
  const idx = YEAR_LABELS.indexOf(label as (typeof YEAR_LABELS)[number]);
  if (idx >= 0) return idx + 1;
  const n = parseInt(label, 10);
  return Number.isFinite(n) ? n : undefined;
};

export const yearToLabel = (year?: number | string): string => {
  if (year === undefined || year === null || year === '') return '';
  const n = typeof year === 'number' ? year : parseInt(year, 10);
  return YEAR_LABELS[n - 1] ?? String(year);
};

export const mapProfileToUser = (p: BackendProfile | BackendAuthUserSummary): User => {
  const full = p as BackendProfile;
  return {
    id: p.uniqueId,
    uniqueId: p.uniqueId,
    name: p.name || p.email.split('@')[0],
    email: p.email,
    phone: full.phone || '',
    college: full.college || '',
    department: full.department || '',
    year: yearToLabel(full.year),
    verified: p.verified,
    isPSGStudent: full.isPSGStudent,
    generalFeePaid: full.generalFeePaid,
    accommodation: full.accomodation,
    referral: full.referral,
    discoveryMethod: full.discoveryMethod,
    source: full.source,
    profilePhoto: full.profilePhoto,
    idCardUrl: full.idCardUrl,
    role: 'user',
  };
};

export const buildProfileUpdate = (current: User, changes: Partial<User>): BackendProfileUpdateBody => {
  const merged = { ...current, ...changes };
  return {
    name: merged.name,
    phone: merged.phone,
    college: merged.college,
    department: merged.department,
    year: yearToNumber(merged.year),
    referral: merged.referral,
    accomodation: merged.accommodation,
    discoveryMethod: merged.discoveryMethod,
  };
};