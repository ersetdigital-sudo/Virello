import React, { useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { useCatalog } from '../context/CatalogContext';
import { buildWaLink } from '../services/catalogService';

export const PrivacyPage: React.FC = () => {
  const { navigate } = useRouter();
  const { settings } = useCatalog();

  useEffect(() => {
    document.title = 'Kebijakan Privasi - Virello';
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
            Kebijakan Privasi
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Terakhir diperbarui: 1 Oktober 2026 • Kebijakan perlindungan data pengguna di Virello.
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-sm text-gray-700 leading-relaxed font-sans">
          <section>
            <h2 className="font-sora font-bold text-base sm:text-lg text-gray-900 mb-2">
              1. Komitmen Privasi
            </h2>
            <p>
              Virello menghargai privasi setiap pelanggan. Kebijakan ini menjelaskan jenis informasi
              yang kami proses saat Anda melakukan transaksi pengisian pulsa, token listrik, saldo
              digital, maupun pembayaran tagihan, serta bagaimana kami menjaga kerahasiaan informasi
              tersebut.
            </p>
          </section>

          <section>
            <h2 className="font-sora font-bold text-base sm:text-lg text-gray-900 mb-2">
              2. Data yang Kami Proses
            </h2>
            <p className="mb-2">
              Karena Virello beroperasi tanpa sistem registrasi akun, kami hanya mengumpulkan data
              esensial yang dibutuhkan untuk eksekusi transaksi:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li>
                <strong>Nomor Tujuan Transaksi:</strong> Nomor telepon seluler, nomor meter / ID
                Pelanggan PLN, nomor virtual account BPJS, atau nomor kontrak pembiayaan yang Anda
                masukkan untuk tujuan pengisian.
              </li>
              <li>
                <strong>Nomor WhatsApp (Opsional):</strong> Nomor kontak yang Anda isi secara sukarela
                untuk menerima salinan nota pembayaran digital.
              </li>
              <li>
                <strong>Data Transaksi:</strong> Waktu transaksi, nomor invoice unik, nominal
                pembayaran, dan status transaksi.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-sora font-bold text-base sm:text-lg text-gray-900 mb-2">
              3. Penggunaan Informasi
            </h2>
            <p>Informasi yang dimasukkan hanya digunakan untuk tujuan:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 mt-2">
              <li>Meneruskan permintaan transaksi Anda ke gerbang pembayaran QRIS dan penyedia biller resmi.</li>
              <li>Menampilkan status penyelesaian transaksi dan Nomor Seri (SN) pada layar Anda.</li>
              <li>Membantu proses pengecekan transaksi jika Anda mengajukan pertanyaan ke Customer Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-sora font-bold text-base sm:text-lg text-gray-900 mb-2">
              4. Penyimpanan Riwayat Transaksi Lokal
            </h2>
            <p>
              Riwayat pesanan yang Anda lihat pada menu Cek Pesanan disimpan secara lokal pada browser
              perangkat Anda (Local Storage). Data ini tidak disimpan dalam profil akun terpusat kami
              dan dapat Anda bersihkan kapan saja dengan menghapus cache/riwayat browser Anda.
            </p>
          </section>

          <section>
            <h2 className="font-sora font-bold text-base sm:text-lg text-gray-900 mb-2">
              5. Larangan Penjualan Data
            </h2>
            <p>
              Virello tidak pernah dan tidak akan pernah menjual, menyewakan, atau memperdagangkan data
              nomor telepon atau identitas transaksi pengguna kepada pihak ketiga untuk kepentingan iklan
              atau pemasaran pihak lain.
            </p>
          </section>

          <section className="p-4 sm:p-5 rounded-2xl bg-[#fbf8fe] border border-gray-200">
            <h3 className="font-sora font-bold text-sm text-gray-900 mb-1">
              Pertanyaan Seputar Privasi
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-3">
              Jika Anda memiliki pertanyaan mengenai perlindungan data di Virello, hubungi tim kami melalui WhatsApp.
            </p>
            <a
              href={buildWaLink(
                settings,
                'Halo CS Virello, saya ingin bertanya mengenai kebijakan privasi.'
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
