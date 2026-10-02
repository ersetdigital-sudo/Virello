import { requireAdmin } from '../../../../lib/adminAuth';
import { createAdminClient } from '../../../../lib/supabase/admin';
import { categoryToRow, productToRow } from '../../../../lib/supabase/mappers';
import { CATEGORY_META } from '../../../../data/categories';
import { INITIAL_PRODUCTS } from '../../../../data/mockData';
import { json, unauthorized } from '../../_lib/http';

const UPSERT_CHUNK_SIZE = 100;

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

export async function POST(): Promise<Response> {
  try {
    if (!(await requireAdmin())) return unauthorized();

    const categoryIds = new Set<string>(CATEGORY_META.map((category) => category.id));
    const products = INITIAL_PRODUCTS.filter((product) => categoryIds.has(product.category));
    const categoryRows = CATEGORY_META.map(categoryToRow);
    const productRows = products.map(productToRow);

    const db = createAdminClient();
    for (const rows of chunk(categoryRows, UPSERT_CHUNK_SIZE)) {
      const { error } = await db
        .from('categories')
        .upsert(rows, { onConflict: 'id', ignoreDuplicates: false });
      if (error) throw error;
    }
    for (const rows of chunk(productRows, UPSERT_CHUNK_SIZE)) {
      const { error } = await db
        .from('products')
        .upsert(rows, { onConflict: 'id', ignoreDuplicates: false });
      if (error) throw error;
    }

    return json({ ok: true, categories: categoryRows.length, products: productRows.length });
  } catch (error) {
    console.error('POST /api/admin/seed failed:', error);
    return json({ error: 'internal' }, 500);
  }
}
