import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import { useRouter } from '../context/RouterContext';
import { useCatalog } from '../context/CatalogContext';
import { buildWaLink } from '../services/catalogService';
import { lookupOrderByInvoice } from '../services/orderService';

export const OrderTrackingPage: React.FC = () => {
  const { navigate } = useRouter();
  const { settings } = useCatalog();

  // Search input state
  const [invoiceInput, setInvoiceInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Result state
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedSn, setCopiedSn] = useState(false);

  useEffect(() => {
    document.title = 'Cek Status Pesanan - Virello';
  }, []);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val).replace(/\s/, '');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInvoice = invoiceInput.trim();

    if (!cleanInvoice) {
      setErrorMessage('Silakan masukkan nomor invoice Anda.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await lookupOrderByInvoice(cleanInvoice);
      setHasSearched(true);

      if (result.success && result.order) {
        setSearchedOrder(result.order);
        setErrorMessage(null);
      } else {
        setSearchedOrder(null);
        setErrorMessage(
          result.errorMessage ||
            'Pesanan tidak ditemukan. Periksa kembali nomor invoice Anda.'
        );
      }
    } catch {
      setSearchedOrder(null);
      setErrorMessage(
        'Terjadi kendala saat memeriksa pesanan. Silakan periksa koneksi internet Anda dan coba beberapa saat lagi.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSearch = () => {
    setInvoiceInput('');
    setSearchedOrder(null);
    setHasSearched(false);
    setErrorMessage(null);
  };

  const handleCopySn = (sn: string) => {
    navigator.clipboard.writeText(sn);
    setCopiedSn(true);
    setTimeout(() => setCopiedSn(false), 2000);
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* 1. Breadcrumb: Beranda / Cek Pesanan */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <li>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="hover:text-[#6d28d9] transition-colors cursor-pointer"
            >
              Beranda
            </button>
          </li>
          <li className="text-gray-300">/</li>
          <li className="text-[#6d28d9] font-bold" aria-current="page">
            Cek Pesanan
          </li>
        </ol>
      </nav>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* 2. Kondisi Awal / Search Box (Selalu tampil di atas jika belum ada hasil, atau bisa disembunyikan saat hasil aktif) */}
        {!searchedOrder ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/90 shadow-sm text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6d28d9] font-sora">
              Pelacakan Transaksi
            </span>
            <h1 className="font-sora text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              Cek Status Pesanan
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-lg mx-auto leading-relaxed">
              Masukkan nomor invoice untuk melihat status dan detail transaksi Anda.
            </p>

            {/* Form Pencarian Tunggal */}
            <form onSubmit={handleSearch} className="mt-8 max-w-lg mx-auto space-y-4">
              <div className="text-left">
                <label
                  htmlFor="invoiceInput"
                  className="font-sora font-bold text-xs text-gray-700 block mb-1.5"
                >
                  Nomor Invoice
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                    receipt_long
                  </span>
                  <input
                    id="invoiceInput"
                    type="text"
                    required
                    value={invoiceInput}
                    onChange={(e) => {
                      setInvoiceInput(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Contoh: VRX-892104"
                    disabled={isLoading}
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:border-[#6d28d9] focus:ring-2 focus:ring-[#ede4ff] text-sm text-gray-900 font-mono uppercase placeholder:normal-case placeholder:font-sans placeholder:text-gray-400 transition-all bg-white"
                  />
                </div>
              </div>

              {/* Error Message if any */}
              {errorMessage && (
                <div
                  role="alert"
                  className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-800 text-left flex items-start gap-2.5 animate-in fade-in duration-200"
                >
                  <span className="material-symbols-outlined text-[18px] text-red-600 shrink-0 mt-0.5">
                    error
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">{errorMessage}</p>
                    {hasSearched && (
                      <p className="text-[11px] text-red-600 mt-1">
                        Pastikan Anda mengetik nomor invoice sesuai yang tertera pada layar bukti bayar.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Tombol Cari Pesanan */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-[#6d28d9] hover:bg-[#5b21b6] active:scale-98 text-white font-sora font-bold text-sm shadow-xs transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Memeriksa Status Pesanan...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">search</span>
                    <span>Cari Pesanan</span>
                  </>
                )}
              </button>
            </form>

            {/* Petunjuk Lokasi Nomor Invoice */}
            <div className="mt-8 pt-6 border-t border-gray-100 max-w-lg mx-auto text-left">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#fbf8fe] border border-gray-200/80">
                <span className="material-symbols-outlined text-[20px] text-[#6d28d9] shrink-0 mt-0.5">
                  help_outline
                </span>
                <div className="text-xs text-gray-600 leading-relaxed">
                  <span className="font-sora font-bold text-gray-800 block mb-0.5">
                    Di mana menemukan nomor invoice?
                  </span>
                  Nomor invoice diawali dengan format <strong className="font-mono text-gray-900">VRX-</strong> (contoh: VRX-892104). Nomor ini diterbitkan pada layar konfirmasi setelah Anda menyelesaikan pembayaran atau tersimpan pada riwayat browser perangkat Anda.
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 3. Detail Transaksi (Tampil Hanya Jika Invoice Valid Ditemukan) */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/90 shadow-sm space-y-6 animate-in fade-in zoom-in-98 duration-200">
            {/* Header Detail */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6d28d9] font-sora block">
                  Detail Transaksi Terverifikasi
                </span>
                <h2 className="font-mono text-xl sm:text-2xl font-extrabold text-gray-900 mt-0.5">
                  {searchedOrder.invoiceNumber}
                </h2>
              </div>
              <span className="self-start sm:self-center inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold font-sora text-emerald-700 bg-emerald-50 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{searchedOrder.status}</span>
              </span>
            </div>

            {/* Kotak Nomor Seri / Kode Token Resmi (Jika Ada) */}
            {searchedOrder.serialNumber && (
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1 font-sora">
                  Nomor Seri (SN) / Kode Token Resmi:
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1">
                  <span className="font-mono font-bold text-base sm:text-lg text-emerald-950 break-all select-all">
                    {searchedOrder.serialNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopySn(searchedOrder.serialNumber!)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-sora font-bold text-xs shrink-0 cursor-pointer transition-colors shadow-2xs active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {copiedSn ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedSn ? 'Tersalin' : 'Salin Nomor Seri'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Rincian Transaksi yang Rapi dan Terstruktur */}
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Nama Produk</span>
                <span className="font-bold text-gray-900 text-right">
                  {searchedOrder.productTitle}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Provider / Biller</span>
                <span className="font-semibold text-gray-800">
                  {searchedOrder.provider}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Nomor Tujuan (Privasi Terlindungi)</span>
                <span className="font-mono font-bold text-gray-900">
                  {searchedOrder.destination}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Waktu Transaksi</span>
                <span className="text-gray-700 font-medium">
                  {searchedOrder.createdAt}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Metode Pembayaran</span>
                <span className="font-medium text-gray-900">
                  {searchedOrder.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between pt-3 text-base sm:text-lg">
                <span className="font-bold text-gray-900">Total Pembayaran</span>
                <span className="font-sora font-extrabold text-[#6d28d9]">
                  {formatRupiah(searchedOrder.total)}
                </span>
              </div>
            </div>

            {/* Action Buttons: Cari Pesanan Lain & Bantuan CS */}
            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleResetSearch}
                className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-800 font-sora font-bold text-xs transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">search</span>
                <span>Cari Pesanan Lain</span>
              </button>

              <a
                href={buildWaLink(
                  settings,
                  `Halo CS Virello, saya ingin menanyakan bantuan terkait pesanan nomor invoice: ${searchedOrder.invoiceNumber}`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-sora font-bold text-xs transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[17px]">chat</span>
                <span>Bantuan CS WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
