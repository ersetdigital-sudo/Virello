import { requireAdmin } from '../../../../lib/adminAuth';
import { createAdminClient } from '../../../../lib/supabase/admin';
import { fetchSettings } from '../../../../lib/supabase/mappers';
import { json, readJson, unauthorized } from '../../_lib/http';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  try {
    if (!(await requireAdmin())) return unauthorized();

    const settings = await fetchSettings(createAdminClient());
    return json(settings);
  } catch (error) {
    console.error('GET /api/admin/settings failed:', error);
    return json({ error: 'internal' }, 500);
  }
}

export async function PUT(req: Request): Promise<Response> {
  try {
    if (!(await requireAdmin())) return unauthorized();

    const body = (await readJson(req)) ?? {};
    const str = (value: unknown): string => (typeof value === 'string' ? value : '');
    const qris = typeof body.qris_image_url === 'string' ? body.qris_image_url.trim() : '';
    const now = new Date().toISOString();
    const rows = [
      { key: 'whatsapp_number', value: JSON.stringify(str(body.whatsapp_number)), updated_at: now },
      { key: 'whatsapp_message', value: JSON.stringify(str(body.whatsapp_message)), updated_at: now },
      // jsonb column is NOT NULL: store the JSON literal `null` as the string 'null'
      { key: 'qris_image_url', value: qris === '' ? 'null' : JSON.stringify(qris), updated_at: now },
    ];

    const db = createAdminClient();
    const { error } = await db.from('settings').upsert(rows, { onConflict: 'key' });
    if (error) throw error;

    return json({ ok: true });
  } catch (error) {
    console.error('PUT /api/admin/settings failed:', error);
    return json({ error: 'internal' }, 500);
  }
}
