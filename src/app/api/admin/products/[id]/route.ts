import { requireAdmin } from '../../../../../lib/adminAuth';
import { createAdminClient } from '../../../../../lib/supabase/admin';
import { rowToProduct, productToRow, type ProductRow } from '../../../../../lib/supabase/mappers';
import { json, readJson, unauthorized } from '../../../_lib/http';
import { mergeProduct } from '../../../_lib/parsers';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: RouteContext): Promise<Response> {
  try {
    if (!(await requireAdmin())) return unauthorized();

    const { id } = await params;
    const body = (await readJson(req)) ?? {};
    if ('title' in body && (typeof body.title !== 'string' || !body.title.trim())) {
      return json({ error: 'title required' }, 400);
    }
    if (
      'price' in body &&
      (typeof body.price !== 'number' || !Number.isFinite(body.price) || body.price < 0)
    ) {
      return json({ error: 'price must be a number >= 0' }, 400);
    }

    const db = createAdminClient();
    const existingRes = await db.from('products').select('*').eq('id', id).maybeSingle();
    if (existingRes.error) throw existingRes.error;
    if (!existingRes.data) return json({ error: 'not found' }, 404);

    const merged = mergeProduct(rowToProduct(existingRes.data as ProductRow), body);
    const updatedRes = await db
      .from('products')
      .update({ ...productToRow(merged), updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();
    if (updatedRes.error) throw updatedRes.error;
    if (!updatedRes.data) return json({ error: 'not found' }, 404);

    return json(rowToProduct(updatedRes.data as ProductRow));
  } catch (error) {
    console.error('PATCH /api/admin/products/[id] failed:', error);
    return json({ error: 'internal' }, 500);
  }
}

export async function DELETE(_req: Request, { params }: RouteContext): Promise<Response> {
  try {
    if (!(await requireAdmin())) return unauthorized();

    const { id } = await params;
    const db = createAdminClient();
    const { error } = await db.from('products').delete().eq('id', id);
    if (error) throw error;

    return json({ ok: true });
  } catch (error) {
    console.error('DELETE /api/admin/products/[id] failed:', error);
    return json({ error: 'internal' }, 500);
  }
}
