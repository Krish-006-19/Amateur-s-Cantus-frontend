import { apiFetch } from './api';

// Mirror the server's limits so users get a friendly error before any bytes are sent.
export const UPLOAD_LIMITS = {
  audio: { bytes: 6 * 1024 * 1024, label: '6 MB', types: ['audio/mpeg'] },
  image: { bytes: 5 * 1024 * 1024, label: '5 MB', types: ['image/jpeg', 'image/png'] },
  profileImage: { bytes: 2 * 1024 * 1024, label: '2 MB', types: ['image/jpeg', 'image/png'] },
};

const TYPE_ALIASES = { 'audio/mp3': 'audio/mpeg', 'audio/mpeg3': 'audio/mpeg', 'image/jpg': 'image/jpeg' };
const BY_EXTENSION = { mp3: 'audio/mpeg', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png' };

function detectType(file) {
  if (file.type) return TYPE_ALIASES[file.type] || file.type;
  const ext = String(file.name || '').split('.').pop().toLowerCase();
  return BY_EXTENSION[ext] || '';
}

/**
 * Uploads one file straight to S3 and returns its object key.
 * kind: 'audio' | 'image' | 'profileImage'
 */
export async function uploadToS3(file, kind) {
  const limit = UPLOAD_LIMITS[kind];
  if (!limit) throw new Error('Unsupported upload type');

  const type = detectType(file);
  if (!limit.types.includes(type)) {
    throw new Error(kind === 'audio' ? 'Only MP3 audio is allowed' : 'Only PNG/JPG images are allowed');
  }
  if (file.size < 1 || file.size > limit.bytes) {
    throw new Error(`File must be smaller than ${limit.label}`);
  }

  // 1) ask our API for a short-lived upload URL
  const { key, uploadUrl, contentType } = await apiFetch('/upload/presign', {
    method: 'POST',
    body: { kind, contentType: type, size: file.size },
  });

  // 2) send the bytes directly to S3. No auth headers here: the URL itself is the permission.
  //    Content-Type must match what the server signed, and the body is exactly file.size bytes.
  const put = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: file,
  });
  if (!put.ok) {
    throw new Error(`Upload to storage failed (${put.status}). Check the bucket CORS settings.`);
  }

  return key;
}

/** Uploads a profile picture and saves it on the signed-in user. Returns the updated user. */
export async function uploadProfileImage(file) {
  const key = await uploadToS3(file, 'profileImage');
  const data = await apiFetch('/api/auth/me/profile-image', { method: 'PUT', body: { key } });
  return data.user;
}
