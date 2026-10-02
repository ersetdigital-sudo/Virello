import React, { useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { useCatalog } from '../context/CatalogContext';
import { buildWaLink } from '../services/catalogService';

export const TermsPage: React.FC = () => {
  const { navigate } = useRouter();
  const { settings } = useCatalog();

  useEffect(() => {
    document.title = 'Syarat & Ketentuan Layanan - Virello';
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
            Syarat & Ketentuan Layanan
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Terakhir diperbarui: 1 Oktober 2026 • Ketentuan umum penggunaan marketplace produk digital Virello.
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-sm text-gray-700 leading-relaxed font-sans">
          <section>
            <h2 className="font-sora font-bold text-base sm:text-lg text-gray-900 mb-2">
              1. Gambaran Umum Layanan
            </h2>
            <p>
              Virello adalah platform perantara transaksi produk digital di Indonesia yang melayani
              pembelian pulsa seluler reguler, paket data internet, token listrik PLN prabayar, isi
              ulang saldo dompet digital (e-wallet), dan pembayaran tagihan rutin seperti BPJS
              Kesehatan, PDAM, IndiHome, serta angsuran multifinance.
            </p>
          </section>

          <section>
            <h2 className="font-sora font-bold text-base sm:text-lg text-gray-900 mb-2">
              2. Transaksi Tanpa Pembuatan Akun
            </h2>
            <p>
              Virello tidak mewajibkan pengguna untuk membuat akun atau mendaftar kata sandi untuk
              melakukan transaksi. Pengguna dapat memilih produk, memasukkan identitas tujuan transaksi,
              dan menyelesaikan pembayaran secara langsung demi kenyamanan dan kecepatan transaksi.
            </p>
          </section>

          <section>
            <h2 className="font-sora font-bold text-base sm:text-lg text-gray-900 mb-2">
              3. Tanggung Jawab Keakuratan Data Tujuan
            </h2>
            <p>
              Pengguna bertanggung jawab penuh atas kebenaran dan keakuratan nomor tujuan transaksi,
              seperti nomor ponsel, nomor meter PLN, nomor virtual account BPJS, atau ID pelanggan
              tagihan. Transaksi yang telah diproses ke nomor atau ID tujuan yang keliru atas kelalaian
              pengguna tidak dapat dibatalkan atau ditarik kembali.
            </p>
          </section>

          <section>
            <h2 className="font-sora font-bold text-base sm:text-lg text-gray-900 mb-2">
              4. Metode Pembayaran QRIS Standar Nasional
            </h2>
            <p>
              Seluruh transaksi di Virello diselesaikan menggunakan standar kode QRIS nasional.
              Pengguna dapat memindai kode QRIS menggunakan berbagai aplikasi perbankan digital
              (mobile banking) dan dompet digital berizin Bank Indonesia. Pembayaran harus diselesaikan
              dalam rentang waktu yang tertera pada layar checkout.
            </p>
          </section>

          <section>
            <h2 className="font-sora font-bold text-base sm:text-lg text-gray-900 mb-2">
              5. Pengiriman Nomor Seri (SN) & Bukti Transaksi
            </h2>
            <p>
              Setelah dana diverifikasi oleh sistem perbankan/QRIS, pesanan otomatis diteruskan ke
              sistem biller atau operator telekomunikasi terkait. Bukti transaksi beserta Nomor Seri
              resmi (SN) dari operator atau kode token 20 digit PLN ditampilkan pada layar transaksi
              dan dapat diakses kembali melalui menu Cek Pesanan.
            </p>
          </section>

          <section>
            <h2 className="font-sora font-bold text-base sm:text-lg text-gray-900 mb-2">
              6. Kebijakan Pembatalan & Pengembalian Dana (Refund)
            </h2>
            <p>
              Produk digital yang telah terisi dan diverifikasi berhasil oleh provider tidak dapat
              dibatalkan. Apabila terjadi kendala sistem di mana saldo terpotong namun transaksi
              dinyatakan gagal oleh pihak provider setelah melalui proses pengecekan tim kami,
              pengguna berhak mendapatkan pengembalian dana melalui koordinasi dengan Customer Service
              kami di WhatsApp.
            </p>
          </section>

          <section className="p-4 sm:p-5 rounded-2xl bg-[#fbf8fe] border border-gray-200">
            <h3 className="font-sora font-bold text-sm text-gray-900 mb-1">
              Pusat Layanan Pelanggan
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-3">
              Jika Anda memiliki pertanyaan terkait syarat dan ketentuan ini, hubungi Customer Service
              Virello melalui WhatsApp resmi.
            </p>
            <a
              href={buildWaLink(
                settings,
                'Halo CS Virello, saya ingin bertanya mengenai syarat dan ketentuan layanan.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-sora font-bold text-xs shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>Hubungi CS WhatsApp</span>
            </a>
          </section>
        </div>
      </div>
    </div>
  );
};
