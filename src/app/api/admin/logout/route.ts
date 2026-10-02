import { sessionClearCookie } from '../../../../lib/adminAuth';
import { json } from '../../_lib/http';

export async function POST(): Promise<Response> {
  try {
    const res = json({ ok: true });
    res.headers.append('Set-Cookie', sessionClearCookie());
    return res;
  } catch (error) {
    console.error('POST /api/admin/logout failed:', error);
    return json({ error: 'internal' }, 500);
  }
}
