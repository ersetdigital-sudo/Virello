import { requireAdmin } from '../../../../../lib/adminAuth';
import { createAdminClient } from '../../../../../lib/supabase/admin';
import {
  rowToCategory,
  categoryToRow,
  type CategoryRow,
} from '../../../../../lib/supabase/mappers';
import { json, readJson, unauthorized } from '../../../_lib/http';
import { mergeCategory } from '../../../_lib/parsers';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: RouteContext): Promise<Response> {
  try {
    if (!(await requireAdmin())) return unauthorized();

    const { id } = await params;
    const body = (await readJson(req)) ?? {};

    const db = createAdminClient();
    const existingRes = await db.from('categories').select('*').eq('id', id).maybeSingle();
    if (existingRes.error) throw existingRes.error;
    if (!existingRes.data) return json({ error: 'not found' }, 404);

    const merged = mergeCategory(rowToCategory(existingRes.data as CategoryRow), body);

    const updatedRes = await db
      .from('categories')
      .update({ ...categoryToRow(merged), updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();
    if (updatedRes.error) throw updatedRes.error;
    if (!updatedRes.data) return json({ error: 'not found' }, 404);

    return json(rowToCategory(updatedRes.data as CategoryRow));
  } catch (error) {
    console.error('PATCH /api/admin/categories/[id] failed:', error);
    return json({ error: 'internal' }, 500);
  }
}

export async function DELETE(_req: Request, { params }: RouteContext): Promise<Response> {
  try {
    if (!(await requireAdmin())) return unauthorized();

    const { id } = await params;
    const db = createAdminClient();
    const { error } = await db.from('categories').delete().eq('id', id);
    if (error) throw error;

    return json({ ok: true });
  } catch (error) {
    console.error('DELETE /api/admin/categories/[id] failed:', error);
    return json({ error: 'internal' }, 500);
  }
}
