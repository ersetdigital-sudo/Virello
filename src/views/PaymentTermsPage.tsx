import React, { useEffect } from 'react';
import { useRouter } from '../context/RouterContext';

export const PaymentTermsPage: React.FC = () => {
  const { navigate } = useRouter();

  useEffect(() => {
    document.title = 'Ketentuan Pembayaran - Virello';
  }, []);

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Breadcrumb / Back button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#6d28d9] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Kembali ke Beranda</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/90 shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-100 pb-6 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6d28d9] font-sora">
            Ketentuan & Privasi
          </span>
          <h1 className="font-sora text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            Ketentuan Pembayaran QRIS
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Terakhir diperbarui: 1 Oktober 2026 • Panduan dan syarat pembayaran digital di Virello.
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-sm text-gray-700 leading-relaxed font-sans">
          <section>
            <h2 className="font-sora font-bold text-base sm:text-lg text-gray-900 mb-2">
              1. Standar Pembayaran QRIS
            </h2>
            <p>
              Virello menggunakan standar <strong>Quick Response Code Indonesian Standard (QRIS)</strong>{' '}
              sebagai metode pembayaran utama. Kode QRIS yang diterbitkan sistem checkout kami kompatibel
              dengan seluruh aplikasi mobile banking dan dompet digital yang beroperasi secara sah di Indonesia.
            </p>
          </section>

          <section>
            <h2 className="font-sora font-bold text-base sm:text-lg text-gray-900 mb-2">
              2. Biaya Layanan & Transparansi Harga
            </h2>
            <p>
              Nominal yang ditampilkan pada ringkasan pembayaran checkout adalah jumlah total yang harus
              dibayarkan. Pembayaran via QRIS tidak dikenakan biaya tambahan tersembunyi dari Virello.
              Pastikan Anda membayar tepat sesuai nominal yang tertera pada kode QRIS.
            </p>
          </section>

          <section>
            <h2 className="font-sora font-bold text-base sm:text-lg text-gray-900 mb-2">
              3. Batas Waktu Pembayaran
            </h2>
            <p>
              Setiap kode QRIS memiliki masa berlaku checkout tertentu (tertera di layar checkout).
              Pengguna disarankan menyelesaikan pemindaian dan konfirmasi pembayaran sebelum batas waktu
              berakhir guna memastikan harga produk dan ketersediaan stok tidak mengalami perubahan.
            </p>
          </section>

          <section>
            <h2 className="font-sora font-bold text-base sm:text-lg text-gray-900 mb-2">
              4. Verifikasi dan Penyelesaian Otomatis
            </h2>
            <p>
              Setelah Anda memasukkan PIN transaksi di aplikasi pembayaran perbankan/dompet digital Anda,
              sistem settlement QRIS akan mengirimkan notifikasi lunas ke sistem kami secara otomatis.
              Halaman transaksi akan langsung memuat status "BERHASIL" dan menampilkan nomor seri (SN)
              resmi atau kode token 20 digit PLN.
            </p>
          </section>

          <section>
            <h2 className="font-sora font-bold text-base sm:text-lg text-gray-900 mb-2">
              5. Penanganan Kendala Transaksi
            </h2>
            <p>
              Jika saldo perbankan Anda telah terpotong namun halaman transaksi belum memperbarui status,
              jangan panik. Catat nomor invoice Anda (misalnya VRX-XXXXXX) dan hubungi Customer Service
              kami melalui WhatsApp dengan melampirkan tangkapan layar bukti mutasi pembayaran untuk
              diverifikasi manual.
            </p>
          </section>

          <section className="p-4 sm:p-5 rounded-2xl bg-[#fbf8fe] border border-gray-200">
            <h3 className="font-sora font-bold text-sm text-gray-900 mb-1">
              Butuh Panduan Pembayaran?
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-3">
              Pelajari panduan visual langkah demi langkah cara membayar dengan kode QRIS.
            </p>
            <button
              type="button"
              onClick={() => navigate('/cara-pembayaran')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6d28d9] hover:bg-[#5b21b6] text-white font-sora font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <span>Buka Panduan QRIS</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};
