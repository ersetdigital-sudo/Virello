import { requireAdmin } from '../../../../lib/adminAuth';
import { createAdminClient } from '../../../../lib/supabase/admin';
import { rowToProduct, productToRow, type ProductRow } from '../../../../lib/supabase/mappers';
import { json, readJson, unauthorized } from '../../_lib/http';
import { productFromJson } from '../../_lib/parsers';

export const dynamic = 'force-dynamic';

export async function GET(req: Request): Promise<Response> {
  try {
    if (!(await requireAdmin())) return unauthorized();

    const all = new URL(req.url).searchParams.get('all') === '1';
    const db = createAdminClient();
    let query = db.from('products').select('*');
    if (!all) query = query.eq('is_active', true);
    const { data, error } = await query
      .order('sort_order', { ascending: true })
      .order('title', { ascending: true });
    if (error) throw error;

    return json(((data ?? []) as ProductRow[]).map(rowToProduct));
  } catch (error) {
    console.error('GET /api/admin/products failed:', error);
    return json({ error: 'internal' }, 500);
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    if (!(await requireAdmin())) return unauthorized();

    const body = (await readJson(req)) ?? {};
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    if (!title) return json({ error: 'title required' }, 400);
    if (typeof body.price !== 'number' || !Number.isFinite(body.price) || body.price < 0) {
      return json({ error: 'price must be a number >= 0' }, 400);
    }

    const product = productFromJson(body);
    product.title = title;

    const db = createAdminClient();
    const { data, error } = await db
      .from('products')
      .insert(productToRow(product))
      .select()
      .single();
    if (error) throw error;

    return json(rowToProduct(data as ProductRow), 201);
  } catch (error) {
    console.error('POST /api/admin/products failed:', error);
    return json({ error: 'internal' }, 500);
  }
}
