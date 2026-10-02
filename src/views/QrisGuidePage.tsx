import React, { useEffect } from 'react';
import { useRouter } from '../context/RouterContext';

export const QrisGuidePage: React.FC = () => {
  const { navigate } = useRouter();

  useEffect(() => {
    document.title = 'Panduan Cara Pembayaran QRIS - Virello';
  }, []);

  const steps = [
    {
      step: '01',
      icon: 'touch_app',
      title: 'Pilih Produk & Masukkan Nomor Tujuan',
      desc: 'Pilih nominal pulsa, paket data, token PLN, atau jenis tagihan pada katalog. Ketik nomor ponsel atau nomor meter tujuan Anda dengan teliti.',
    },
    {
      step: '02',
      icon: 'receipt_long',
      title: 'Periksa Rincian & Tekan Tombol Bayar',
      desc: 'Pastikan nama penerima/operator sudah sesuai. Lanjutkan ke langkah checkout untuk memunculkan kode QRIS pembayaran.',
    },
    {
      step: '03',
      icon: 'smartphone',
      title: 'Buka Aplikasi Mobile Banking atau E-Wallet',
      desc: 'Buka aplikasi favorit Anda seperti BCA Mobile, Livin\' Mandiri, BRImo, GoPay, DANA, OVO, ShopeePay, atau LinkAja.',
    },
    {
      step: '04',
      icon: 'qr_code_scanner',
      title: 'Pilih Menu Scan / Pindai QR',
      desc: 'Arahkan kamera smartphone Anda ke kode QRIS yang tampil di layar Virello hingga kode terbaca sempurna.',
    },
    {
      step: '05',
      icon: 'pin',
      title: 'Konfirmasi Nominal & Masukkan PIN',
      desc: 'Pastikan nama merchant tertera sebagai VIRELLO dan nominal tagihan sesuai. Masukkan PIN keamanan perbankan Anda untuk menyelesaikan pembayaran.',
    },
    {
      step: '06',
      icon: 'task_alt',
      title: 'Transaksi Sukses & SN Langsung Ditampilkan',
      desc: 'Setelah pembayaran terverifikasi otomatis dalam hitungan detik, layar akan memuat status transaksi "BERHASIL" disertai Nomor Seri (SN) resmi atau kode token 20 digit PLN.',
    },
  ];

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
        {/* Header Hero */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/90 shadow-sm text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6d28d9] font-sora">
            Bantuan & Panduan
          </span>
          <h1 className="font-sora text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            Cara Pembayaran Praktis dengan QRIS
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-xl mx-auto">
            Gunakan satu kode QRIS standar nasional untuk membayar dari berbagai aplikasi perbankan digital dan dompet elektronik tanpa ribet.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
              Bebas Biaya Tambahan
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-50 text-[#6d28d9] border border-purple-200 text-xs font-medium">
              Verifikasi Otomatis
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium">
              Kompatibel Semua Bank & E-Wallet
            </span>
          </div>
        </div>

        {/* 6 Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((st) => (
            <div
              key={st.step}
              className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#f5f0ff] text-[#6d28d9] flex items-center justify-center border border-purple-100">
                    <span className="material-symbols-outlined text-[24px]">{st.icon}</span>
                  </div>
                  <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-md bg-gray-100 text-gray-700">
                    LANGKAH {st.step}
                  </span>
                </div>
                <h3 className="font-sora font-bold text-base text-gray-900 mb-1.5">
                  {st.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tips Box */}
        <div className="bg-[#fbf8fe] rounded-3xl p-6 sm:p-8 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-sora font-bold text-base text-gray-900 mb-1">
              Sudah Siap Memulai Transaksi?
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Pilih produk pulsa, token PLN, atau paket data hemat Anda di katalog utama Virello.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/', { scrollSelector: '#katalog' })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6d28d9] hover:bg-[#5b21b6] text-white font-sora font-bold text-sm shadow-sm transition-all cursor-pointer shrink-0"
          >
            <span>Buka Katalog Produk</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
