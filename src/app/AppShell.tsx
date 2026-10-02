'use client';

/**
 * Client application shell — a direct port of the original Vite App.tsx.
 * Every Next.js route renders this shell around its (metadata-only) page,
 * so the Header/Footer/modals and the pathname-driven view switch behave
 * exactly like the original single-page app.
 */

import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { HomePage } from '../components/HomePage';
import { LogoShowcase } from '../components/LogoShowcase';
import {
  CheckoutPickPage,
  CheckoutPaymentPage,
  CheckoutSuccessPage,
  CheckoutDraft,
  EMPTY_DRAFT,
} from '../views/CheckoutPages';
import { CategoryDetailPage } from '../views/CategoryDetailPage';
import { getCategoryByPath, getCategorySlug } from '../data/categories';
import { WhatsAppModal } from '../components/WhatsAppModal';
import { FaqModal } from '../components/FaqModal';

import { useRouter } from '../context/RouterContext';
import { TermsPage } from '../views/TermsPage';
import { PrivacyPage } from '../views/PrivacyPage';
import { PaymentTermsPage } from '../views/PaymentTermsPage';
import { BillerInfoPage } from '../views/BillerInfoPage';
import { HelpCenterPage } from '../views/HelpCenterPage';
import { QrisGuidePage } from '../views/QrisGuidePage';
import { OrderTrackingPage } from '../views/OrderTrackingPage';

import { CategoryId, Product, Order } from '../types';
import { INITIAL_PRODUCTS } from '../data/mockData';
import { saveOrderToStorage } from '../services/orderService';

function MainApp() {
  const { currentPath, navigate } = useRouter();

  // Modals (OrderTrackingModal removed in favor of /cek-pesanan page)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  // Alur transaksi berjalan di halaman terpisah, jadi state-nya dipegang di sini.
  const [checkoutDraft, setCheckoutDraft] = useState<CheckoutDraft>(EMPTY_DRAFT);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [lastOrderIsPln, setLastOrderIsPln] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);

  // Sync document title for homepage
  useEffect(() => {
    if (currentPath === '/') {
      document.title = 'Virello - Marketplace Produk Digital & Pembayaran QRIS';
    }
  }, [currentPath]);

  // Save new orders safely to storage
  const handleOrderCreated = (newOrder: Order) => {
    saveOrderToStorage(newOrder);
  };

  // Klik kategori membuka halaman kategori sendiri (mis. /pulsa)
  const handleOpenCategory = (cat: CategoryId) => {
    if (cat === 'all') {
      navigate('/', { scrollSelector: '#kategori' });
      return;
    }
    navigate(getCategorySlug(cat));
  };

  // Route Renderer
  const renderPageContent = () => {
    // Halaman kategori (pages/pulsa, pages/paket-data, ... di desain HTML)
    const categoryPage = getCategoryByPath(currentPath);
    if (categoryPage) {
      return (
        <CategoryDetailPage
          key={categoryPage.slug}
          category={categoryPage}
          products={INITIAL_PRODUCTS.filter((p) => p.category === categoryPage.id)}
          draft={checkoutDraft}
          onDraftChange={(patch) => setCheckoutDraft((prev) => ({ ...prev, ...patch }))}
          onContinue={(product, trxRef) => {
            setSelectedProduct(product);
            setCheckoutDraft((prev) => ({ ...prev, trxRef, payment: 'qris' }));
            navigate('/pembayaran');
          }}
          onCancel={() => navigate('/', { scrollSelector: '#kategori' })}
        />
      );
    }

    switch (currentPath) {
      case '/logo-preview':
        return <LogoShowcase />;
      case '/syarat-ketentuan':
        return <TermsPage />;
      case '/kebijakan-privasi':
        return <PrivacyPage />;
      case '/ketentuan-pembayaran':
        return <PaymentTermsPage />;
      case '/biller-resmi':
        return <BillerInfoPage />;
      case '/bantuan':
      case '/faq':
        return <HelpCenterPage />;
      case '/cara-pembayaran':
        return <QrisGuidePage />;
      case '/cek-pesanan':
        return <OrderTrackingPage />;
      case '/checkout':
        return (
          <CheckoutPickPage
            product={selectedProduct}
            draft={checkoutDraft}
            onDraftChange={(patch) => setCheckoutDraft((prev) => ({ ...prev, ...patch }))}
            onContinue={(trxRef) => {
              setCheckoutDraft((prev) => ({ ...prev, trxRef }));
              navigate('/pembayaran');
            }}
            onCancel={() => navigate('/')}
          />
        );
      case '/pembayaran':
        return (
          <CheckoutPaymentPage
            product={selectedProduct}
            draft={checkoutDraft}
            onBack={() => navigate('/checkout')}
            onConfirm={(order) => {
              handleOrderCreated(order);
              setLastOrder(order);
              setLastOrderIsPln(selectedProduct?.category === 'pln');
              navigate('/berhasil');
            }}
            onOpenTracking={() => navigate('/cek-pesanan')}
            onCancel={() => navigate('/')}
          />
        );
      case '/berhasil':
        return (
          <CheckoutSuccessPage
            order={lastOrder}
            isPln={lastOrderIsPln}
            onBuyAgain={() => navigate('/')}
            onGoHome={() => navigate('/')}
            onCancel={() => navigate('/')}
          />
        );
      default:
        // Homepage — persis mengikuti pages/index.html
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf8fe] text-[#1b1b1f] flex flex-col font-sans selection:bg-[#ede4ff] selection:text-[#6d28d9]">
      {/* 1. Header */}
      <Header
        onOpenOrderModal={() => navigate('/cek-pesanan')}
        onOpenWhatsAppModal={() => setIsWhatsAppModalOpen(true)}
      />

      <main className="w-full flex-1">{renderPageContent()}</main>

      {/* 7. Modern Marketplace Footer */}
      <Footer
        onOpenOrderModal={() => navigate('/cek-pesanan')}
        onOpenWhatsAppModal={() => setIsWhatsAppModalOpen(true)}
        onOpenFaqModal={() => navigate('/bantuan')}
        onSelectCategoryById={handleOpenCategory}
      />

      {/* Interactive Modals */}
      {isWhatsAppModalOpen && (
        <WhatsAppModal onClose={() => setIsWhatsAppModalOpen(false)} />
      )}

      {isFaqModalOpen && (
        <FaqModal
          onClose={() => setIsFaqModalOpen(false)}
          onOpenWhatsAppModal={() => {
            setIsFaqModalOpen(false);
            setIsWhatsAppModalOpen(true);
          }}
        />
      )}
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainApp />
      {children}
    </>
  );
}
