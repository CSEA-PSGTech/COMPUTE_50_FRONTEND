export const PASSWORD_RULES_MESSAGE =
  'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number and a special character.';

export const isStrongPassword = (password: string): boolean =>
  password.length >= 8 &&
  /[a-z]/.test(password) &&
  /[A-Z]/.test(password) &&
  /[0-9]/.test(password) &&
  /[^A-Za-z0-9]/.test(password);

export const normalizeEmail = (email: string): string => email.trim().toLowerCase();