import React from 'react';
import { COPY } from '../data/copywriting';

export const ValueProps: React.FC = () => {
  return (
    <section className="w-full bg-[#f6f2f8] py-16 border-t border-[#e4e1e7]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section 5A: Alasan Memilih Virello */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6d28d9] font-sora">
            {COPY.valueProps.why.eyebrow}
          </span>
          <h2 className="font-sora text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
            {COPY.valueProps.why.title}
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            {COPY.valueProps.why.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {COPY.valueProps.why.cards.map((card, idx) => {
            const cardBgColors = [
              'bg-purple-100 text-[#6d28d9]',
              'bg-[#ffe2dc] text-[#fc6955]',
              'bg-emerald-100 text-emerald-700',
              'bg-blue-100 text-blue-700',
            ];
            return (
              <div
                key={card.title}
                className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-2xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    cardBgColors[idx % cardBgColors.length]
                  }`}
                >
                  <span className="material-symbols-outlined text-[26px]">{card.icon}</span>
                </div>
                <div>
                  <h4 className="font-sora font-bold text-base text-gray-900 mb-1.5">
                    {card.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section 5B: 4 Langkah Menyelesaikan Pesanan */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/90 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#fc6955] font-sora">
              {COPY.valueProps.steps.eyebrow}
            </span>
            <h3 className="font-sora text-xl sm:text-2xl font-bold text-gray-900 mt-1">
              {COPY.valueProps.steps.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
              {COPY.valueProps.steps.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {COPY.valueProps.steps.list.map((st, index) => (
              <div key={st.step} className="relative flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-2xl bg-[#f5f0ff] text-[#6d28d9] flex items-center justify-center mb-4 font-sora font-extrabold text-lg shadow-2xs group-hover:scale-105 transition-transform border border-purple-100">
                  <span className="material-symbols-outlined text-[26px]">{st.icon}</span>
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-gray-100 text-[11px] font-bold text-gray-600 mb-2 font-mono">
                  LANGKAH {st.step}
                </div>
                <h4 className="font-sora font-bold text-base text-gray-900 mb-1.5">
                  {st.title}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {st.desc}
                </p>

                {/* Connector line for desktop */}
                {index < 3 && (
                  <div className="hidden lg:block absolute top-7 -right-3 w-6 h-0.5 bg-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
