'use client';

/**
 * Beranda — port langsung dari `pages/index.html` (desain HTML terbaru).
 * Header & footer memakai yang global, jadi section ini hanya berisi:
 * kartu hero (badge + judul + search + visual QRIS), strip "Bisa bayar pakai",
 * blok "cara kerja", lalu grid kategori `#kategori`.
 */

import React, { useState } from 'react';
import { COPY } from '../data/copywriting';
import { useRouter } from '../context/RouterContext';

/* ── Ikon inline (persis mengambil path dari <symbol> di index.html) ── */
const ICON_PATHS: Record<string, React.ReactNode> = {
  phone: (
    <>
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <path d="M11 18h2" />
    </>
  ),
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  wifi: (
    <>
      <path d="M4 10a11 11 0 0 1 16 0M7 13.5a6.5 6.5 0 0 1 10 0M10.2 16.8a2.5 2.5 0 0 1 3.6 0" />
      <circle cx="12" cy="19.5" r="0.6" />
    </>
  ),
  wallet: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <path d="M3 10h18M16 15h2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4.5 6v6c0 4.6 3.2 7.9 7.5 9 4.3-1.1 7.5-4.4 7.5-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  drop: <path d="M12 3s6 7 6 11.5a6 6 0 0 1-12 0C6 10 12 3 12 3z" />,
  tv: (
    <>
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 2.5h12v19l-3-2-3 2-3-2-3 2z" />
      <path d="M9 8h6M9 12h6" />
    </>
  ),
  qr: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3M21 14v7h-4M14 18v3" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  chat: <path d="M4 19.5 5.5 15A8 8 0 1 1 9 18.5z" />,
  list: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </>
  ),
  fire: <path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-5 1-8.5z" />,
};

