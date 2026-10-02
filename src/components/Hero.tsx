import React from 'react';
import { COPY } from '../data/copywriting';
import { CategoryId } from '../types';

interface HeroProps {
  onSelectCategory: (cat: CategoryId) => void;
  onTrackTransaction: () => void;
}

interface QuickTile {
  id: CategoryId;
  label: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

const QUICK_TILES: QuickTile[] = [
  { id: 'pln', label: 'PLN', icon: 'bolt', iconBg: 'bg-[#fff8e1]', iconColor: 'text-amber-600' },
  { id: 'pulsa', label: 'Pulsa', icon: 'smartphone', iconBg: 'bg-[#ffe2dc]', iconColor: 'text-[#e04e3b]' },
  { id: 'paket-data', label: 'Data', icon: 'wifi', iconBg: 'bg-[#e0f2fe]', iconColor: 'text-sky-600' },
  { id: 'pdam', label: 'PDAM', icon: 'water_drop', iconBg: 'bg-[#e0f7fa]', iconColor: 'text-cyan-700' },
  { id: 'ewallet', label: 'E-Wallet', icon: 'account_balance_wallet', iconBg: 'bg-[#e8eef7]', iconColor: 'text-indigo-600' },
  { id: 'internet', label: 'Internet', icon: 'router', iconBg: 'bg-[#ede7f6]', iconColor: 'text-violet-600' },
];

const BADGE_POSITIONS = [
  'hidden sm:flex top-4 left-2 lg:left-6',
  'hidden sm:flex top-20 right-2 lg:right-6',
  'hidden sm:flex bottom-24 -left-2 lg:left-4',
  'hidden sm:flex bottom-8 right-2 lg:right-6',
];

export const Hero: React.FC<HeroProps> = ({ onSelectCategory, onTrackTransaction }) => {
  const scrollToCategories = () => {
    document.getElementById('kategori-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTileClick = (catId: CategoryId) => {
    onSelectCategory(catId);
    scrollToCategories();
  };

  return (
    <section className="bg-[#f5f0ff] border-b border-[#ede4ff] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* ── Left: copy + primary actions ── */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-[#ede4ff] shadow-2xs mb-5">
              <span className="material-symbols-outlined text-[16px] text-[#6d28d9]">bolt</span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6d28d9]">
                {COPY.hero.eyebrow}
              </span>
            </div>

            <h1 className="font-sora text-[2rem] sm:text-[2.6rem] lg:text-[3rem] font-extrabold tracking-[-0.03em] leading-[1.12] text-gray-950 text-balance">
              {COPY.hero.headlineLead}{' '}
              <span className="text-[#fc6955]">{COPY.hero.headlineAccent}</span>
            </h1>

            <p className="mt-5 text-[15px] sm:text-base text-[#585265] max-w-[490px] mx-auto lg:mx-0 leading-relaxed">
              {COPY.hero.subheadline}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                type="button"
                onClick={scrollToCategories}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#6d28d9] hover:bg-[#5b21b6] active:scale-[0.985] text-white font-sora font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <span>{COPY.hero.btnStart}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
              <button
                type="button"
                onClick={onTrackTransaction}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-[#6d28d9] text-[#6d28d9] hover:bg-white font-sora font-bold text-sm transition-all active:scale-[0.985] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">search_check</span>
                <span>{COPY.hero.btnTrack}</span>
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-2 text-[11px] text-[#585265]">
              {COPY.footer.verifiedBadges.map((badge, idx) => (
                <React.Fragment key={badge}>
                  {idx > 0 && (
                    <span aria-hidden="true" className="w-1 h-1 rounded-full bg-[#6d28d9]/30" />
                  )}
                  <span className="font-medium">{badge}</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ── Right: phone mockup with floating badges ── */}
          <div className="relative flex justify-center items-center min-h-[360px] lg:min-h-[440px]">
            {COPY.hero.badges.map((badge, idx) => (
              <div
                key={badge.label}
                style={{ animationDelay: `${idx * -1.5}s` }}
                className={`hero-float absolute z-20 items-center gap-2.5 bg-white rounded-2xl px-3.5 py-2.5 shadow-lg border border-[#ede4ff] ${BADGE_POSITIONS[idx]}`}
              >
                <div className="w-8 h-8 rounded-lg bg-[#f5f0ff] text-[#6d28d9] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">{badge.icon}</span>
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-semibold text-gray-500">{badge.label}</div>
                  <div className="text-[12px] font-bold text-gray-900 whitespace-nowrap">
                    {badge.value}
                  </div>
                </div>
              </div>
            ))}
            {/* Phone */}
            <div className="relative z-10 w-[220px] h-[430px] bg-white rounded-[32px] shadow-2xl border-[3px] border-[#ede4ff] overflow-hidden flex flex-col p-3">
              <div className="text-center py-2.5 border-b border-[#ede4ff] mb-3">
                <div className="font-sora text-[15px] font-extrabold text-[#6d28d9]">
                  {COPY.brand.name}
                </div>
                <div className="text-[9px] text-gray-500">{COPY.hero.mockupTagline}</div>
              </div>

              <div className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                {COPY.hero.quickTilesLabel}
              </div>

              <div className="grid grid-cols-3 gap-2 flex-1 content-start">
                {QUICK_TILES.map((tile) => (
                  <button
                    key={tile.id}
                    type="button"
                    onClick={() => handleTileClick(tile.id)}
                    className="text-center group cursor-pointer"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl mx-auto mb-1 flex items-center justify-center group-hover:scale-105 transition-transform ${tile.iconBg} ${tile.iconColor}`}
                    >
                      <span className="material-symbols-outlined text-[19px]">{tile.icon}</span>
                    </div>
                    <span className="text-[9px] font-bold text-[#585265] group-hover:text-[#6d28d9]">
                      {tile.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-auto p-2 bg-[#f5f0ff] rounded-xl text-center border border-[#ede4ff]">
                <div className="text-[9px] text-gray-500">{COPY.hero.mockupFooterLabel}</div>
                <div className="text-[10px] font-bold text-[#6d28d9] mt-0.5">
                  {COPY.hero.mockupFooterValue}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
