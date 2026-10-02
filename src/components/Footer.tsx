import React from 'react';
import { Logo } from './Logo';
import { COPY } from '../data/copywriting';
import { useRouter } from '../context/RouterContext';
import { useCatalog } from '../context/CatalogContext';
import { buildWaLink } from '../services/catalogService';

interface FooterProps {
  onOpenOrderModal?: () => void;
  onOpenWhatsAppModal?: () => void;
  onOpenFaqModal?: () => void;
  onSelectCategoryById?: (id: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategoryById }) => {
  const { navigate } = useRouter();
  const { settings } = useCatalog();

  const getBadgeIcon = (index: number) => {
    switch (index) {
      case 0:
        return 'qr_code_2';
      case 1:
        return 'grid_view';
      case 2:
        return 'chat';
      default:
        return 'check_circle';
    }
  };

  return (
    <footer className="w-full bg-[#fbf8fe] border-t border-[#e4e1e7]/80 mt-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        {/* Main Grid: Brand Identity + 3 Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-12">
          {/* Brand Identity Column (5 cols on desktop) */}
          <div className="md:col-span-5 space-y-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-left cursor-pointer"
              aria-label="Virello Home"
            >
              <Logo size="md" />
            </button>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm leading-relaxed">
              {COPY.footer.brandDesc}
            </p>

            {/* Verified Support Information Badges */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 pt-2">
              {COPY.footer.verifiedBadges.map((badge, idx) => (
                <div
                  key={badge}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200/90 text-xs font-medium text-gray-700 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#6d28d9]">
                    {getBadgeIcon(idx)}
                  </span>
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Columns (7 cols on desktop: 2 cols + 3 cols + 2 cols) */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Column 1: Layanan Digital */}
            <div>
              <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-gray-900 mb-3.5">
                {COPY.footer.sectionDigitalTitle}
              </h4>
              <ul className="space-y-2.5 text-xs text-gray-500">
                {COPY.footer.navDigital.map((item) => (
                  <li key={item.label}>
                    <a
                      href={`/#katalog`}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectCategoryById?.(item.category);
                        navigate('/', { category: item.category, scrollSelector: '#katalog' });
                      }}
                      className="hover:text-[#6d28d9] transition-colors cursor-pointer text-left block py-0.5"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Bantuan & Panduan */}
            <div>
              <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-gray-900 mb-3.5">
                {COPY.footer.sectionHelpTitle}
              </h4>
              <ul className="space-y-2.5 text-xs text-gray-500">
                {COPY.footer.navHelp.map((item) => {
                  if (item.externalUrl) {
                    const href = item.externalUrl.startsWith('https://wa.me/')
                      ? buildWaLink(settings)
                      : item.externalUrl;
                    return (
                      <li key={item.label}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-emerald-600 transition-colors block py-0.5 flex items-center gap-1 text-emerald-700 font-medium"
                        >
                          <span>{item.label}</span>
                          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                        </a>
                      </li>
                    );
                  }

                  return (
                    <li key={item.label}>
                      <a
                        href={item.path || '#'}
                        onClick={(e) => {
                          e.preventDefault();
                          if (item.path) {
                            navigate(item.path);
                          }
                        }}
                        className="hover:text-[#6d28d9] transition-colors cursor-pointer text-left block py-0.5"
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Column 3: Ketentuan & Privasi */}
            <div>
              <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-gray-900 mb-3.5">
                {COPY.footer.sectionLegalTitle}
              </h4>
              <ul className="space-y-2.5 text-xs text-gray-500">
                {COPY.footer.navLegal.map((leg) => (
                  <li key={leg.label}>
                    <a
                      href={leg.path}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(leg.path);
                      }}
                      className="hover:text-[#6d28d9] transition-colors cursor-pointer text-left block py-0.5"
                    >
                      {leg.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Structured Ecosystem Strip: Payment & Provider Groups */}
        <div className="py-6 border-t border-gray-200/80 grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-xs">
          {/* Payment Method Group */}
          <div className="md:col-span-4">
            <span className="font-sans font-bold text-[11px] uppercase tracking-wider text-gray-400 block mb-2">
              {COPY.footer.paymentGroup.label}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COPY.footer.paymentGroup.items.map((item) => (
                <span
                  key={item}
                  className="px-2.5 py-1 rounded-md bg-white border border-gray-200/90 text-[11px] font-semibold text-gray-800 shadow-2xs"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Telecom Provider Group */}
          <div className="md:col-span-4">
            <span className="font-sans font-bold text-[11px] uppercase tracking-wider text-gray-400 block mb-2">
              {COPY.footer.telecomGroup.label}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COPY.footer.telecomGroup.items.map((item) => (
                <span
                  key={item}
                  className="px-2 py-0.5 rounded-md bg-white border border-gray-200/80 text-[11px] text-gray-600"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Digital Services & Biller Group */}
          <div className="md:col-span-4">
            <span className="font-sans font-bold text-[11px] uppercase tracking-wider text-gray-400 block mb-2">
              {COPY.footer.billerGroup.label}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COPY.footer.billerGroup.items.map((item) => (
                <span
                  key={item}
                  className="px-2 py-0.5 rounded-md bg-white border border-gray-200/80 text-[11px] text-gray-600"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row: Copyright & Operational Status */}
        <div className="pt-6 border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>{COPY.footer.copyright}</div>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200/80 text-xs font-medium text-gray-700 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{COPY.footer.systemStatus}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
