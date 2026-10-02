import { requireAdmin } from '../../../../lib/adminAuth';
import { createAdminClient } from '../../../../lib/supabase/admin';
import { rowToCategory, categoryToRow, type CategoryRow } from '../../../../lib/supabase/mappers';
import { json, readJson, unauthorized } from '../../_lib/http';
import { categoryFromJson } from '../../_lib/parsers';

export const dynamic = 'force-dynamic';

export async function GET(req: Request): Promise<Response> {
  try {
    if (!(await requireAdmin())) return unauthorized();

    const all = new URL(req.url).searchParams.get('all') === '1';
    const db = createAdminClient();
    let query = db.from('categories').select('*');
    if (!all) query = query.eq('is_active', true);
    const { data, error } = await query
      .order('sort_order', { ascending: true })
      .order('label', { ascending: true });
    if (error) throw error;

    return json(((data ?? []) as CategoryRow[]).map(rowToCategory));
  } catch (error) {
    console.error('GET /api/admin/categories failed:', error);
    return json({ error: 'internal' }, 500);
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    if (!(await requireAdmin())) return unauthorized();

    const body = (await readJson(req)) ?? {};
    const id = typeof body.id === 'string' ? body.id.trim() : '';
    const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
    const label = typeof body.label === 'string' ? body.label.trim() : '';
    if (!id || !slug || !label) {
      return json({ error: 'id, slug and label are required' }, 400);
    }

    const category = categoryFromJson({ ...body, id, slug, label });

    const db = createAdminClient();
    const { data, error } = await db
      .from('categories')
      .insert(categoryToRow(category))
      .select()
      .single();
    if (error) throw error;

    return json(rowToCategory(data as CategoryRow), 201);
  } catch (error) {
    console.error('POST /api/admin/categories failed:', error);
    return json({ error: 'internal' }, 500);
  }
}
