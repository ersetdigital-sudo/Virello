import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import AppShell from './AppShell';
import './globals.css';

// Metadata mirrors the original index.html <head> exactly.
export const metadata: Metadata = {
  title: 'Virello — Pembelian Produk Digital & Tagihan',
  description:
    'Pilihan pulsa, paket data, token listrik PLN, saldo uang elektronik, dan pembayaran tagihan rutin dalam satu tempat.',
  openGraph: {
    title: 'Virello — Pembelian Produk Digital & Tagihan',
    description:
      'Pilihan pulsa, paket data, token listrik PLN, saldo uang elektronik, dan pembayaran tagihan rutin dalam satu tempat.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@100..800&family=Inter+Tight:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#fbf8fe] text-[#1b1b1f] antialiased selection:bg-[#ede4ff] selection:text-[#6d28d9]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
