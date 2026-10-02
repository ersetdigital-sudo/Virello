import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { useCatalog } from '../context/CatalogContext';
import { buildWaLink } from '../services/catalogService';

export const HelpCenterPage: React.FC = () => {
  const { navigate } = useRouter();
  const { settings } = useCatalog();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = 'Pusat Bantuan & FAQ - Virello';
  }, []);

  const faqs = [
    {
      q: 'Apakah saya perlu mendaftar akun untuk bertransaksi di Virello?',
      a: 'Tidak perlu. Anda dapat langsung memilih produk yang diinginkan, memasukkan nomor tujuan atau ID pelanggan, dan menyelesaikan pembayaran via QRIS tanpa perlu proses pendaftaran atau verifikasi akun.',
      category: 'Akun & Transaksi',
    },
    {
      q: 'Berapa lama waktu yang dibutuhkan hingga transaksi selesai diproses?',
      a: 'Setelah pembayaran terverifikasi melalui QRIS (biasanya dalam hitungan detik), sistem langsung meneruskan pesanan ke sistem operator/biller. Nomor seri (SN) pulsa atau 20 digit kode token PLN langsung tampil pada layar Anda.',
      category: 'Proses Pesanan',
    },
    {
      q: 'Metode pembayaran apa saja yang didukung?',
      a: 'Virello menggunakan kode pembayaran QRIS standar nasional yang dapat dipindai oleh semua aplikasi dompet digital (GoPay, DANA, OVO, ShopeePay, LinkAja) serta seluruh aplikasi mobile banking (BCA, Mandiri Livin, BRImo, BNI, CIMB, dan lainnya).',
      category: 'Pembayaran',
    },
    {
      q: 'Bagaimana jika pembayaran sudah terpotong namun status belum berubah?',
      a: 'Pastikan Anda menyimpan bukti mutasi perbankan atau nomor invoice (misalnya VRX-892104). Anda dapat memuat ulang status pada menu "Cek Pesanan" atau langsung menghubungi Customer Service kami melalui WhatsApp dengan melampirkan screenshot bukti transfer untuk diproses verifikasi manual.',
      category: 'Kendala Transaksi',
    },
    {
      q: 'Bagaimana cara memeriksa kembali riwayat transaksi yang pernah dilakukan?',
      a: 'Kunjungi halaman "Cek Pesanan" di menu navigasi atas atau footer. Anda dapat mencari pesanan berdasarkan nomor invoice atau nomor tujuan yang digunakan saat transaksi.',
      category: 'Riwayat Pesanan',
    },
    {
      q: 'Apa itu Nomor Seri (SN) resmi provider?',
      a: 'Nomor Seri (Serial Number / SN) adalah kode identifikasi resmi yang diterbitkan oleh operator telekomunikasi sebagai bukti sah bahwa pulsa atau paket data telah berhasil diisi ke nomor tujuan Anda.',
      category: 'Bukti Transaksi',
    },
    {
      q: 'Bagaimana jika saya salah memasukkan nomor tujuan saat checkout?',
      a: 'Karena produk digital diproses secara otomatis begitu pembayaran terverifikasi, mohon selalu periksa ketepatan nomor ponsel atau ID meter sebelum memindai QRIS. Transaksi yang telah berhasil terisi ke nomor tujuan yang salah akibat kelalaian input tidak dapat ditarik kembali.',
      category: 'Ketentuan',
    },
    {
      q: 'Bagaimana cara memasukkan token listrik PLN yang sudah dibeli ke meteran?',
      a: 'Setelah transaksi selesai, kode 20 digit angka stroom token PLN akan ditampilkan pada layar. Masukkan 20 digit tersebut secara berurutan ke keypad meteran listrik prabayar Anda, lalu tekan tombol Enter (warna hijau/panah). Meteran akan menampilkan status "BENAR" dan jumlah kWh akan bertambah.',
      category: 'Token Listrik',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Hero Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/90 shadow-sm text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6d28d9] font-sora">
            Bantuan & Panduan
          </span>
          <h1 className="font-sora text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            Pusat Bantuan & Pertanyaan Umum
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-xl mx-auto">
            Temukan solusi atas pertanyaan seputar pembelian produk digital, pembayaran QRIS, dan kendala transaksi di Virello.
          </p>

          {/* FAQ Search Bar */}
          <div className="mt-6 max-w-lg mx-auto relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pertanyaan (misal: refund, token PLN, invoice)..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#fbf8fe] border border-gray-200 focus:outline-none focus:border-[#6d28d9] focus:bg-white focus:ring-2 focus:ring-[#ede4ff] text-sm text-gray-900 font-medium transition-all"
            />
          </div>
        </div>

        {/* Quick Action Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => navigate('/cek-pesanan')}
            className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-purple-200 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#f5f0ff] text-[#6d28d9] flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[22px]">manage_search</span>
              </div>
              <h3 className="font-sora font-bold text-sm text-gray-900 mb-1">
                Cek Status Pesanan
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Lacak transaksi dengan nomor invoice atau nomor tujuan Anda.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-bold text-[#6d28d9] flex items-center gap-1">
              <span>Buka Pelacakan</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </div>
          </div>

          <div
            onClick={() => navigate('/cara-pembayaran')}
            className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-purple-200 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6d28d9] flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[22px]">qr_code_scanner</span>
              </div>
              <h3 className="font-sora font-bold text-sm text-gray-900 mb-1">
                Panduan Bayar QRIS
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Langkah-langkah praktis menyelesaikan pembayaran via m-banking/e-wallet.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-bold text-[#6d28d9] flex items-center gap-1">
              <span>Buka Panduan</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </div>
          </div>

          <a
            href={buildWaLink(
              settings,
              'Halo CS Virello, saya membutuhkan bantuan terkait pesanan.'
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[22px]">chat</span>
              </div>
              <h3 className="font-sora font-bold text-sm text-gray-900 mb-1">
                CS WhatsApp Resmi
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Hubungi tim layanan bantuan kami langsung di WhatsApp.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-bold text-emerald-600 flex items-center gap-1">
              <span>Chat WhatsApp</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </div>
          </a>
        </div>

        {/* FAQ Accordion List */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm">
          <h2 className="font-sora font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6d28d9]">help_center</span>
            <span>Daftar Pertanyaan yang Sering Diajukan</span>
          </h2>

          {filteredFaqs.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm">
              Tidak ada pertanyaan yang sesuai dengan kata kunci "{searchQuery}".
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={faq.q}
                    className="border border-gray-200 rounded-2xl overflow-hidden transition-all duration-200"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 bg-white hover:bg-gray-50/80 cursor-pointer"
                    >
                      <div className="min-w-0">
                        <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-[10px] font-bold text-gray-600 mb-1.5 uppercase tracking-wider font-sora">
                          {faq.category}
                        </span>
                        <h3 className="font-sora font-bold text-sm sm:text-base text-gray-900 leading-snug">
                          {faq.q}
                        </h3>
                      </div>
                      <span className="material-symbols-outlined text-gray-400 text-[22px] shrink-0 mt-1">
                        {isOpen ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-[#fbf8fe]/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
