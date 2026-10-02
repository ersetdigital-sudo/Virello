import React, { useEffect } from 'react';
import { useRouter } from '../context/RouterContext';

export const BillerInfoPage: React.FC = () => {
  const { navigate } = useRouter();

  useEffect(() => {
    document.title = 'Informasi Biller Resmi - Virello';
  }, []);

  const billers = [
    {
      category: 'Telekomunikasi Seluler',
      icon: 'cell_tower',
      providers: ['Telkomsel', 'Indosat Ooredoo Hutchison', 'XL Axiata', 'Smartfren', 'Tri'],
      desc: 'Pengisian pulsa reguler dan kuota paket data internet yang langsung diteruskan ke sistem HLR masing-masing operator.',
    },
    {
      category: 'Kelistrikan & Energi',
      icon: 'bolt',
      providers: ['PT PLN (Persero) Prabayar'],
      desc: 'Penerbitan 20 digit kode stroom token listrik resmi PLN yang langsung tampil pada layar setelah pembayaran lunas.',
    },
    {
      category: 'Dompet Digital & Saldo',
      icon: 'account_balance_wallet',
      providers: ['GoPay', 'DANA', 'OVO', 'ShopeePay', 'LinkAja'],
      desc: 'Top up saldo e-money ke nomor akun terdaftar dengan pengecekan nama pengguna sebelum pembayaran.',
    },
    {
      category: 'Utilitas & Layanan Publik',
      icon: 'water_drop',
      providers: ['BPJS Kesehatan', 'Perusahaan Daerah Air Minum (PDAM)', 'IndiHome Telkom'],
      desc: 'Pengecekan tagihan bulanan resmi dan pembayaran tagihan iuran berkala dengan nomor pelanggan.',
    },
    {
      category: 'Pembiayaan Multifinance',
      icon: 'receipt_long',
      providers: ['BAF', 'FIFGROUP', 'WOM Finance', 'Mega Finance', 'Adira'],
      desc: 'Pembayaran angsuran kredit kendaraan dan pembiayaan multiguna resmi dengan nomor kontrak.',
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

      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/90 shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-100 pb-6 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6d28d9] font-sora">
            Ketentuan & Privasi
          </span>
          <h1 className="font-sora text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            Informasi Biller Resmi
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Terakhir diperbarui: 1 Oktober 2026 • Jaringan penyedia produk digital dan agregator biller resmi Virello.
          </p>
        </div>

        {/* Introduction */}
        <div className="text-sm text-gray-700 leading-relaxed mb-8">
          <p>
            Virello bertindak sebagai platform antarmuka transaksi digital yang terhubung dengan gateway
            agregator dan sistem biller resmi di Indonesia. Seluruh nomor seri (Serial Number / SN),
            kode token PLN, serta bukti pembayaran iuran diterbitkan langsung oleh sistem penyedia
            layanan terkait secara sah dan dapat dipertanggungjawabkan.
          </p>
        </div>

        {/* Biller Categories Cards */}
        <div className="space-y-4 mb-8">
          {billers.map((b) => (
            <div
              key={b.category}
              className="p-5 rounded-2xl bg-[#fbf8fe] border border-gray-200/80 hover:border-purple-200 transition-colors"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#6d28d9] shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[22px]">{b.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-sora font-bold text-base text-gray-900 mb-1">
                    {b.category}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3">
                    {b.desc}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {b.providers.map((p) => (
                      <span
                        key={p}
                        className="px-2.5 py-0.5 rounded-md bg-white border border-gray-200 text-xs font-medium text-gray-700 shadow-2xs"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer / Transparency Note */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs sm:text-sm text-amber-900 leading-relaxed">
          <div className="font-sora font-bold text-xs uppercase tracking-wider text-amber-800 mb-1 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">info</span>
            <span>Keterangan Transparansi</span>
          </div>
          Nama brand, logo, serta merek dagang telekomunikasi dan utilitas publik adalah hak milik sah
          dari masing-masing perusahaan penyedia layanan terkait. Virello menyajikan produk melalui jalur
          koneksi API agregator resmi untuk mempermudah pembelian digital oleh masyarakat umum.
        </div>
      </div>
    </div>
  );
};
