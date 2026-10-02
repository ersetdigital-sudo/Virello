import { createSession, passwordMatches, sessionSetCookie } from '../../../../lib/adminAuth';
import { json, readJson, unauthorized } from '../../_lib/http';

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await readJson(req);
    const password = body && typeof body.password === 'string' ? body.password : null;
    if (!password || !passwordMatches(password)) {
      return json({ error: 'invalid password' }, 401);
    }
    const res = json({ ok: true });
    res.headers.append('Set-Cookie', sessionSetCookie(createSession()));
    return res;
  } catch (error) {
    console.error('POST /api/admin/login failed:', error);
    return json({ error: 'internal' }, 500);
  }
}
