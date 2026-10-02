import React from 'react';
import { Product } from '../types';
import { COPY } from '../data/copywriting';

interface ProductCatalogProps {
  products: Product[];
  sortBy: 'popular' | 'cheapest' | 'fastest';
  onSortByChange: (sort: 'popular' | 'cheapest' | 'fastest') => void;
  onSelectProduct: (product: Product) => void;
  onResetFilters?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onQuickSearch?: (keyword: string) => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

const formatRupiah = (val: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  })
    .format(val)
    .replace(/\s/, '');

const TAG_STYLES: Record<NonNullable<Product['tagColor']>, string> = {
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  violet: 'bg-[#f5f0ff] text-[#6d28d9] border-[#ede4ff]',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  blue: 'bg-sky-50 text-sky-700 border-sky-200',
  gray: 'bg-gray-50 text-gray-600 border-gray-200',
};

const discountPercent = (price: number, originalPrice?: number) => {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};

const actionIcon = (product: Product) => {
  if (product.isBill) return 'receipt_long';
  if (product.actionText === 'Top Up') return 'add_card';
  return 'bolt';
};

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  sortBy,
  onSortByChange,
  onSelectProduct,
  onResetFilters,
  searchQuery,
  onSearchChange,
  onQuickSearch,
  searchInputRef,
}) => {
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-24" id="katalog">
      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#fc6955] font-sora">
            {COPY.catalog.eyebrow}
          </span>
          <h2 className="font-sora text-2xl sm:text-[28px] font-extrabold tracking-[-0.02em] text-gray-950 mt-0.5">
            {COPY.catalog.title}
          </h2>
          <p className="text-sm text-[#585265] mt-1.5 max-w-xl">{COPY.catalog.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f5f0ff] border border-[#ede4ff] text-[11px] font-bold text-[#6d28d9] whitespace-nowrap">
            <span className="material-symbols-outlined text-[14px]">inventory_2</span>
            {products.length} {COPY.catalog.availableLabel}
          </span>

          <div className="relative inline-flex items-center">
            <span className="sr-only">{COPY.catalog.sortLabel}</span>
            <select
              value={sortBy}
              onChange={(e) =>
                onSortByChange(e.target.value as 'popular' | 'cheapest' | 'fastest')
              }
              className="appearance-none bg-white text-gray-800 text-xs font-sora font-bold py-2.5 pl-3.5 pr-8 rounded-xl border border-[#e4e1e7] focus:outline-none focus:border-[#6d28d9] cursor-pointer"
            >
              <option value="popular">{COPY.catalog.sort.popular}</option>
              <option value="cheapest">{COPY.catalog.sort.cheapest}</option>
              <option value="fastest">{COPY.catalog.sort.fastest}</option>
            </select>
            <span className="material-symbols-outlined text-[18px] text-gray-400 absolute right-2 pointer-events-none">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* ── Search ── */}
      <form onSubmit={handleSearchSubmit}>
        <div className="flex flex-col sm:flex-row items-stretch gap-2 p-2 rounded-2xl bg-white border border-[#e4e1e7] focus-within:border-[#6d28d9] focus-within:ring-2 focus-within:ring-[#ede4ff] transition-all">
          <div className="flex items-center gap-2.5 flex-1 min-w-0 px-3 rounded-xl bg-[#f6f2f8] sm:bg-transparent">
            <span className="material-symbols-outlined text-[22px] text-gray-400 shrink-0">
              search
            </span>
            <input
              ref={searchInputRef}
              id="catalog-search"
              name="q"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Cari produk, provider, atau nominal"
              enterKeyHint="search"
              className="flex-1 min-w-0 w-full py-3 bg-transparent text-[15px] text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none border-0"
              placeholder={COPY.catalog.search.placeholder}
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto h-12 px-6 rounded-xl bg-[#fc6955] hover:bg-[#e04e3b] active:scale-95 text-white font-sora font-semibold text-sm transition-all shrink-0 cursor-pointer"
          >
            <span>{COPY.catalog.search.button}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </form>

      {searchQuery.trim() ? (
        <div
          className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-3.5 text-xs"
          aria-live="polite"
        >
          <span className="font-sora font-bold text-[#6d28d9]">{products.length}</span>
          <span className="text-gray-500">{COPY.catalog.search.resultFoundLabel}</span>
          {onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="ml-1 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-[#6d28d9] hover:text-[#6d28d9] active:scale-95 transition-all cursor-pointer font-semibold"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
              {COPY.catalog.search.resetLabel}
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2 mt-3.5 text-xs text-gray-500">
          <span className="font-semibold text-gray-400">{COPY.catalog.search.quickLabel}</span>
          {COPY.catalog.search.quickChoices.map((pick) => (
            <button
              key={pick.label}
              type="button"
              onClick={() => onQuickSearch?.(pick.query)}
              className="px-3.5 py-2 rounded-full bg-white border border-[#e4e1e7] hover:border-[#6d28d9] hover:text-[#6d28d9] active:scale-95 transition-all cursor-pointer font-medium whitespace-nowrap"
            >
              {pick.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Products ── */}
      <div className="mt-8">
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#e4e1e7]">
            <span className="material-symbols-outlined text-gray-300 text-[48px] mb-2">
              search_off
            </span>
            <h3 className="font-sora font-bold text-gray-700 text-base">
              {COPY.catalog.empty.title}
            </h3>
            <p className="text-gray-400 text-xs mt-1">{COPY.catalog.empty.desc}</p>
            {onResetFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#6d28d9] hover:bg-[#5b21b6] active:scale-95 text-white text-xs font-sora font-semibold transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                {COPY.catalog.empty.resetLabel}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
            {products.map((product) => {
              const discount = discountPercent(product.price, product.originalPrice);
              const savings =
                product.originalPrice && product.originalPrice > product.price
                  ? product.originalPrice - product.price
                  : 0;
              // Skip tags that just repeat the auto-computed discount badge
              const tag =
                product.tag && discount !== null && /diskon/i.test(product.tag) ? undefined : product.tag;

              return (
                <article
                  key={product.id}
                  className="group flex flex-col bg-white rounded-2xl border border-[#e4e1e7] hover:border-[#6d28d9] hover:shadow-[0_20px_44px_-26px_rgba(76,29,149,0.55)] hover:-translate-y-1 transition-all duration-200"
                >
                  {/* Card body — clickable */}
                  <button
                    type="button"
                    onClick={() => onSelectProduct(product)}
                    className="flex flex-1 flex-col p-3.5 sm:p-5 text-left cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-1.5 sm:gap-2">
                      <span
                        className={`min-w-0 truncate px-2 py-0.5 sm:px-2.5 rounded-md text-[10px] sm:text-[11px] font-bold font-sora uppercase border ${product.providerBadgeClass}`}
                      >
                        {product.providerBadgeText}
                      </span>

                      {discount !== null && (
                        <span className="px-1.5 py-0.5 sm:px-2 rounded-md bg-[#fc6955] text-white text-[9px] sm:text-[10px] font-extrabold font-sora tracking-wide shrink-0">
                          -{discount}%
                        </span>
                      )}
                    </div>

                    <h3 className="mt-2.5 sm:mt-3 font-sora font-bold text-[13px] sm:text-[15px] text-gray-900 leading-snug group-hover:text-[#6d28d9] transition-colors">
                      {product.title}
                    </h3>
                    <p className="hidden sm:block mt-1.5 text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {product.description}
                    </p>

                    {tag && (
                      <div className="mt-2.5 sm:mt-3">
                        <span
                          className={`inline-flex max-w-full items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-bold ${
                            TAG_STYLES[product.tagColor ?? 'gray']
                          }`}
                        >
                          <span className="material-symbols-outlined text-[12px] shrink-0">sell</span>
                          <span className="truncate">{tag}</span>
                        </span>
                      </div>
                    )}

                    <div className="mt-auto pt-3 sm:pt-4">
                      {product.isBill ? (
                        <>
                          <span className="block text-[9px] sm:text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                            {COPY.catalog.billPriceLabel}
                          </span>
                          <span className="font-sora font-extrabold text-lg sm:text-xl text-[#6d28d9]">
                            {formatRupiah(product.price)}
                          </span>
                        </>
                      ) : (
                        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-end sm:justify-between sm:gap-2">
                          <div className="min-w-0">
                            {product.originalPrice && (
                              <span className="block text-[10px] sm:text-[11px] text-gray-400 line-through">
                                {formatRupiah(product.originalPrice)}
                              </span>
                            )}
                            <span className="font-sora font-extrabold text-lg sm:text-xl text-[#6d28d9]">
                              {formatRupiah(product.price)}
                            </span>
                          </div>
                          {savings > 0 && (
                            <span className="text-[10px] font-bold text-emerald-600 whitespace-nowrap sm:pb-1">
                              {COPY.catalog.saveLabel} {formatRupiah(savings)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Card action */}
                  <div className="px-3.5 sm:px-5 pb-3.5 sm:pb-5">
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className={`inline-flex w-full items-center justify-center gap-1.5 py-2.5 rounded-xl font-sora font-bold text-[11px] sm:text-xs transition-all active:scale-[0.98] cursor-pointer ${
                        product.isBill
                          ? 'border border-[#6d28d9] text-[#6d28d9] bg-white hover:bg-[#f5f0ff]'
                          : 'bg-[#fc6955] hover:bg-[#e04e3b] text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px] sm:text-[16px]">
                        {actionIcon(product)}
                      </span>
                      <span>{product.actionText}</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
