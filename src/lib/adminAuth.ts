import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE = 'virello_admin';
const SESSION_TTL_SECONDS = 86400;

function hmacSign(exp: string): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error('ADMIN_PASSWORD is not configured');
  return createHmac('sha256', secret).update(`admin:${exp}`).digest('hex');
}

export function createSession(): string {
  const exp = String(Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS);
  return `v1.${exp}.${hmacSign(exp)}`;
}

export function verifySession(value: string | null | undefined): boolean {
  if (!value) return false;
  const parts = value.split('.');
  if (parts.length !== 3) return false;
  const [version, exp, signature] = parts;
  if (version !== 'v1' || !/^\d+$/.test(exp)) return false;
  if (Number(exp) <= Math.floor(Date.now() / 1000)) return false;

  const expected = Buffer.from(hmacSign(exp), 'hex');
  const actual = Buffer.from(signature, 'hex');
  if (expected.length === 0 || expected.length !== actual.length) return false;
  return timingSafeEqual(actual, expected);
}

export async function requireAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySession(store.get(ADMIN_COOKIE)?.value);
}

export function sessionSetCookie(session: string): string {
  return `${ADMIN_COOKIE}=${session}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL_SECONDS}`;
}

export function sessionClearCookie(): string {
  return `${ADMIN_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}

export function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const actual = Buffer.from(input, 'utf8');
  const wanted = Buffer.from(expected, 'utf8');
  if (actual.length !== wanted.length) return false;
  return timingSafeEqual(actual, wanted);
}
