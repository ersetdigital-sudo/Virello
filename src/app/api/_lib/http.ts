import { NextResponse } from 'next/server';

export function json<T>(data: T, status = 200, headers?: Record<string, string>): NextResponse {
  return NextResponse.json(data, { status, headers });
}

export function jsonNoStore<T>(data: T, status = 200): NextResponse {
  return json(data, status, { 'Cache-Control': 'no-store' });
}

export function unauthorized(): NextResponse {
  return json({ error: 'unauthorized' }, 401);
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function readJson(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const parsed: unknown = await req.json();
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
