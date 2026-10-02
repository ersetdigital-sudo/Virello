import { createAdminClient } from '../../../lib/supabase/admin';
import {
  fetchSettings,
  rowToCategory,
  rowToProduct,
  type CategoryRow,
  type ProductRow,
} from '../../../lib/supabase/mappers';
import { json, jsonNoStore } from '../_lib/http';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  try {
    const db = createAdminClient();
    const [productsRes, categoriesRes, settings] = await Promise.all([
      db
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('title', { ascending: true }),
      db
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
      fetchSettings(db),
    ]);
    if (productsRes.error) throw productsRes.error;
    if (categoriesRes.error) throw categoriesRes.error;

    return jsonNoStore({
      products: ((productsRes.data ?? []) as ProductRow[]).map(rowToProduct),
      categories: ((categoriesRes.data ?? []) as CategoryRow[]).map(rowToCategory),
      settings,
    });
  } catch (error) {
    console.error('GET /api/catalog failed:', error);
    return json({ error: 'internal' }, 500);
  }
}
