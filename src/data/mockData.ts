import { Product, PaymentMethod, Order, CategoryId, FilterTab } from '../types';

/* ══════════════════════════════════════════════════════════════
   Katalog — datanya disalin dari desain HTML per kategori.
   Nominal di desain (mis. 5rb … 100rb) dibuat untuk tiap provider,
   sehingga chip provider memfilter grid nominal.
   ══════════════════════════════════════════════════════════════ */

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

interface ProviderSpec {
  name: string;
  badge: string;
}

interface NominalSpec {
  /** Label besar di kartu (mis. "25rb" atau "Bulanan"). */
  label: string;
  price: number;
  originalPrice?: number;
}

/** Provider seluler untuk Pulsa & Paket Data (sesuai chip di desain). */
const CELULAR_PROVIDERS: ProviderSpec[] = [
  { name: 'Telkomsel', badge: 'bg-red-50 text-red-700 border-red-200' },
  { name: 'Indosat', badge: 'bg-yellow-50 text-yellow-800 border-yellow-200' },
  { name: 'XL', badge: 'bg-blue-50 text-blue-800 border-blue-200' },
  { name: 'Tri', badge: 'bg-violet-50 text-violet-700 border-violet-200' },
  { name: 'Smartfren', badge: 'bg-pink-50 text-pink-700 border-pink-200' },
  { name: 'by.U', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
];

const PLN_PROVIDERS: ProviderSpec[] = [
  { name: 'PLN Prabayar', badge: 'bg-amber-50 text-amber-800 border-amber-200' },
];

/** Provider E-Wallet (sesuai chip di desain). */
const EWALLET_PROVIDERS: ProviderSpec[] = [
  { name: 'DANA', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'GoPay', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { name: 'OVO', badge: 'bg-violet-50 text-violet-700 border-violet-200' },
  { name: 'ShopeePay', badge: 'bg-orange-50 text-orange-700 border-orange-200' },
  { name: 'LinkAja', badge: 'bg-red-50 text-red-700 border-red-200' },
];

const PULSA_NOMINALS: NominalSpec[] = [
  { label: '5rb', price: 6500, originalPrice: 7000 },
  { label: '10rb', price: 11500 },
  { label: '15rb', price: 16500 },
  { label: '20rb', price: 21500 },
  { label: '25rb', price: 26500, originalPrice: 27500 },
  { label: '50rb', price: 51500 },
  { label: '75rb', price: 76500 },
  { label: '100rb', price: 101500 },
];

const PAKET_DATA_NOMINALS: NominalSpec[] = [
  { label: 'Harian', price: 6500 },
  { label: 'Mingguan', price: 28000 },
  { label: 'Bulanan', price: 75000, originalPrice: 85000 },
  { label: 'Combo', price: 95000 },
  { label: 'Unlimited', price: 125000 },
];

const TOKEN_PLN_NOMINALS: NominalSpec[] = [
  { label: '20rb', price: 20500 },
  { label: '50rb', price: 50500 },
  { label: '100rb', price: 100500 },
  { label: '200rb', price: 200500 },
  { label: '500rb', price: 500500 },
  { label: '1jt', price: 1000500 },
];

const EWALLET_NOMINALS: NominalSpec[] = [
  { label: '10rb', price: 10500 },
  { label: '20rb', price: 20500 },
  { label: '25rb', price: 25500 },
  { label: '50rb', price: 50500 },
  { label: '100rb', price: 100500 },
  { label: '200rb', price: 200500 },
];

function buildNominalProducts(opts: {
  category: CategoryId;
  filterTab: FilterTab;
  sub: string;
  nominals: NominalSpec[];
  providers: ProviderSpec[];
  targetType: Product['targetType'];
  placeholder: string;
  actionText: Product['actionText'];
}): Product[] {
  const list: Product[] = [];
  opts.providers.forEach((prov) => {
    opts.nominals.forEach((nom, idx) => {
      list.push({
        id: `${slugify(opts.category)}-${slugify(prov.name)}-${slugify(nom.label)}`,
        category: opts.category,
        filterTab: opts.filterTab,
        provider: prov.name,
        providerBadgeClass: prov.badge,
        providerBadgeText: prov.name,
        title: `${prov.name} ${nom.label}`,
        description: `${opts.sub} ${prov.name} ${nom.label}.`,
        nominalLabel: nom.label,
        nominalSub: opts.sub,
        originalPrice: nom.originalPrice,
        price: nom.price,
        actionText: opts.actionText,
        popularScore: 100 - idx,
        targetType: opts.targetType,
        targetPlaceholder: opts.placeholder,
      });
    });
  });
  return list;
}

/** Kategori tagihan — input nomor lalu "Cek tagihan". */
const BILL_PRODUCTS: Product[] = [
  {
    id: 'tagihan-pln-pascabayar',
    category: 'tagihan-pln',
    filterTab: 'tagihan',
    provider: 'PLN Pascabayar',
    providerBadgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    providerBadgeText: 'PLN Pascabayar',
    title: 'Tagihan PLN Pascabayar',
    description: 'Pembayaran tagihan listrik PLN pascabayar.',
    price: 187500,
    isBill: true,
    actionText: 'Cek Tagihan',
    popularScore: 96,
    targetType: 'meter',
    targetPlaceholder: 'Masukkan ID pelanggan',
  },
  {
    id: 'tagihan-pdam',
    category: 'pdam',
    filterTab: 'tagihan',
    provider: 'PDAM',
    providerBadgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    providerBadgeText: 'PDAM',
    title: 'Tagihan Air PDAM',
    description: 'Pembayaran tagihan air PDAM.',
    price: 145000,
    isBill: true,
    actionText: 'Cek Tagihan',
    popularScore: 92,
    targetType: 'pdam_id',
    targetPlaceholder: 'Masukkan nomor pelanggan',
  },
  {
    id: 'tagihan-bpjs',
    category: 'bpjs',
    filterTab: 'tagihan',
    provider: 'BPJS Kesehatan',
    providerBadgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    providerBadgeText: 'BPJS Kesehatan',
    title: 'Iuran BPJS Kesehatan',
    description: 'Pembayaran iuran BPJS Kesehatan.',
    price: 150000,
    isBill: true,
    actionText: 'Cek Tagihan',
    popularScore: 94,
    targetType: 'bpjs_id',
    targetPlaceholder: 'Masukkan nomor',
  },
  {
    id: 'tagihan-indihome',
    category: 'internet',
    filterTab: 'tagihan',
    provider: 'IndiHome',
    providerBadgeClass: 'bg-violet-50 text-violet-700 border-violet-200',
    providerBadgeText: 'IndiHome',
    title: 'Tagihan IndiHome & Telkom',
    description: 'Pembayaran tagihan internet & TV IndiHome.',
    price: 385000,
    isBill: true,
    actionText: 'Cek Tagihan',
    popularScore: 90,
    targetType: 'id_pelanggan',
    targetPlaceholder: 'Masukkan ID pelanggan',
  },
  {
    id: 'tagihan-multifinance',
    category: 'multifinance',
    filterTab: 'tagihan',
    provider: 'Multifinance',
    providerBadgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    providerBadgeText: 'Multifinance',
    title: 'Angsuran Kredit Multifinance',
    description: 'Bayar cicilan pembiayaan sesuai nomor kontrak.',
    price: 3500,
    isBill: true,
    actionText: 'Cek Tagihan',
    popularScore: 86,
    targetType: 'kontrak_id',
    targetPlaceholder: 'Masukkan nomor kontrak',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  ...buildNominalProducts({
    category: 'pulsa',
    filterTab: 'pulsa-data',
    sub: 'Pulsa',
    nominals: PULSA_NOMINALS,
    providers: CELULAR_PROVIDERS,
    targetType: 'phone',
    placeholder: '0812xxxxxxxx',
    actionText: 'Beli',
  }),
  ...buildNominalProducts({
    category: 'paket-data',
    filterTab: 'pulsa-data',
    sub: 'Paket Data',
    nominals: PAKET_DATA_NOMINALS,
    providers: CELULAR_PROVIDERS,
    targetType: 'phone',
    placeholder: '0812xxxxxxxx',
    actionText: 'Beli',
  }),
  ...buildNominalProducts({
    category: 'pln',
    filterTab: 'pln',
    sub: 'Token PLN',
    nominals: TOKEN_PLN_NOMINALS,
    providers: PLN_PROVIDERS,
    targetType: 'meter',
    placeholder: 'Masukkan nomor meter',
    actionText: 'Beli',
  }),
  ...buildNominalProducts({
    category: 'ewallet',
    filterTab: 'emoney',
    sub: 'E-Wallet',
    nominals: EWALLET_NOMINALS,
    providers: EWALLET_PROVIDERS,
    targetType: 'phone',
    placeholder: '0812xxxxxxxx',
    actionText: 'Top Up',
  }),
  ...BILL_PRODUCTS,
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'qris',
    name: 'QRIS (Semua E-Wallet & Mobile Banking)',
    category: 'qris',
    fee: 0,
    badge: 'Tanpa Biaya Tambahan',
    icon: 'qr_code_scanner',
  },
  {
    id: 'bca_va',
    name: 'BCA Virtual Account',
    category: 'va',
    fee: 1000,
    badge: 'Konfirmasi Otomatis',
    icon: 'account_balance',
  },
  {
    id: 'mandiri_va',
    name: 'Mandiri Virtual Account (Livin\')',
    category: 'va',
    fee: 1000,
    badge: 'Konfirmasi Otomatis',
    icon: 'account_balance',
  },
  {
    id: 'bri_va',
    name: 'BRI Virtual Account (BRIMO)',
    category: 'va',
    fee: 1000,
    badge: 'Konfirmasi Otomatis',
    icon: 'account_balance',
  },
  {
    id: 'gopay',
    name: 'GoPay Direct',
    category: 'ewallet',
    fee: 0,
    badge: 'Aplikasi GoPay',
    icon: 'account_balance_wallet',
  },
  {
    id: 'dana',
    name: 'DANA Saldo / App',
    category: 'ewallet',
    fee: 0,
    badge: 'Aplikasi DANA',
    icon: 'account_balance_wallet',
  },
];

export const SAMPLE_ORDERS: Order[] = [
  {
    id: 'ord-1',
    invoiceNumber: 'VRX-892104',
    productId: 'pulsa-telkomsel-25rb',
    productTitle: 'Telkomsel 25rb',
    provider: 'Telkomsel',
    destination: '081298765432',
    whatsappContact: '081298765432',
    price: 26500,
    fee: 0,
    total: 26500,
    paymentMethod: 'QRIS',
    status: 'BERHASIL',
    createdAt: '2026-10-01 08:34:12',
    serialNumber: '02891238910283918239',
    notes: 'Pengisian pulsa berhasil diproses oleh provider.',
  },
  {
    id: 'ord-2',
    invoiceNumber: 'VRX-774019',
    productId: 'pln-pln-prabayar-50rb',
    productTitle: 'PLN Prabayar 50rb',
    provider: 'PLN Prabayar',
    destination: '14289012839',
    whatsappContact: '085712398471',
    price: 50500,
    fee: 0,
    total: 50500,
    paymentMethod: 'QRIS',
    status: 'BERHASIL',
    createdAt: '2026-09-30 19:12:05',
    serialNumber: '2849-1029-4820-9182-3719',
    notes: 'Kode stroom 20 digit diterbitkan oleh PLN.',
  },
];