const Icon: React.FC<{ name: string; className?: string; strokeWidth?: number }> = ({
  name,
  className,
  strokeWidth = 1.8,
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {ICON_PATHS[name]}
  </svg>
);

/** Pencarian sederhana: arahkan ke halaman kategori yang paling relevan. */
const SEARCH_ROUTES: { keywords: string[]; path: string }[] = [
  { keywords: ['tagihan pln', 'pascabayar'], path: '/tagihan-pln' },
  { keywords: ['token', 'pln', 'listrik'], path: '/token-pln' },
  { keywords: ['pulsa', 'telkomsel', 'indosat', 'xl', 'tri', 'smartfren'], path: '/pulsa' },
  { keywords: ['paket', 'data', 'kuota', 'internet', 'indihome', 'tv'], path: '/paket-data' },
  { keywords: ['gopay', 'ovo', 'dana', 'shopeepay', 'linkaja', 'wallet', 'e-wallet'], path: '/e-wallet' },
  { keywords: ['pdam', 'air'], path: '/pdam' },
  { keywords: ['bpjs', 'kesehatan'], path: '/bpjs' },
];

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const [query, setQuery] = useState('');
  const home = COPY.home;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.toLowerCase().trim();
    if (!q) return;
    const match = SEARCH_ROUTES.find((route) => route.keywords.some((k) => q.includes(k)));
    if (match) navigate(match.path);
  };

  const handleQuickChip = (path: string) => navigate(path);

  return (
    <div className="bg-[#f4f3f8] px-2 md:px-3 py-2 md:py-3 overflow-x-hidden font-['Inter_Tight',sans-serif]">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-[28px] md:rounded-[36px] bg-white border border-slate-200/70">
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 pt-8 md:pt-12 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: copy + search */}
          <div className="lg:col-span-6 min-w-0">
            <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-900 rounded-full pl-1.5 pr-4 py-1.5 text-sm">
              <span className="bg-violet-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {home.badgeChip}
              </span>
              {home.badgeText}
            </div>

            <h1 className="mt-7 text-[52px] md:text-[80px] font-black leading-[.92] tracking-[-.045em] text-[#0c0a1d]">
              {home.titleLine1}
              <br />
              {home.titleLine2}
              <br />
              <span className="text-violet-600">{home.titleAccent}</span>
            </h1>

            <p className="mt-7 text-lg md:text-xl text-slate-500 max-w-lg">{home.subtitle}</p>

            <form
              onSubmit={handleSearch}
              className="mt-9 bg-white rounded-2xl p-2 flex items-center max-w-xl border-2 border-slate-900 shadow-[6px_6px_0_#7c3aed]"
            >
              <Icon name="search" strokeWidth={2.2} className="w-5 h-5 text-slate-400 mx-3 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 min-w-0 py-3.5 outline-none text-base placeholder:text-slate-400 text-[#0c0a1d]"
                placeholder={home.searchPlaceholder}
                aria-label={home.searchPlaceholder}
              />
              <button
                type="submit"
                className="px-6 md:px-8 py-3.5 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-700 transition-colors cursor-pointer"
              >
                <span className="md:hidden">{home.searchButtonShort}</span>
                <span className="hidden md:inline">{home.searchButton}</span>
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-2 text-sm">
              {home.quickChips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => handleQuickChip(chip.path)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 hover:border-violet-500 hover:text-violet-700 transition-colors cursor-pointer"
                >
                  {chip.icon === 'fire' && <Icon name="fire" strokeWidth={2} className="w-3.5 h-3.5 text-violet-600" />}
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: QRIS visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-[32px] bg-violet-600 dots overflow-hidden h-[420px] md:h-[520px]">
              <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full border-[56px] border-white/10" />
              <div className="absolute -left-16 -bottom-28 w-72 h-72 rounded-full border-[48px] border-violet-500" />

              {/* checkout card */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[290px] md:w-[330px] bg-white rounded-[28px] p-5 shadow-[0_40px_70px_-30px_rgba(20,8,60,.7)]">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-2xl bg-violet-50 text-violet-600 grid place-items-center">
                    <Icon name="phone" className="w-6 h-6" />
                  </span>
                  <div>
                    <p className="font-bold text-[#0c0a1d]">{home.checkoutCard.title}</p>
                    <p className="text-xs text-slate-500">{home.checkoutCard.number}</p>
                  </div>
                </div>

                <p className="mt-5 text-xs font-semibold text-slate-500">{home.checkoutCard.nominalLabel}</p>
                <div className="mt-2 grid grid-cols-4 gap-2 text-sm font-bold text-center">
                  {home.checkoutCard.nominals.map((nominal) => (
                    <div
                      key={nominal}
                      className={`py-2.5 rounded-xl ${
                        nominal === home.checkoutCard.selectedNominal
                          ? 'bg-violet-600 text-white'
                          : 'border'
                      }`}
                    >
                      {nominal}
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-4 p-3 rounded-2xl bg-slate-50">
                  <div className="w-20 h-20 shrink-0 rounded-lg bg-white p-1.5 border">
                    <div className="w-full h-full rounded bg-[repeating-conic-gradient(#0c0a1d_0_25%,#fff_0_50%)] bg-[length:10px_10px]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{home.checkoutCard.methodLabel}</p>
                    <p className="font-black text-lg text-[#0c0a1d]">{home.checkoutCard.methodValue}</p>
                    <p className="text-xs text-slate-500">{home.checkoutCard.methodNote}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-4 w-full py-3.5 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {home.checkoutCard.button}
                </button>
              </div>

              {/* floating chips */}
              <div className="fl hidden md:flex absolute left-4 md:left-6 top-6 md:top-10 bg-white rounded-2xl px-4 py-3 shadow-xl items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-emerald-400 text-emerald-950 grid place-items-center">
                  <Icon name="check" strokeWidth={2.6} className="w-5 h-5" />
                </span>
                <div>
                  <p className="font-bold text-sm text-[#0c0a1d]">{home.chips.processedTitle}</p>
                  <p className="text-xs text-slate-500">{home.chips.processedNote}</p>
                </div>
              </div>

              <div className="fl2 hidden md:flex absolute right-4 md:right-6 bottom-6 md:bottom-10 bg-slate-900 text-white rounded-2xl px-4 py-3 shadow-xl items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-white/10 grid place-items-center">
                  <Icon name="chat" className="w-5 h-5" />
                </span>
                <div>
                  <p className="font-bold text-sm">{home.chips.helpTitle}</p>
                  <p className="text-xs text-white/60">{home.chips.helpNote}</p>
                </div>
              </div>

              <div className="hidden md:flex absolute right-6 top-10 gap-2">
                {['bolt', 'wifi', 'wallet'].map((icon) => (
                  <span key={icon} className="w-11 h-11 rounded-2xl bg-white/15 text-white grid place-items-center">
                    <Icon name={icon} className="w-5 h-5" />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-7xl mx-auto px-3 md:px-5 pt-16">
        <div className="grid md:grid-cols-3 gap-3 md:gap-4">
          {home.steps.map((step) => (
            <div key={step.num} className="bg-white rounded-[28px] p-7 border border-slate-200/70">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 grid place-items-center">
                  <Icon name={step.icon} className="w-6 h-6" />
                </span>
                <span className="text-5xl font-black text-slate-100">{step.num}</span>
              </div>
              <p className="mt-6 text-xl font-black text-[#0c0a1d]">{step.title}</p>
              <p className="mt-1 text-slate-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section id="kategori" className="max-w-7xl mx-auto px-3 md:px-5 py-20 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <h2 className="text-4xl md:text-6xl font-black tracking-[-.04em] leading-[.95] text-[#0c0a1d]">
            {home.categoriesTitleLine1}
            <br />
            {home.categoriesTitleLine2}
          </h2>
          <p className="text-slate-500 max-w-sm md:text-right">{home.categoriesSubtitle}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 md:auto-rows-[200px]">
          {/* Featured: Pulsa */}
          <a
            href={home.featuredCategory.path}
            onClick={(e) => {
              e.preventDefault();
              navigate(home.featuredCategory.path);
            }}
            className="tile col-span-2 md:row-span-2 relative overflow-hidden rounded-[28px] p-7 md:p-9 text-white bg-violet-600 dots flex flex-col justify-between min-h-[260px]"
          >
            <div className="absolute -right-16 -bottom-16 w-72 h-72 rounded-full border-[40px] border-white/10" />
            <span className="self-start rounded-full px-3 py-1 text-xs font-bold bg-white/15">
              {home.featuredCategory.badge}
            </span>
            <div className="relative">
              <p className="text-5xl md:text-7xl font-black tracking-[-.04em]">
                {home.featuredCategory.title}
              </p>
              <p className="mt-3 text-white/80">{home.featuredCategory.desc}</p>
              <span className="mt-6 inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-5 py-3 rounded-full">
                {home.featuredCategory.cta}
              </span>
            </div>
          </a>

          {/* Other categories */}
          {home.categories.map((cat) => (
            <a
              key={cat.path}
              href={cat.path}
              onClick={(e) => {
                e.preventDefault();
                navigate(cat.path);
              }}
              className="tile group rounded-[28px] p-6 bg-white border border-slate-200/70 flex flex-col justify-between gap-6"
            >
              <span className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 grid place-items-center group-hover:bg-violet-600 group-hover:text-white transition-colors">
                <Icon name={cat.icon} className="w-6 h-6" />
              </span>
              <div>
                <p className="text-2xl font-black text-[#0c0a1d]">{cat.title}</p>
                <p className="text-sm text-slate-500 mt-1">{cat.desc}</p>
              </div>
            </a>
          ))}

          {/* QRIS promo tile */}
          <div className="tile rounded-[28px] p-6 bg-slate-900 text-white flex flex-col justify-between gap-6">
            <span className="w-12 h-12 rounded-full bg-violet-600 grid place-items-center text-xl">→</span>
            <div>
              <p className="text-2xl font-black">{home.qrisTile.title}</p>
              <p className="text-sm text-white/60 mt-1">{home.qrisTile.desc}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
