import type { SupabaseClient } from '@supabase/supabase-js';
import type { Product } from '../../types';
import type { CategoryMeta } from '../../data/categories';

export interface ProductRow {
  id: string;
  category: string;
  filter_tab: string;
  provider: string;
  provider_badge_class: string;
  provider_badge_text: string;
  tag?: string | null;
  tag_color?: string | null;
  title: string;
  description: string;
  nominal_label?: string | null;
  nominal_sub?: string | null;
  original_price?: number | null;
  price: number;
  is_bill: boolean;
  action_text: string;
  popular_score: number;
  target_type: string;
  target_placeholder: string;
  image_url?: string | null;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryRow {
  id: string;
  label: string;
  description: string;
  icon: string;
  icon_bg: string;
  icon_color: string;
  slug: string;
  variant: string;
  input_label: string;
  input_placeholder: string;
  chips_title?: string | null;
  chips?: string[] | null;
  nominal_title?: string | null;
  nominal_layout?: string | null;
  in_sidebar: boolean;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const SETTINGS_KEYS = ['whatsapp_number', 'whatsapp_message', 'qris_image_url'] as const;
export type SettingsKey = (typeof SETTINGS_KEYS)[number];
export type SettingsValue = string | boolean | null;
export type SettingsMap = Record<SettingsKey, SettingsValue>;

/**
 * `settings.value` is jsonb holding a JSON-encoded value (e.g. '"628123"' or
 * '"null"'), but the migration also seeds plain scalars ('628123', null).
 * Unwrap both shapes to the plain value.
 */
function isSettingScalar(value: unknown): value is SettingsValue {
  return typeof value === 'string' || typeof value === 'boolean' || value === null;
}

function unwrapSettingValue(raw: unknown): SettingsValue {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === 'boolean') return raw;
  if (typeof raw === 'string') {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return raw;
    }
    if (isSettingScalar(parsed)) return parsed;
    return raw;
  }
  return String(raw);
}

export async function fetchSettings(db: SupabaseClient): Promise<SettingsMap> {
  const { data, error } = await db.from('settings').select('key, value').in('key', [...SETTINGS_KEYS]);
  if (error) throw error;

  const byKey = new Map<string, unknown>();
  for (const row of (data ?? []) as { key: string; value: unknown }[]) {
    byKey.set(row.key, row.value);
  }
  const settings: SettingsMap = {
    whatsapp_number: null,
    whatsapp_message: null,
    qris_image_url: null,
  };
  for (const key of SETTINGS_KEYS) {
    settings[key] = unwrapSettingValue(byKey.get(key));
  }
  return settings;
}

export function rowToProduct(row: ProductRow): Product {
  const product: Product = {
    id: row.id,
    category: row.category as Product['category'],
    filterTab: row.filter_tab as Product['filterTab'],
    provider: row.provider,
    providerBadgeClass: row.provider_badge_class,
    providerBadgeText: row.provider_badge_text,
    title: row.title,
    description: row.description,
    price: row.price,
    isBill: row.is_bill,
    actionText: row.action_text as Product['actionText'],
    popularScore: row.popular_score,
    targetType: row.target_type as Product['targetType'],
    targetPlaceholder: row.target_placeholder,
    image_url: row.image_url ?? null,
    is_active: row.is_active,
    sort_order: row.sort_order,
  };
  if (row.tag != null) product.tag = row.tag;
  if (row.tag_color != null) product.tagColor = row.tag_color as Product['tagColor'];
  if (row.nominal_label != null) product.nominalLabel = row.nominal_label;
  if (row.nominal_sub != null) product.nominalSub = row.nominal_sub;
  if (row.original_price != null) product.originalPrice = row.original_price;
  return product;
}

export function productToRow(product: Product): ProductRow {
  return {
    id: product.id,
    category: product.category,
    filter_tab: product.filterTab,
    provider: product.provider ?? '',
    provider_badge_class: product.providerBadgeClass ?? '',
    provider_badge_text: product.providerBadgeText ?? '',
    tag: product.tag ?? null,
    tag_color: product.tagColor ?? null,
    title: product.title,
    description: product.description ?? '',
    nominal_label: product.nominalLabel ?? null,
    nominal_sub: product.nominalSub ?? null,
    original_price: product.originalPrice ?? null,
    price: product.price,
    is_bill: product.isBill ?? false,
    action_text: product.actionText ?? 'Beli',
    popular_score: product.popularScore ?? 0,
    target_type: product.targetType ?? 'phone',
    target_placeholder: product.targetPlaceholder ?? '',
    image_url: product.image_url ?? null,
    is_active: product.is_active ?? true,
    sort_order: product.sort_order ?? 0,
  };
}

export function rowToCategory(row: CategoryRow): CategoryMeta {
  const category: CategoryMeta = {
    id: row.id as CategoryMeta['id'],
    label: row.label,
    desc: row.description,
    icon: row.icon,
    iconBg: row.icon_bg,
    iconColor: row.icon_color,
    slug: row.slug,
    variant: row.variant === 'bill' ? 'bill' : 'nominal',
    inputLabel: row.input_label,
    inputPlaceholder: row.input_placeholder,
    inSidebar: row.in_sidebar,
    is_active: row.is_active,
    sort_order: row.sort_order,
  };
  if (row.chips_title != null) category.chipsTitle = row.chips_title;
  if (row.chips != null) category.chips = row.chips;
  if (row.nominal_title != null) category.nominalTitle = row.nominal_title;
  if (row.nominal_layout != null) category.nominalLayout = row.nominal_layout as CategoryMeta['nominalLayout'];
  return category;
}

export function categoryToRow(category: CategoryMeta): CategoryRow {
  return {
    id: category.id,
    label: category.label ?? '',
    description: category.desc ?? '',
    icon: category.icon ?? '',
    icon_bg: category.iconBg ?? '',
    icon_color: category.iconColor ?? '',
    slug: category.slug ?? '',
    variant: category.variant ?? 'nominal',
    input_label: category.inputLabel ?? '',
    input_placeholder: category.inputPlaceholder ?? '',
    chips_title: category.chipsTitle ?? null,
    chips: category.chips ?? null,
    nominal_title: category.nominalTitle ?? null,
    // undefined drops the key so the column default applies on insert
    nominal_layout: category.nominalLayout ?? undefined,
    in_sidebar: category.inSidebar ?? true,
    sort_order: category.sort_order ?? 0,
    is_active: category.is_active ?? true,
  };
}
