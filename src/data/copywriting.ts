/**
 * Centralized Copywriting for Virello
 * Strategy: Clear, natural, honest, conversion-focused Indonesian.
 * Zero unverified claims, zero clickbait, zero empty hype words.
 */

export const COPY = {
  brand: {
    name: 'Virello',
    tagline: 'Pembelian Produk Digital & Pembayaran Tagihan',
    metaDescription:
      'Pilihan pulsa, paket data, token listrik PLN, saldo uang elektronik, dan pembayaran tagihan rutin dalam satu tempat.',
  },

  header: {
    liveStatus: 'Sistem Aktif',
    searchPlaceholder: 'Cari produk, provider, atau nominal...',
    navKatalog: 'Katalog',
    navPromo: 'Promo',
    navCekPesanan: 'Cek Pesanan',
    btnWhatsApp: 'WhatsApp CS',
    btnCekPesanan: 'Cek Pesanan',
  },

  // Beranda — port dari pages/index.html
  home: {
    badgeChip: 'QRIS',
    badgeText: 'Bayar dari e-wallet & m-banking apa pun',
    titleLine1: 'Top up',
    titleLine2: 'sekali klik.',
    titleAccent: 'Masuk instan.',
    subtitle:
      'Pulsa, paket data, token PLN, e-wallet & tagihan rumah. Pilih produk, scan QRIS, selesai.',
    searchPlaceholder: 'Cari Telkomsel, Token PLN, DANA…',
    searchButton: 'Beli Sekarang',
    searchButtonShort: 'Beli',
    quickChips: [
      { label: 'Telkomsel 25rb', path: '/pulsa', icon: 'fire' },
      { label: 'Token PLN 50rb', path: '/token-pln' },
      { label: 'GoPay 50rb', path: '/e-wallet' },
      { label: 'DANA 100rb', path: '/e-wallet' },
    ],
    checkoutCard: {
      title: 'Pulsa Telkomsel',
      number: '0812 •••• ••••',
      nominalLabel: 'Pilih nominal',
      nominals: ['10rb', '25rb', '50rb', '100rb'],
      selectedNominal: '50rb',
      methodLabel: 'Metode bayar',
      methodValue: 'QRIS',
      methodNote: 'Scan dari aplikasi apa pun',
      button: 'Bayar pakai QRIS',
    },
    chips: {
      processedTitle: 'Pesanan diproses',
      processedNote: 'Otomatis oleh sistem',
      helpTitle: 'Butuh bantuan?',
      helpNote: 'CS via WhatsApp',
    },
    steps: [
      { num: '01', icon: 'search', title: 'Pilih produk', desc: 'Cari produk dan pilih nominal yang kamu butuhkan.' },
      { num: '02', icon: 'qr', title: 'Scan QRIS', desc: 'Bayar dari e-wallet atau m-banking favoritmu.' },
      { num: '03', icon: 'list', title: 'Cek pesanan', desc: 'Pantau status pesanan kapan saja, CS siap bantu via WhatsApp.' },
    ],
    categoriesTitleLine1: 'Semua kebutuhan',
    categoriesTitleLine2: 'digital kamu.',
    categoriesSubtitle: '8 kategori layanan, semua bisa dibayar pakai QRIS.',
    featuredCategory: {
      badge: 'KATEGORI UTAMA',
      title: 'Pulsa',
      desc: 'Telkomsel, Indosat, XL, Tri, Smartfren, dll.',
      cta: 'Isi sekarang →',
      path: '/pulsa',
    },
    categories: [
      { icon: 'wifi', title: 'Paket Data', desc: 'Harian, mingguan, bulanan, combo, unlimited', path: '/paket-data' },
      { icon: 'bolt', title: 'Token PLN', desc: 'Listrik prabayar sesuai nominal', path: '/token-pln' },
      { icon: 'receipt', title: 'Tagihan PLN', desc: 'PLN pascabayar', path: '/tagihan-pln' },
      { icon: 'drop', title: 'PDAM', desc: 'Pembayaran tagihan air', path: '/pdam' },
      { icon: 'shield', title: 'BPJS', desc: 'BPJS Kesehatan & produk terkait', path: '/bpjs' },
      { icon: 'tv', title: 'Internet & TV', desc: 'IndiHome & layanan berlangganan', path: '/internet-tv' },
      { icon: 'wallet', title: 'E-Wallet', desc: 'DANA, GoPay, OVO, ShopeePay, LinkAja, dll.', path: '/e-wallet' },
    ],
    qrisTile: {
      title: 'Bayar pakai QRIS',
      desc: 'Semua kategori, satu cara bayar.',
    },
  },

  // Halaman detail kategori (pages/pulsa, pages/pdam, ...)
  categoryPage: {
    sidebarTitle: 'Kategori',
    allCategories: '← Semua kategori',
    priceNote: 'Harga final ditampilkan sebelum pembayaran.',
    infoLead: 'Masukkan nomor pelanggan, lalu tekan ',
    infoBold: 'Cek tagihan',
    infoTail: '. Detail dan jumlah tagihan akan muncul sebelum kamu membayar.',
    summary: 'Ringkasan',
    pickLabel: 'Pilihan',
    methodLabel: 'Metode',
    methodValue: 'QRIS',
    notChosen: 'Belum dipilih',
    btnContinue: 'Lanjut bayar',
    btnCheck: 'Cek tagihan',
    helpCs: 'Butuh bantuan? CS via WhatsApp',
    errNumber: 'Isi nomor dulu ya.',
    errNominal: 'Pilih nominal dulu ya.',
  },

  hero: {
    eyebrow: 'Layanan Pembayaran & Produk Digital',
    // Chosen Headline (lead + accented phrase rendered as one heading):
    headlineLead: 'Satu Tempat untuk Pulsa, Paket Data, dan',
    headlineAccent: 'Tagihan Rumah Tangga',
    subheadline:
      'Temukan produk digital yang kamu butuhkan, pilih nominalnya, lalu selesaikan pembayaran lewat QRIS.',
    paymentChip: 'Pembayaran QRIS',
    btnStart: 'Mulai Transaksi',
    btnTrack: 'Lacak Transaksi',
    mockupTagline: 'Produk Digital & Tagihan',
    mockupFooterLabel: 'Metode Pembayaran',
    mockupFooterValue: 'QRIS & Virtual Account',
    quickTilesLabel: 'Pilih Layanan',
    badges: [
      { icon: 'check_circle', label: 'Validasi Nomor', value: 'Sebelum Bayar' },
      { icon: 'qr_code_2', label: 'Pembayaran', value: 'QRIS Nasional' },
      { icon: 'receipt_long', label: 'Nomor Seri', value: 'Setelah Bayar' },
      { icon: 'manage_search', label: 'Cek Pesanan', value: 'Via Nomor Invoice' },
    ],
  },

  categories: {
    sectionLabel: 'Kategori Layanan',
    tabAll: 'Semua Layanan',
    sectionTitle: 'Pilih Layanan Favoritmu',
    sectionDesc: 'Pilih kategori, lalu tentukan nominal dan bayar lewat QRIS.',
  },

  promo: {
    badge: 'PROMO PILIHAN',
    title: 'Harga Spesial Produk Digital',
    desc: 'Temukan penawaran pulsa, token PLN, saldo e-wallet, dan paket data dalam satu katalog.',
    btnViewPromo: 'Lihat Promo',
  },

  catalog: {
    eyebrow: 'Katalog Layanan',
    title: 'Katalog Produk & Pembayaran',
    subtitle: 'Pilih produk, tentukan nominal, lalu selesaikan pembayaran lewat QRIS.',
    availableLabel: 'produk tersedia',
    sortLabel: 'Urutkan',
    saveLabel: 'Hemat',
    billPriceLabel: 'Biaya Tagihan',
    search: {
      placeholder: 'Cari produk, nama provider, atau nominal (mis. Telkomsel, Token PLN)...',
      button: 'Cari Produk',
      quickLabel: 'Sering dicari:',
      quickChoices: [
        { label: 'Telkomsel 25rb', query: 'Telkomsel 25' },
        { label: 'Token PLN 50rb', query: 'PLN 50' },
        { label: 'GoPay 50rb', query: 'GoPay 50' },
        { label: 'DANA 100rb', query: 'DANA 100' },
        { label: 'BPJS Kesehatan', query: 'BPJS' },
      ],
      resultFoundLabel: 'produk cocok dengan pencarian ini',
      resetLabel: 'Reset',
    },
    sort: {
      popular: 'Paling Populer',
      cheapest: 'Harga Terendah',
      fastest: 'Nama Provider',
    },
    empty: {
      title: 'Produk tidak ditemukan',
      desc: 'Periksa kembali kata kunci pencarian Anda atau pilih kategori lain pada menu di atas.',
      resetLabel: 'Reset pencarian & filter',
    },
  },

  valueProps: {
    why: {
      eyebrow: 'KENAPA VIRELLO',
      title: 'Belanja Digital Tanpa Ribet',
      subtitle:
        'Pilih produk, tentukan nominal, dan bayar melalui QRIS dalam alur yang jelas.',
      cards: [
        {
          icon: 'person_outline',
          title: 'Tanpa Registrasi',
          desc: 'Pilih produk dan lanjutkan pembelian tanpa perlu membuat akun.',
        },
        {
          icon: 'support_agent',
          title: 'Bantuan Customer Service',
          desc: 'Hubungi tim kami melalui WhatsApp jika membutuhkan bantuan terkait pesanan.',
        },
        {
          icon: 'receipt_long',
          title: 'Informasi Transaksi',
          desc: 'Periksa status pesanan dan lihat nomor seri jika tersedia dari penyedia layanan.',
        },
        {
          icon: 'qr_code_2',
          title: 'Pembayaran QRIS',
          desc: 'Selesaikan pembayaran dengan memindai kode QRIS yang ditampilkan saat checkout.',
        },
      ],
    },
    steps: {
      eyebrow: 'Cara Pembelian',
      title: '4 Langkah, Satu Alur Mudah',
      subtitle: 'Pilih produk, bayar, lalu pantau status pesananmu.',
      list: [
        {
          step: '01',
          icon: 'touch_app',
          title: 'Pilih Produk',
          desc: 'Tentukan layanan dan nominal yang kamu butuhkan.',
        },
        {
          step: '02',
          icon: 'dialpad',
          title: 'Isi Nomor Tujuan',
          desc: 'Masukkan nomor HP atau ID pelanggan dengan benar.',
        },
        {
          step: '03',
          icon: 'qr_code_scanner',
          title: 'Bayar dengan QRIS',
          desc: 'Pindai kode QRIS dan selesaikan pembayaran.',
        },
        {
          step: '04',
          icon: 'task_alt',
          title: 'Pantau Pesanan',
          desc: 'Cek status transaksi dan lihat bukti jika tersedia.',
        },
      ],
    },
  },

  guarantee: {
    eyebrow: 'BUTUH BANTUAN?',
    headline: 'Kami Siap Membantu',
    desc: 'Temukan bantuan transaksi, hubungi tim kami, atau periksa riwayat pesananmu.',
    cards: [
      {
        id: 'help',
        category: 'Bantuan Transaksi',
        title: 'Pesanan Mengalami Kendala?',
        desc: 'Periksa status pesanan dan siapkan ID transaksi jika pembayaran atau produk belum terkonfirmasi.',
        btnText: 'Cek Status Pesanan',
        btnIcon: 'search',
        icon: 'help_outline',
      },
      {
        id: 'cs',
        category: 'Customer Service',
        title: 'Hubungi Tim Kami',
        desc: 'Dapatkan bantuan melalui WhatsApp terkait pesanan dan kendala transaksi.',
        btnText: 'Hubungi WhatsApp',
        btnIcon: 'chat',
        icon: 'support_agent',
      },
      {
        id: 'history',
        category: 'Riwayat Pesanan',
        title: 'Riwayat Transaksi',
        desc: 'Temukan kembali detail pesanan dan bukti transaksi melalui informasi pesanan yang tersedia.',
        btnText: 'Lihat Riwayat',
        btnIcon: 'receipt_long',
        icon: 'history',
      },
    ],
  },

  checkout: {
    title: 'Informasi Pembelian',
    btnClose: 'Tutup',
    // Flow mengikuti desain HTML: pilih -> pembayaran (QRIS) -> berhasil
    flow: {
      summary: 'Ringkasan',
      summaryOrder: 'Ringkasan pesanan',
      rowNumber: 'Nomor',
      rowProvider: 'Provider',
      rowChoice: 'Pilihan',
      rowMethod: 'Metode',
      rowTotal: 'Total bayar',
      notChosen: 'Belum dipilih',
      btnContinuePay: 'Lanjut bayar',
      helpCs: 'Butuh bantuan? CS via WhatsApp',
      waitingBadge: 'Menunggu pembayaran',
      payTitle: 'Scan untuk bayar',
      btnBackToEdit: 'Ubah pesanan',
      paySubtitle: 'Buka e-wallet atau m-banking, lalu scan kode di bawah.',
      qrisCaption: 'QRIS · VIRELLO',
      chips: ['GoPay', 'OVO', 'DANA', 'ShopeePay', 'm-banking'],
      howToPay: 'Cara bayar',
      howToPaySteps: [
        'Buka aplikasi e-wallet atau m-banking yang mendukung QRIS.',
        'Pilih menu Scan / Bayar, lalu arahkan ke kode QRIS.',
        'Periksa detail, konfirmasi, lalu cek status pesananmu.',
      ],
      btnCheckStatus: 'Cek status pesanan',
      allCategories: '← Semua kategori',
      pickProvider: 'Pilih provider',
      pickNominal: 'Pilih nominal',
      priceNote: 'Harga final ditampilkan sebelum pembayaran.',
      chooseNominalError: 'Pilih nominal dulu ya.',
      successTitle: 'Pesanan berhasil!',
      successMsg: 'Produk sudah masuk ke nomor tujuan.',
      successMsgPln: 'Token listrik berhasil diterbitkan.',
      stages: ['Dibayar', 'Diproses', 'Berhasil'],
      detailTitle: 'Detail pesanan',
      detailOrderId: 'ID pesanan',
      detailStatus: 'Status',
      statusSuccess: 'Berhasil',
      btnBuyAgain: 'Beli lagi',
      btnHome: 'Kembali ke beranda',
      csNote: 'Produk belum masuk? Hubungi CS via WhatsApp.',
    },
    summaryCategory: 'Kategori Layanan',
    summaryFree: 'Gratis',
    reviewNote:
      'Periksa kembali nomor tujuan Anda. Pembayaran diverifikasi otomatis oleh sistem.',
    errNumberShort: 'Masukkan nomor tujuan yang valid (minimal 9 digit angka).',
    payOtherTitle: 'Selesaikan pembayaran',
    errOperatorMismatch:
      'Nomor ini terdeteksi {detected}, sedangkan produk yang dipilih untuk {expected}. Periksa kembali nomornya.',
    vaLabel: 'Nomor Virtual Account',
    vaInstruction:
      'Setelah transfer, tekan "Saya Sudah Bayar" untuk konfirmasi pembayaran.',
    merchantLabel: 'Nomor Merchant',
    ewalletInstruction:
      'Buka aplikasi pembayaran Anda lalu selesaikan pembayaran ke nomor merchant di bawah ini.',
    btnCopyVa: 'Salin Nomor VA',
    btnCopiedVa: 'Nomor VA Tersalin',
    btnAlreadyPaid: 'Saya sudah bayar',
    verifyingText: 'Memverifikasi pembayaran...',
    destinationLabels: {
      phone: 'Nomor Ponsel Tujuan',
      meter: 'Nomor Meter / ID Pelanggan PLN',
      bpjs_id: 'Nomor Peserta BPJS Kesehatan',
      pdam_id: 'Nomor Sambungan PDAM',
      id_pelanggan: 'Nomor Pelanggan Internet / Tagihan',
      kontrak_id: 'Nomor Kontrak Pembiayaan',
    },
    detectedBadge: 'terdeteksi',
    destinationWarning:
      'Pastikan nomor tujuan telah benar. Transaksi yang sudah diproses oleh provider tidak dapat dibatalkan.',
    waFieldLabel: 'Nomor WhatsApp (Opsional)',
    waFieldPlaceholder: '08xxxxxxxxxx (untuk salinan bukti transaksi & SN)',
    paymentMethodLabel: 'Pilih Metode Pembayaran',
    summaryFee: 'Biaya Pembayaran',
    summaryTotal: 'Total Bayar',
    qrisTimerNotice: 'Selesaikan pembayaran sebelum batas waktu berakhir:',
    successBadge: 'Berhasil',
    detailDestination: 'Nomor Tujuan',
    detailDate: 'Waktu Transaksi',
    detailMethod: 'Metode Pembayaran',
  },

  tracking: {
    title: 'Cek Status Pesanan',
    subtitle:
      'Masukkan nomor invoice atau nomor tujuan untuk memeriksa progres transaksi dan nomor seri (SN).',
    searchPlaceholder: 'Masukkan nomor invoice (mis. VRX-892104) atau nomor tujuan...',
    historyTitle: 'Riwayat Transaksi Terakhir',
    emptyList: 'Tidak ditemukan transaksi yang sesuai dengan data pencarian.',
    detailTitle: 'Rincian Transaksi',
    statusSuccess: 'BERHASIL',
    snHeader: 'Nomor Seri (SN) / Token',
    btnNeedHelp: 'Butuh Bantuan untuk Pesanan Ini?',
  },

  whatsapp: {
    title: 'Layanan Bantuan Customer Service',
    subtitle: 'Sampaikan kendala transaksi atau pertanyaan kepada tim layanan Virello',
    alertText:
      'Layanan pelanggan siap membantu pengecekan transaksi, verifikasi pembayaran, dan kendala nomor seri (SN).',
    issueHeader: 'Pilih Topik Pertanyaan',
    invoiceHeader: 'Nomor Invoice (Opsional)',
    invoicePlaceholder: 'Contoh: VRX-892104',
    btnOpen: 'Buka Obrolan WhatsApp',
    issues: [
      {
        id: 'sn_delay',
        label: 'Nomor Seri (SN) atau Token Belum Tampil',
        template: 'Halo CS Virello, saya ingin menanyakan pesanan dengan nomor invoice berikut:',
      },
      {
        id: 'payment_confirm',
        label: 'Konfirmasi Pembayaran QRIS / Virtual Account',
        template: 'Halo CS Virello, saya sudah melakukan pembayaran dan ingin konfirmasi untuk invoice:',
      },
      {
        id: 'wrong_number',
        label: 'Kendala Nomor Tujuan atau Status Tagihan',
        template: 'Halo CS Virello, mohon bantuan terkait nomor tujuan untuk pesanan:',
      },
      {
        id: 'general',
        label: 'Pertanyaan Umum Seputar Layanan',
        template: 'Halo CS Virello, saya ingin menanyakan informasi tentang layanan:',
      },
    ],
  },

  faq: {
    title: 'Pusat Bantuan & Pertanyaan Umum',
    subtitle: 'Jawaban atas pertanyaan seputar pembelian dan pembayaran di Virello',
    list: [
      {
        q: 'Apakah saya perlu mendaftar akun untuk bertransaksi di Virello?',
        a: 'Tidak perlu. Anda dapat langsung memilih produk, memasukkan nomor tujuan, dan menyelesaikan pembayaran tanpa perlu registrasi atau login terlebih dahulu.',
      },
      {
        q: 'Berapa lama waktu yang dibutuhkan hingga transaksi selesai?',
        a: 'Setelah pembayaran terkonfirmasi oleh sistem perbankan atau QRIS, transaksi langsung diproses ke sistem provider. Nomor seri (SN) atau kode token PLN akan segera ditampilkan pada layar Anda.',
      },
      {
        q: 'Metode pembayaran apa saja yang didukung?',
        a: 'Kami mendukung pembayaran melalui kode QRIS standar nasional yang dapat dipindai dari hampir semua aplikasi mobile banking dan dompet digital, serta transfer Virtual Account bank.',
      },
      {
        q: 'Bagaimana jika pembayaran sudah dilakukan tetapi status belum berubah?',
        a: 'Simpan bukti transfer atau nomor invoice Anda. Buka menu Cek Pesanan untuk memuat ulang status terbaru, atau hubungi Customer Service kami via WhatsApp untuk bantuan pengecekan langsung.',
      },
      {
        q: 'Bagaimana cara memeriksa kembali transaksi yang sudah selesai?',
        a: 'Pilih menu "Cek Pesanan" di bagian atas halaman, kemudian masukkan nomor invoice transaksi Anda (misalnya VRX-892104) atau nomor ponsel tujuan yang digunakan.',
      },
    ],
    supportPromptTitle: 'Masih memiliki pertanyaan lain?',
    supportPromptDesc: 'Tim Customer Service kami siap membantu menjawab pertanyaan Anda melalui WhatsApp.',
    btnChatCs: 'Hubungi CS',
  },

  footer: {
    brandDesc:
      'Temukan pulsa, paket data, token listrik, saldo digital, dan layanan pembayaran dalam satu tempat.',
    verifiedBadges: ['Pembayaran QRIS', 'Berbagai produk digital', 'Bantuan melalui WhatsApp'],
    sectionDigitalTitle: 'Layanan Digital',
    sectionHelpTitle: 'Bantuan & Panduan',
    sectionLegalTitle: 'Ketentuan & Privasi',
    navDigital: [
      { label: 'Pulsa Seluler', category: 'pulsa' },
      { label: 'Paket Data Internet', category: 'paket-data' },
      { label: 'Token Listrik PLN', category: 'pln' },
      { label: 'Saldo Uang Elektronik', category: 'ewallet' },
      { label: 'Iuran BPJS Kesehatan', category: 'bpjs' },
    ],
    navHelp: [
      { label: 'Cek Status Pesanan', path: '/cek-pesanan' },
      { label: 'Cara Pembayaran QRIS', path: '/cara-pembayaran' },
      { label: 'Pertanyaan Umum (FAQ)', path: '/bantuan' },
      {
        label: 'Customer Service WhatsApp',
        externalUrl:
          'https://wa.me/6281234567890?text=Halo%20CS%20Virello%2C%20saya%20membutuhkan%20bantuan%20terkait%20pesanan%20atau%20layanan.',
      },
      { label: 'Pusat Bantuan Transaksi', path: '/bantuan' },
    ],
    navLegal: [
      { label: 'Syarat & Ketentuan', path: '/syarat-ketentuan' },
      { label: 'Kebijakan Privasi', path: '/kebijakan-privasi' },
      { label: 'Ketentuan Pembayaran', path: '/ketentuan-pembayaran' },
      { label: 'Informasi Biller Resmi', path: '/biller-resmi' },
    ],
    paymentGroup: {
      label: 'Metode Pembayaran',
      items: ['QRIS (Semua E-Wallet & Mobile Banking)'],
    },
    telecomGroup: {
      label: 'Provider Seluler',
      items: ['Telkomsel', 'Indosat Ooredoo', 'XL Axiata', 'Smartfren', 'Tri'],
    },
    billerGroup: {
      label: 'Layanan Digital & Tagihan',
      items: ['PLN Prabayar', 'BPJS Kesehatan', 'Air PDAM', 'IndiHome', 'Multifinance'],
    },
    systemStatus: 'Beroperasi Normal',
    copyright: '© 2026 Virello. Seluruh hak cipta dilindungi.',
  },
};
