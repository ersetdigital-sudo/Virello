import { createHash } from 'node:crypto';

/** Cloudinary signs every POST param except these (plus its own signature). */
const EXCLUDED_PARAMS: ReadonlySet<string> = new Set([
  'file',
  'cloud_name',
  'resource_type',
  'api_key',
  'signature',
]);

/**
 * Cloudinary signature: sort params alphabetically, join as name=value with
 * '&', append api_secret with no delimiter, SHA-1 hex digest.
 */
export function cloudinarySignature(
  params: Record<string, string | number>,
  apiSecret: string
): string {
  const toSign =
    Object.entries(params)
      .filter(([key]) => !EXCLUDED_PARAMS.has(key))
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([key, value]) => `${key}=${String(value)}`)
      .join('&') + apiSecret;
  return createHash('sha1').update(toSign).digest('hex');
}
