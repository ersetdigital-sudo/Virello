import React from 'react';
import { COPY } from '../data/copywriting';

interface GuaranteeSectionProps {
  onOpenOrderModal: () => void;
  onOpenWhatsAppModal: () => void;
}

export const GuaranteeSection: React.FC<GuaranteeSectionProps> = ({
  onOpenOrderModal,
  onOpenWhatsAppModal,
}) => {
  const cards = [
    {
      ...COPY.guarantee.cards[0],
      action: onOpenOrderModal,
      badgeColor: 'text-[#6d28d9] bg-[#f5f0ff] border-purple-100',
      iconBoxColor: 'bg-[#f5f0ff] text-[#6d28d9] border-purple-100',
      btnStyle:
        'bg-[#f5f0ff] hover:bg-[#ede4ff] text-[#6d28d9] border border-purple-200/80 hover:border-purple-300',
    },
    {
      ...COPY.guarantee.cards[1],
      action: onOpenWhatsAppModal,
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-100',
      iconBoxColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      btnStyle:
        'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs',
    },
    {
      ...COPY.guarantee.cards[2],
      action: onOpenOrderModal,
      badgeColor: 'text-blue-700 bg-blue-50 border-blue-100',
      iconBoxColor: 'bg-blue-50 text-blue-600 border-blue-100',
      btnStyle:
        'bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200 hover:border-gray-300',
    },
  ];

  return (
    <section className="w-full bg-[#fbf8fe] py-16 border-t border-[#e4e1e7]/70">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6d28d9] font-sora">
            {COPY.guarantee.eyebrow}
          </span>
          <h2 className="font-sora text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
            {COPY.guarantee.headline}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
            {COPY.guarantee.desc}
          </p>
        </div>

        {/* 3 Modern Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {cards.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-purple-200 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Header: Icon + Category Badge */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${c.iconBoxColor}`}
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      {c.icon}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border font-sora ${c.badgeColor}`}
                  >
                    {c.category}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-sora font-bold text-base sm:text-lg text-gray-900 leading-snug mb-2">
                  {c.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  {c.desc}
                </p>
              </div>

              {/* Bottom CTA */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={c.action}
                  className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-sora font-bold text-xs sm:text-sm transition-all cursor-pointer active:scale-98 ${c.btnStyle}`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {c.btnIcon}
                  </span>
                  <span>{c.btnText}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
