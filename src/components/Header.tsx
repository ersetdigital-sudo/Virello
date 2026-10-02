import React from 'react';
import { Logo } from './Logo';
import { COPY } from '../data/copywriting';
import { useRouter } from '../context/RouterContext';

interface HeaderProps {
  onOpenOrderModal: () => void;
  onOpenWhatsAppModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenOrderModal,
  onOpenWhatsAppModal,
}) => {
  const { navigate, currentPath } = useRouter();

  const handleNavKatalog = () => {
    if (currentPath === '/') {
      const el = document.getElementById('kategori');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { scrollSelector: '#kategori' });
    }
  };

  const handleNavPromo = () => {
    if (currentPath === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const handleLogoClick = () => {
    if (currentPath === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#e4e1e7]/70 transition-all shadow-xs">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-6">
        {/* Brand & Live System Indicator */}
        <div className="flex items-center gap-3.5 shrink-0">
          <button
            onClick={handleLogoClick}
            className="flex items-center group transition-transform active:scale-95 text-left cursor-pointer"
            aria-label="Virello Home"
          >
            <Logo size="md" />
          </button>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium">{COPY.header.liveStatus}</span>
          </div>
        </div>

        {/* Navigation & Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-gray-600">
            <button
              onClick={handleNavKatalog}
              className="px-3 py-1.5 rounded-lg text-[#6d28d9] font-bold bg-[#f5f0ff] hover:bg-[#ede4ff] transition-colors cursor-pointer"
            >
              {COPY.header.navKatalog}
            </button>
            <button
              onClick={handleNavPromo}
              className="px-3 py-1.5 rounded-lg hover:text-[#6d28d9] hover:bg-gray-100/70 transition-colors cursor-pointer"
            >
              {COPY.header.navPromo}
            </button>
          </nav>

          <div className="h-5 w-px bg-gray-200 hidden lg:block"></div>

          {/* WhatsApp CS Button */}
          <button
            onClick={onOpenWhatsAppModal}
            className="inline-flex items-center gap-2 h-9 px-3 rounded-full border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold active:scale-95 transition-all shadow-2xs cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="hidden sm:inline">{COPY.header.btnWhatsApp}</span>
            <span className="sm:hidden">CS</span>
          </button>

          {/* Consistent "Cek Pesanan" Action Button */}
          <button
            onClick={() => navigate('/cek-pesanan')}
            className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-full bg-[#6d28d9] hover:bg-[#5b21b6] active:scale-95 text-white font-medium text-xs shadow-xs transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">receipt_long</span>
            <span className="font-semibold">{COPY.header.btnCekPesanan}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
