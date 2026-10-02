import { requireAdmin } from '../../../../lib/adminAuth';
import { createAdminClient } from '../../../../lib/supabase/admin';
import { fetchSettings } from '../../../../lib/supabase/mappers';
import { json, unauthorized } from '../../_lib/http';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  try {
    if (!(await requireAdmin())) return unauthorized();

    const db = createAdminClient();
    const [productCount, activeProductCount, categoryCount, settings] = await Promise.all([
      db.from('products').select('id', { count: 'exact', head: true }),
      db.from('products').select('id', { count: 'exact', head: true }).eq('is_active', true),
      db.from('categories').select('id', { count: 'exact', head: true }),
      fetchSettings(db),
    ]);
    if (productCount.error) throw productCount.error;
    if (activeProductCount.error) throw activeProductCount.error;
    if (categoryCount.error) throw categoryCount.error;

    return json({
      product_count: productCount.count ?? 0,
      active_product_count: activeProductCount.count ?? 0,
      category_count: categoryCount.count ?? 0,
      settings,
    });
  } catch (error) {
    console.error('GET /api/admin/overview failed:', error);
    return json({ error: 'internal' }, 500);
  }
}
