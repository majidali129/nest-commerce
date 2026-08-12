export const CLOUDINARY_ROOT = 'vantage';

export const CLOUDINARY_FOLDER_KEYS = [
  'categories',
  'variants',
  'avatars',
] as const;

export type CloudinaryFolderKey = (typeof CLOUDINARY_FOLDER_KEYS)[number];

export function isCloudinaryFolderKey(
  value: string,
): value is CloudinaryFolderKey {
  return (CLOUDINARY_FOLDER_KEYS as readonly string[]).includes(value);
}
