import type { Product } from '../../../types';
import type { CategoryMeta } from '../../../data/categories';

const TAG_COLORS: ReadonlySet<string> = new Set(['emerald', 'violet', 'amber', 'blue', 'gray']);
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';

const PATCHABLE_PRODUCT_KEYS = [
  'category',
  'filterTab',
  'provider',
  'providerBadgeClass',
  'providerBadgeText',
  'tag',
  'tagColor',
  'title',
  'description',
  'nominalLabel',
  'nominalSub',
  'originalPrice',
  'price',
  'isBill',
  'actionText',
  'popularScore',
  'targetType',
  'targetPlaceholder',
  'image_url',
  'is_active',
  'sort_order',
] as const;

const PATCHABLE_CATEGORY_KEYS = [
  'label',
  'desc',
  'icon',
  'iconBg',
  'iconColor',
  'slug',
  'variant',
  'inputLabel',
  'inputPlaceholder',
  'chipsTitle',
  'chips',
  'nominalTitle',
  'nominalLayout',
  'inSidebar',
  'is_active',
  'sort_order',
] as const;

function text(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function optionalText(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function num(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function optionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function bool(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

export function generateProductId(): string {
  let suffix = '';
  for (let i = 0; i < 4; i += 1) {
    suffix += LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)];
  }
  return `p-${Date.now().toString(36)}-${suffix}`;
}

export function productFromJson(body: Record<string, unknown>): Product {
  return {
    id: typeof body.id === 'string' && body.id.length > 0 ? body.id : generateProductId(),
    category: text(body.category, 'pulsa') as Product['category'],
    filterTab: text(body.filterTab, 'all') as Product['filterTab'],
    provider: text(body.provider),
    providerBadgeClass: text(body.providerBadgeClass),
    providerBadgeText: text(body.providerBadgeText),
    tag: optionalText(body.tag),
    tagColor:
      typeof body.tagColor === 'string' && TAG_COLORS.has(body.tagColor)
        ? (body.tagColor as Product['tagColor'])
        : undefined,
    title: text(body.title),
    description: text(body.description),
    nominalLabel: optionalText(body.nominalLabel),
    nominalSub: optionalText(body.nominalSub),
    originalPrice: optionalNumber(body.originalPrice),
    price: num(body.price),
    isBill: bool(body.isBill, false),
    actionText: text(body.actionText, 'Beli') as Product['actionText'],
    popularScore: num(body.popularScore),
    targetType: text(body.targetType, 'phone') as Product['targetType'],
    targetPlaceholder: text(body.targetPlaceholder),
    image_url: optionalText(body.image_url) ?? null,
    is_active: bool(body.is_active, true),
    sort_order: num(body.sort_order),
  };
}

/** Partial merge: only keys actually present in the request body override the existing product. */
export function mergeProduct(existing: Product, body: Record<string, unknown>): Product {
  const parsed = productFromJson(body);
  const merged: Product = { ...existing };
  for (const key of PATCHABLE_PRODUCT_KEYS) {
    if (key in body) Object.assign(merged, { [key]: parsed[key] });
  }
  return merged;
}

export function categoryFromJson(body: Record<string, unknown>): CategoryMeta {
  const layout = body.nominalLayout;
  return {
    id: (typeof body.id === 'string' ? body.id : '') as CategoryMeta['id'],
    label: text(body.label),
    desc: text(body.desc),
    icon: text(body.icon),
    iconBg: text(body.iconBg),
    iconColor: text(body.iconColor),
    slug: text(body.slug),
    variant: body.variant === 'bill' ? 'bill' : 'nominal',
    inputLabel: text(body.inputLabel),
    inputPlaceholder: text(body.inputPlaceholder),
    chipsTitle: optionalText(body.chipsTitle),
    chips: Array.isArray(body.chips)
      ? body.chips.filter((chip): chip is string => typeof chip === 'string')
      : undefined,
    nominalTitle: optionalText(body.nominalTitle),
    nominalLayout: layout === 'grid4' || layout === 'grid3' ? layout : undefined,
    inSidebar: typeof body.inSidebar === 'boolean' ? body.inSidebar : undefined,
    is_active: typeof body.is_active === 'boolean' ? body.is_active : undefined,
    sort_order: optionalNumber(body.sort_order),
  };
}

/** Partial merge: only keys present in the body override the existing category. */
export function mergeCategory(existing: CategoryMeta, body: Record<string, unknown>): CategoryMeta {
  const parsed = categoryFromJson(body);
  const merged: CategoryMeta = { ...existing };
  for (const key of PATCHABLE_CATEGORY_KEYS) {
    if (key in body) Object.assign(merged, { [key]: parsed[key] });
  }
  return merged;
}
