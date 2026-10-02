import React from 'react';
import { COPY } from '../data/copywriting';

interface FlashSaleStripProps {
  onFilterPromo: () => void;
}

export const FlashSaleStrip: React.FC<FlashSaleStripProps> = ({ onFilterPromo }) => {
  return (
    <div
      id="hotdeals"
      className="mb-8 p-4 sm:p-5 rounded-2xl bg-gray-900 border border-gray-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm scroll-mt-24"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-yellow-300 shrink-0 border border-white/10">
          <span className="material-symbols-outlined text-[26px]">local_offer</span>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-[#fc6955] text-[10px] font-bold uppercase tracking-wider text-white">
              {COPY.promo.badge}
            </span>
            <h3 className="font-sora font-bold text-base sm:text-lg text-white">
              {COPY.promo.title}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 mt-0.5 leading-relaxed">
            {COPY.promo.desc}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
        <button
          type="button"
          onClick={onFilterPromo}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-gray-900 hover:bg-gray-100 active:scale-95 font-sora font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer whitespace-nowrap"
        >
          <span>{COPY.promo.btnViewPromo}</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
