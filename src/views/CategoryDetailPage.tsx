'use client';

/**
 * Halaman detail kategori — mengikuti desain HTML (`pages/pulsa`,
 * `pages/paket-data`, `pages/token-pln`, `pages/tagihan-pln`, `pages/pdam`,
 * `pages/bpjs`, `pages/internet-tv`, `pages/e-wallet`):
 *
 *   [ sidebar KATEGORI ]  [ kartu utama ]  [ Ringkasan gelap ]
 *
 * Bentuk kartu utama ditentukan `category.variant`:
 *  - `nominal` → chip provider + grid nominal (dari data produk)
 *  - `bill`    → chip "Pilih layanan" + kotak info "Cek tagihan"
 */

import React, { useMemo, useRef, useState } from 'react';
import { Product } from '../types';
import { COPY } from '../data/copywriting';
import { CategoryMeta, SIDEBAR_CATEGORIES } from '../data/categories';
import { useRouter } from '../context/RouterContext';
import { CheckoutDraft } from './CheckoutPages';

const makeTrxRef = () => {
  const now = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `VRX${now.getFullYear()}${p(now.getMonth() + 1)}${p(now.getDate())}-${Math.floor(
    1000 + Math.random() * 9000,
  )}`;
};

export const CategoryDetailPage: React.FC<{
  category: CategoryMeta;
  products: Product[];
  draft: CheckoutDraft;
  onDraftChange: (patch: Partial<CheckoutDraft>) => void;
  onContinue: (product: Product, trxRef: string) => void;
  onCancel: () => void;
}> = ({ category, products, draft, onDraftChange, onContinue, onCancel }) => {
  const { navigate } = useRouter();
  const copy = COPY.categoryPage;
  const isNominal = category.variant === 'nominal';

  const [chip, setChip] = useState<string | null>(category.chips?.[0] ?? null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /** Produk yang tampil untuk provider/layanan terpilih. */
  const visibleProducts = useMemo(() => {
    if (!isNominal || !chip) return products;
    const filtered = products.filter((p) => p.providerBadgeText === chip);
    return filtered.length > 0 ? filtered : products;
  }, [products, chip, isNominal]);

  const selected = products.find((p) => p.id === selectedId) ?? null;
  const billProduct = products[0] ?? null;
  const digits = draft.destination.replace(/\D/g, '');

  // Label panjang (mis. "Mingguan") butuh kolom lebih lebar agar tidak berdesakan.
  const isWideGrid = category.nominalLayout === 'grid3';
  // Kartu utama mengecil di breakpoint lg (col-span-6), jadi kolom dikurangi
  // lagi di lg agar label kata panjang tetap muat tanpa berdesakan.
  const gridClass = isWideGrid
    ? 'mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3'
    : 'mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3';
  const nominalLabelClass = isWideGrid
    ? 'text-lg sm:text-xl lg:text-2xl font-black leading-tight'
    : 'text-2xl font-black leading-tight';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (digits.length < 8) {
      setError(copy.errNumber);
      inputRef.current?.focus();
      return;
    }
    if (isNominal && !selected) {
      setError(copy.errNominal);
      return;
    }
    const product = selected ?? billProduct;
    if (!product) {
      setError(copy.errNominal);
      return;
    }
    setError(null);
    onContinue(product, makeTrxRef());
  };

  const chipClass = (active: boolean) =>
    `px-4 py-2.5 rounded-xl border-2 font-semibold transition-colors cursor-pointer ${
      active
        ? 'border-violet-600 bg-violet-50 text-violet-700'
        : 'border-slate-200 hover:border-violet-400 text-[#0c0a1d]'
    }`;

  return (
    <div className="bg-[#f4f3f8] px-2 md:px-3 py-2 md:py-3 font-['Inter_Tight',sans-serif] min-h-[70vh]">
      <form
        onSubmit={handleSubmit}
        className="max-w-7xl mx-auto px-1 md:px-0 py-6 grid lg:grid-cols-12 gap-4"
      >
        {/* ── Sidebar kategori ── */}
        <aside className="hidden lg:block lg:col-span-3 bg-white rounded-[28px] border border-slate-200/70 p-4 h-fit sticky top-24">
          <p className="px-4 pt-2 pb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
            {copy.sidebarTitle}
          </p>
          {SIDEBAR_CATEGORIES.map((cat) => {
            const active = cat.id === category.id;
            return (
              <a
                key={cat.id}
                href={cat.slug}
                onClick={(e) => {
                  e.preventDefault();
                  if (!active) navigate(cat.slug);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-colors ${
                  active ? 'bg-violet-600 text-white' : 'hover:bg-violet-50 text-[#0c0a1d]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                {cat.label}
              </a>
            );
          })}
        </aside>

        {/* ── Kartu utama ── */}
        <section className="lg:col-span-6 bg-white rounded-[28px] border border-slate-200/70 p-6 md:p-9">
          <a
            href="/#kategori"
            onClick={(e) => {
              e.preventDefault();
              onCancel();
            }}
            className="text-sm text-slate-500 hover:text-violet-700 transition-colors"
          >
            {copy.allCategories}
          </a>

          <div className="mt-5 flex items-center gap-4">
            <span className="w-14 h-14 rounded-2xl bg-violet-600 text-white grid place-items-center shrink-0">
              <span className="material-symbols-outlined text-[28px]">{category.icon}</span>
            </span>
            <div className="min-w-0">
              <h1 className="text-4xl md:text-5xl font-black tracking-[-.04em] text-[#0c0a1d]">
                {category.label}
              </h1>
              <p className="text-slate-500 mt-1">{category.desc}</p>
            </div>
          </div>

          <label htmlFor="category-target" className="block mt-9 text-sm font-bold text-[#0c0a1d]">
            {category.inputLabel}
          </label>
          <input
            ref={inputRef}
            id="category-target"
            type="text"
            inputMode="numeric"
            value={draft.destination}
            onChange={(e) => {
              onDraftChange({ destination: e.target.value });
              if (error) setError(null);
            }}
            placeholder={category.inputPlaceholder}
            aria-invalid={error !== null}
            className={`mt-3 w-full px-5 py-4 rounded-2xl border-2 outline-none text-lg font-medium text-[#0c0a1d] transition-colors ${
              error
                ? 'border-rose-500 shadow-[5px_5px_0_#f43f5e]'
                : 'border-slate-900 shadow-[5px_5px_0_#7c3aed] focus:border-violet-700'
            }`}
          />
          {error && (
            <p role="alert" className="mt-3 text-sm font-bold text-rose-600">
              {error}
            </p>
          )}

          {/* chip provider / layanan */}
          {category.chips && category.chips.length > 0 && (
            <>
              <p className="mt-8 text-sm font-bold text-[#0c0a1d]">{category.chipsTitle}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {category.chips.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setChip(item);
                      setSelectedId(null);
                      if (error) setError(null);
                    }}
                    aria-pressed={chip === item}
                    className={chipClass(chip === item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </>
          )}

          {isNominal ? (
            <>
              <p className="mt-8 text-sm font-bold text-[#0c0a1d]">{category.nominalTitle}</p>
              <div className={gridClass}>
                {visibleProducts.map((p) => {
                  const isSelected = selectedId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedId(p.id);
                        if (error) setError(null);
                      }}
                      aria-pressed={isSelected}
                      className={`p-5 rounded-2xl border-2 text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-violet-600 bg-violet-50 text-violet-700'
                          : 'border-slate-200 hover:border-violet-400'
                      }`}
                    >
                      <p className={nominalLabelClass}>{p.nominalLabel ?? p.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{p.nominalSub}</p>
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 text-sm text-slate-500">{copy.priceNote}</p>
            </>
          ) : (
            <div className="mt-8 p-5 rounded-2xl bg-violet-50 text-violet-900 text-sm">
              {copy.infoLead}
              <b>{copy.infoBold}</b>
              {copy.infoTail}
            </div>
          )}
        </section>

        {/* ── Ringkasan ── */}
        <aside className="lg:col-span-3 bg-slate-900 text-white rounded-[28px] p-6 h-fit lg:sticky lg:top-24">
          <p className="text-sm text-white/60">{copy.summary}</p>
          <p className="mt-2 text-2xl font-black">{category.label}</p>

          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-white/60">{copy.pickLabel}</span>
              <span className="font-semibold text-right">
                {isNominal && selected ? (selected.nominalLabel ?? selected.title) : copy.notChosen}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-white/60">{copy.methodLabel}</span>
              <span className="font-semibold">{copy.methodValue}</span>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 active:scale-[0.99] font-bold transition-all cursor-pointer"
          >
            {isNominal ? copy.btnContinue : copy.btnCheck}
          </button>
          <div className="mt-5 flex items-center gap-3 text-sm text-white/60">
            <span className="material-symbols-outlined text-[20px]">chat</span>
            {copy.helpCs}
          </div>
        </aside>
      </form>
    </div>
  );
};
