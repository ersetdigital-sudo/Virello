import React from 'react';
import { CategoryId } from '../types';
import { COPY } from '../data/copywriting';
import { CATEGORY_META } from '../data/categories';

interface CategoryGridProps {
  /** Membuka halaman kategori sendiri (mis. /pulsa), bukan scroll ke katalog. */
  onOpenCategory: (cat: CategoryId) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onOpenCategory }) => {
  return (
    <section id="kategori-section" className="w-full py-10 lg:py-14 scroll-mt-24">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-sora text-2xl sm:text-[28px] font-extrabold tracking-[-0.02em] text-gray-950">
              {COPY.categories.sectionTitle}
            </h2>
            <p className="text-sm text-[#585265] mt-1.5">{COPY.categories.sectionDesc}</p>
          </div>
          <a
            href="#katalog"
            className="inline-flex items-center gap-1 text-[13px] font-sora font-bold text-[#6d28d9] hover:text-[#5b21b6] transition-colors self-start sm:self-auto"
          >
            <span>{COPY.categories.tabAll}</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {CATEGORY_META.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onOpenCategory(cat.id)}
              className="group flex items-center gap-3.5 p-4 rounded-2xl border bg-white border-[#e4e1e7] hover:border-[#6d28d9] hover:-translate-y-0.5 hover:shadow-md transition-all text-left cursor-pointer"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${cat.iconBg} ${cat.iconColor}`}
              >
                <span className="material-symbols-outlined text-[24px]">{cat.icon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-sora text-sm font-bold leading-snug text-gray-900 group-hover:text-[#6d28d9]">
                  {cat.label}
                </div>
              </div>
              <span className="material-symbols-outlined text-[18px] shrink-0 text-gray-300 group-hover:text-[#6d28d9]">
                chevron_right
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
