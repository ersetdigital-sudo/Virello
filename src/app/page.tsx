import type { Metadata } from 'next';

// Metadata-only route: the UI renders in src/app/AppShell.tsx, which mirrors
// the original SPA's pathname-driven view switch.
export const metadata: Metadata = {
  title: 'Virello - Marketplace Produk Digital & Pembayaran QRIS',
};

export default function HomePage() {
  return null;
}
