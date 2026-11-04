export const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export const hasProfilePhoto = (url?: string | null): boolean => !!url && !/Default_pfp/i.test(url);

export const validatePhotoFile = (file: File): string | null => {
  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) return 'Please choose a JPEG, PNG or WebP image.';
  if (file.size > MAX_PHOTO_BYTES) return 'Image must be 5 MB or smaller.';
  return null;
};