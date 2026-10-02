import { CategoryId } from '../types';

/**
 * Metadata kategori — disalin dari halaman kategori di desain HTML
 * (`pages/pulsa`, `pages/paket-data`, `pages/token-pln`, `pages/tagihan-pln`,
 * `pages/pdam`, `pages/bpjs`, `pages/internet-tv`, `pages/e-wallet`).
 *
 * `variant` menentukan bentuk halaman detail:
 * - `nominal`: chip provider + grid nominal (Pulsa, Paket Data, Token PLN, E-Wallet)
 * - `bill`   : chip "Pilih layanan" + kotak info "Cek tagihan" (Tagihan PLN, PDAM, BPJS, Internet & TV)
 */
export interface CategoryMeta {
  id: CategoryId;
  label: string;
  desc: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  /** Rute halaman kategori (mengikuti folder di desain HTML). */
  slug: string;
  variant: 'nominal' | 'bill';
  inputLabel: string;
  inputPlaceholder: string;
  /** Judul bagian chip (mis. "Pilih provider" / "Pilih layanan"). */
  chipsTitle?: string;
  chips?: string[];
  /** Judul bagian grid nominal (mis. "Pilih nominal" / "Pilih jenis paket"). */
  nominalTitle?: string;
  /**
   * Tata letak grid nominal. `grid4` (default) untuk label pendek seperti "25rb",
   * `grid3` untuk label kata panjang seperti "Mingguan" agar tidak berdesakan.
   */
  nominalLayout?: 'grid4' | 'grid3';
  /** Tampil di sidebar kategori? (Multifinance tidak ada di desain.) */
  inSidebar?: boolean;
  is_active?: boolean;
  sort_order?: number;
}

export const CATEGORY_META: CategoryMeta[] = [
  {
    id: 'pulsa',
    label: 'Pulsa',
    desc: 'Isi pulsa semua operator.',
    icon: 'smartphone',
    iconBg: 'bg-[#f5f0ff]',
    iconColor: 'text-[#6d28d9]',
    slug: '/pulsa',
    variant: 'nominal',
    inputLabel: 'Nomor HP',
    inputPlaceholder: '0812xxxxxxxx',
    chipsTitle: 'Pilih provider',
    chips: ['Telkomsel', 'Indosat', 'XL', 'Tri', 'Smartfren', 'by.U'],
    nominalTitle: 'Pilih nominal',
  },
  {
    id: 'paket-data',
    label: 'Paket Data',
    desc: 'Internet harian, mingguan, bulanan, combo, unlimited.',
    icon: 'wifi',
    iconBg: 'bg-purple-100',
    iconColor: 'text-[#6d28d9]',
    slug: '/paket-data',
    variant: 'nominal',
    inputLabel: 'Nomor HP',
    inputPlaceholder: '0812xxxxxxxx',
    chipsTitle: 'Pilih provider',
    chips: ['Telkomsel', 'Indosat', 'XL', 'Tri', 'Smartfren', 'by.U'],
    nominalTitle: 'Pilih jenis paket',
    nominalLayout: 'grid3',
  },
  {
    id: 'pln',
    label: 'Token PLN',
    desc: 'Token listrik prabayar berdasarkan nominal.',
    icon: 'bolt',
    iconBg: 'bg-[#ffe2dc]',
    iconColor: 'text-[#e04e3b]',
    slug: '/token-pln',
    variant: 'nominal',
    inputLabel: 'Nomor meter / ID pelanggan',
    inputPlaceholder: 'Masukkan nomor meter',
    nominalTitle: 'Pilih nominal',
  },
  {
    id: 'tagihan-pln',
    label: 'Tagihan PLN',
    desc: 'Bayar tagihan PLN pascabayar.',
    icon: 'receipt_long',
    iconBg: 'bg-[#f5f0ff]',
    iconColor: 'text-[#6d28d9]',
    slug: '/tagihan-pln',
    variant: 'bill',
    inputLabel: 'ID pelanggan PLN',
    inputPlaceholder: 'Masukkan ID pelanggan',
  },
  {
    id: 'pdam',
    label: 'PDAM',
    desc: 'Pembayaran tagihan air.',
    icon: 'water_drop',
    iconBg: 'bg-cyan-50',
    iconColor: 'text-cyan-700',
    slug: '/pdam',
    variant: 'bill',
    inputLabel: 'Nomor pelanggan PDAM',
    inputPlaceholder: 'Masukkan nomor pelanggan',
    chipsTitle: 'Pilih layanan',
    chips: ['Pilih wilayah PDAM'],
  },
  {
    id: 'bpjs',
    label: 'BPJS',
    desc: 'BPJS Kesehatan dan produk terkait yang tersedia.',
    icon: 'health_and_safety',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    slug: '/bpjs',
    variant: 'bill',
    inputLabel: 'Nomor VA / No. Kartu BPJS',
    inputPlaceholder: 'Masukkan nomor',
  },
  {
    id: 'internet',
    label: 'Internet & TV',
    desc: 'IndiHome dan layanan internet/TV berlangganan lainnya.',
    icon: 'router',
    iconBg: 'bg-purple-100',
    iconColor: 'text-[#6d28d9]',
    slug: '/internet-tv',
    variant: 'bill',
    inputLabel: 'ID pelanggan',
    inputPlaceholder: 'Masukkan ID pelanggan',
    chipsTitle: 'Pilih layanan',
    chips: ['IndiHome', 'Layanan lainnya'],
  },
  {
    id: 'ewallet',
    label: 'E-Wallet',
    desc: 'Top up DANA, GoPay, OVO, ShopeePay, LinkAja, dll.',
    icon: 'account_balance_wallet',
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
    slug: '/e-wallet',
    variant: 'nominal',
    inputLabel: 'Nomor HP terdaftar',
    inputPlaceholder: '0812xxxxxxxx',
    chipsTitle: 'Pilih provider',
    chips: ['DANA', 'GoPay', 'OVO', 'ShopeePay', 'LinkAja'],
    nominalTitle: 'Pilih nominal',
  },
  {
    id: 'multifinance',
    label: 'Multifinance',
    desc: 'Bayar angsuran pembiayaan.',
    icon: 'request_quote',
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    slug: '/multifinance',
    variant: 'bill',
    inputLabel: 'Nomor kontrak',
    inputPlaceholder: 'Masukkan nomor kontrak',
    inSidebar: false,
  },
];

/** Daftar kategori untuk sidebar halaman detail (sesuai desain HTML). */
export const SIDEBAR_CATEGORIES = CATEGORY_META.filter((cat) => cat.inSidebar !== false);

export const getCategoryByPath = (path: string) =>
  CATEGORY_META.find((cat) => cat.slug === path) ?? null;

export const getCategorySlug = (id: CategoryId) =>
  id === 'all' ? '/' : (CATEGORY_META.find((cat) => cat.id === id)?.slug ?? '/');
