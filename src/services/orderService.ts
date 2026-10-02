/**
 * Service untuk penanganan pencarian pesanan dengan proteksi privasi,
 * validasi format, rate-limiting, dan masking data sensitif.
 */

import { Order } from '../types';
import { SAMPLE_ORDERS } from '../data/mockData';

// Rate limiting state
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 60 detik
const MAX_ATTEMPTS = 5;
let searchAttempts: number[] = [];

export interface OrderLookupResponse {
  success: boolean;
  order?: Order;
  errorMessage?: string;
  isRateLimited?: boolean;
}

/**
 * Masking nomor tujuan (nomor HP atau ID meter) untuk melindungi privasi pelanggan.
 * Contoh: "081298765432" -> "0812 •••• 5432"
 */
export function maskSensitiveDestination(destination: string): string {
  if (!destination) return '';
  const clean = destination.trim();
  if (clean.length <= 6) {
    return clean;
  }
  const prefix = clean.slice(0, 4);
  const suffix = clean.slice(-4);
  return `${prefix} •••• ${suffix}`;
}

/**
 * Validasi format nomor invoice.
 * Harus berupa format VRX-XXXXXX atau alfanumerik minimal 6 karakter.
 */
export function validateInvoiceFormat(invoiceNumber: string): {
  isValid: boolean;
  error?: string;
} {
  const clean = invoiceNumber.trim().toUpperCase();
  if (!clean) {
    return { isValid: false, error: 'Nomor invoice wajib diisi.' };
  }
  if (clean.length < 6) {
    return {
      isValid: false,
      error: 'Nomor invoice terlalu pendek (minimal 6 karakter). Contoh: VRX-892104',
    };
  }

  // Pola invoice Virello: diawali VRX- atau alfanumerik
  const regex = /^[A-Z0-9-]+$/;
  if (!regex.test(clean)) {
    return {
      isValid: false,
      error: 'Nomor invoice hanya boleh memuat huruf, angka, dan tanda hubung (-).',
    };
  }

  return { isValid: true };
}

/**
 * Mendapatkan seluruh pesanan lokal yang tersimpan di localStorage.
 */
export function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem('virello_orders');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Gagal membaca storage order:', e);
  }
  return SAMPLE_ORDERS;
}

/**
 * Menyimpan pesanan baru ke localStorage.
 */
export function saveOrderToStorage(newOrder: Order): void {
  try {
    const existing = getStoredOrders();
    const updated = [newOrder, ...existing.filter((o) => o.id !== newOrder.id)];
    localStorage.setItem('virello_orders', JSON.stringify(updated));
  } catch (e) {
    console.error('Gagal menyimpan pesanan:', e);
  }
}

/**
 * Melakukan pencarian transaksi berdasarkan nomor invoice dengan proteksi:
 * 1. Rate limiting (maksimal 5 kali percobaan per 60 detik)
 * 2. Validasi format
 * 3. Sanitasi & Masking data sensitif
 * 4. Penanganan Not Found yang aman (tidak membocorkan data lain)
 */
export async function lookupOrderByInvoice(
  inputInvoice: string
): Promise<OrderLookupResponse> {
  const now = Date.now();

  // 1. Bersihkan attempts di luar window
  searchAttempts = searchAttempts.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  // 2. Periksa rate limit
  if (searchAttempts.length >= MAX_ATTEMPTS) {
    return {
      success: false,
      isRateLimited: true,
      errorMessage:
        'Terlalu banyak percobaan pencarian dalam waktu singkat. Demi keamanan, mohon tunggu 1 menit sebelum mencoba kembali.',
    };
  }

  // Catat percobaan
  searchAttempts.push(now);

  // 3. Validasi format
  const validation = validateInvoiceFormat(inputInvoice);
  if (!validation.isValid) {
    return {
      success: false,
      errorMessage: validation.error,
    };
  }

  const queryInvoice = inputInvoice.trim().toUpperCase();

  // 4. Simulasi proses pengecekan ke server/API (500ms delay)
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Ambil database pesanan lokal
  const allOrders = getStoredOrders();

  // Cari yang nomor invoice-nya persis cocok (case-insensitive)
  const matched = allOrders.find(
    (o) => o.invoiceNumber.trim().toUpperCase() === queryInvoice
  );

  if (!matched) {
    return {
      success: false,
      errorMessage: 'Pesanan tidak ditemukan. Periksa kembali nomor invoice Anda.',
    };
  }

  // 5. Kembalikan data dengan masking nomor tujuan demi privasi
  const safeOrder: Order = {
    ...matched,
    destination: maskSensitiveDestination(matched.destination),
    whatsappContact: maskSensitiveDestination(matched.whatsappContact),
  };

  return {
    success: true,
    order: safeOrder,
  };
}
