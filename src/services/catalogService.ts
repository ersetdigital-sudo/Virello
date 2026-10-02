import { Product } from '../types';
import { CategoryMeta } from '../data/categories';

export interface CatalogSettings {
  whatsapp_number: string;
  whatsapp_message: string;
  qris_image_url: string | null;
}

export interface CatalogData {
  products: Product[];
  categories: CategoryMeta[];
  settings: CatalogSettings;
}

export const FALLBACK_SETTINGS: CatalogSettings = {
  whatsapp_number: '6281234567890',
  whatsapp_message:
    'Halo CS Virello, saya membutuhkan bantuan terkait pesanan atau layanan.',
  qris_image_url: null,
};

const REQUEST_TIMEOUT_MS = 8000;

/**
 * Ambil katalog dari GET /api/catalog. Mengembalikan null bila API gagal,
 * error, timeout, atau payload tidak valid — pemanggil wajib fallback ke data
 * statis agar situs tidak pernah blank saat fetch lambat/gagal.
 */
export async function fetchCatalog(): Promise<CatalogData | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch('/api/catalog', { signal: controller.signal });
    if (!res.ok) return null;
    const data = (await res.json()) as Partial<CatalogData>;
    if (!Array.isArray(data.products) || !Array.isArray(data.categories)) {
      return null;
    }
    return {
      products: data.products,
      categories: data.categories,
      settings: { ...FALLBACK_SETTINGS, ...data.settings },
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Susun tautan WhatsApp dari settings. `message` opsional menimpa
 * settings.whatsapp_message untuk halaman yang punya pesan khusus.
 */
export function buildWaLink(settings: CatalogSettings, message?: string): string {
  const number = settings.whatsapp_number.replace(/\D/g, '');
  const text = message ?? settings.whatsapp_message;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/**
 * Buang item non-aktif (is_active === false) lalu urutkan sort_order asc secara
 * stabil. Item tanpa sort_order jadi yang terakhir dengan urutan semula;
 * seluruh daftar tanpa sort_order tetap persis pada urutan aslinya.
 */
export function filterActive<T extends { is_active?: boolean; sort_order?: number }>(
  list: T[]
): T[] {
  return list
    .filter((item) => item.is_active !== false)
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const ao = a.item.sort_order ?? Number.MAX_SAFE_INTEGER;
      const bo = b.item.sort_order ?? Number.MAX_SAFE_INTEGER;
      return ao - bo || a.index - b.index;
    })
    .map(({ item }) => item);
}
