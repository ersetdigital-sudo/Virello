export type CategoryId =
  | 'all'
  | 'pulsa'
  | 'pln'
  | 'paket-data'
  | 'pdam'
  | 'bpjs'
  | 'internet'
  | 'ewallet'
  | 'tagihan-pln'
  | 'multifinance';

export type FilterTab = 'all' | 'pulsa-data' | 'pln' | 'emoney' | 'tagihan';

export interface Product {
  id: string;
  category: CategoryId;
  filterTab: FilterTab;
  provider: string;
  providerBadgeClass: string;
  providerBadgeText: string;
  tag?: string;
  tagColor?: 'emerald' | 'violet' | 'amber' | 'blue' | 'gray';
  title: string;
  description: string;
  /** Label nominal yang tampil besar di halaman kategori (mis. "25rb", "Bulanan"). */
  nominalLabel?: string;
  /** Keterangan kecil di bawah nominal (mis. "Pulsa", "Paket Data"). */
  nominalSub?: string;
  originalPrice?: number;
  price: number;
  isBill?: boolean;
  actionText: 'Beli' | 'Top Up' | 'Cek Tagihan';
  popularScore: number;
  targetType: 'phone' | 'meter' | 'id_pelanggan' | 'bpjs_id' | 'pdam_id' | 'kontrak_id';
  targetPlaceholder: string;
  /** URL gambar produk (Cloudinary secure_url). Opsional. */
  image_url?: string | null;
  /** Nonaktifkan produk tanpa menghapusnya. */
  is_active?: boolean;
  /** Urutan tampil; makin kecil makin atas. */
  sort_order?: number;
}

export type PaymentMethodId = 'qris' | 'bca_va' | 'mandiri_va' | 'bri_va' | 'gopay' | 'dana' | 'shopeepay';

export interface PaymentMethod {
  id: PaymentMethodId;
  name: string;
  category: 'qris' | 'va' | 'ewallet';
  fee: number;
  badge?: string;
  icon: string;
}

export interface Order {
  id: string;
  invoiceNumber: string;
  productId: string;
  productTitle: string;
  provider: string;
  destination: string;
  whatsappContact: string;
  price: number;
  fee: number;
  total: number;
  paymentMethod: string;
  status: 'MENUNGGU_PEMBAYARAN' | 'SEDANG_DIPROSES' | 'BERHASIL' | 'KEDALUWARSA' | 'GAGAL';
  createdAt: string;
  serialNumber?: string;
  notes?: string;
}
