'use client';

/**
 * Halaman alur transaksi — mengikuti struktur folder desain HTML:
 *   pages/pulsa (pilih)  →  pages/pembayaran (QRIS)  →  pages/berhasil
 * Tiap halaman berdiri sendiri sebagai rute, bukan section di halaman katalog.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Product, PaymentMethodId, Order } from '../types';
import { PAYMENT_METHODS } from '../data/mockData';
import { COPY } from '../data/copywriting';
import { useCatalog } from '../context/CatalogContext';
import { cldImg } from '../lib/cloudinary';

export interface CheckoutDraft {
  destination: string;
  whatsapp: string;
  payment: PaymentMethodId;
  trxRef: string;
}

export const EMPTY_DRAFT: CheckoutDraft = {
  destination: '',
  whatsapp: '',
  payment: 'qris',
  trxRef: '',
};

/** Providers whose product only works on their own network. */
const OPERATOR_PROVIDERS = ['Telkomsel', 'Indosat', 'XL Axiata', 'Tri (3)', 'Smartfren'];

const VA_PREFIX: Record<string, string> = {
  bca_va: '8808',
  mandiri_va: '8907',
  bri_va: '8880',
};

const formatRupiah = (val: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  })
    .format(val)
    .replace(/\s/, '');

const pad = (n: number) => String(n).padStart(2, '0');

const detectProviderFromNumber = (num: string) => {
  const p = (prefixes: string[]) => prefixes.some((x) => num.startsWith(x));
  if (p(['0811', '0812', '0813', '0821', '0822', '0852', '0853'])) return 'Telkomsel';
  if (p(['0814', '0815', '0816', '0855', '0856', '0857', '0858'])) return 'Indosat';
  if (p(['0817', '0818', '0819', '0859', '0877', '0878'])) return 'XL Axiata';
  if (p(['0895', '0896', '0897', '0898', '0899'])) return 'Tri (3)';
  return null;
};

/** Deterministic numeric hash so generated numbers stay stable across renders. */
const hashString = (value: string) => {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h * 31 + value.charCodeAt(i)) % 100000000;
  }
  return h;
};

// ── Mock QRIS matrix (deterministic: no random values during render) ──
const QR_GRID = 21;
const inFinder = (r: number, c: number) =>
  (r < 7 && c < 7) || (r < 7 && c > 13) || (r > 13 && c < 7);
const finderFilled = (r: number, c: number) => {
  const dr = r < 7 ? r : r - 14;
  const dc = c < 7 ? c : c - 14;
  return dr === 0 || dr === 6 || dc === 0 || dc === 6 || (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4);
};
const inCenterBadge = (r: number, c: number) => r >= 8 && r <= 12 && c >= 8 && c <= 12;
const moduleFilled = (r: number, c: number) => (r * 17 + c * 31 + r * c * 7) % 11 < 5;

const QrisMatrix: React.FC = () => (
  <svg className="w-full h-full" viewBox={`0 0 ${QR_GRID} ${QR_GRID}`} fill="#0c0a1d">
    {Array.from({ length: QR_GRID }).map((_, r) =>
      Array.from({ length: QR_GRID }).map((_, c) => {
        if (inFinder(r, c)) {
          return finderFilled(r, c) ? (
            <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} />
          ) : null;
        }
        if (inCenterBadge(r, c)) return null;
        return moduleFilled(r, c) ? (
          <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} />
        ) : null;
      }),
    )}
    <rect x={8} y={8} width={5} height={5} rx={1} fill="#7c3aed" />
    <text
      x={10.5}
      y={11.4}
      textAnchor="middle"
      fill="white"
      fontSize={1.2}
      fontWeight="bold"
      fontFamily="sans-serif"
    >
      VR
    </text>
  </svg>
);

/** Shared page frame: Inter Tight, latar #f4f3f8, judul + tombol keluar. */
const PageFrame: React.FC<{
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}> = ({ title, children, onClose }) => (
  <div className="w-full min-h-[70vh] bg-[#f4f3f8] py-6 sm:py-10 font-['Inter_Tight',sans-serif]">
    <div className="max-w-[1200px] mx-auto px-3 sm:px-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h1 className="text-xl sm:text-2xl font-black tracking-[-0.03em] text-[#0c0a1d]">
          {title}
        </h1>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-white border border-slate-200 hover:border-slate-400 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
          <span className="text-xs font-bold">{COPY.checkout.btnClose}</span>
        </button>
      </div>
      {children}
    </div>
  </div>
);

/** Shown when a checkout route is opened directly without a chosen product. */
const EmptyState: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="bg-white rounded-[28px] border border-slate-200/70 p-10 text-center">
    <span className="material-symbols-outlined text-slate-300 text-[56px]">shopping_cart</span>
    <p className="mt-3 text-xl font-black text-[#0c0a1d]">Belum ada produk dipilih</p>
    <p className="text-slate-500 text-sm mt-1">
      Pilih produk dari katalog dulu, lalu lanjutkan pembayaran.
    </p>
    <button
      type="button"
      onClick={onBack}
      className="mt-6 px-6 py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-colors cursor-pointer"
    >
      Kembali ke katalog
    </button>
  </div>
);

/* ══════════════════════════════════════════════════════════════
   HALAMAN 1 — Pilih (setara pages/pulsa)
   ══════════════════════════════════════════════════════════════ */
export const CheckoutPickPage: React.FC<{
  product: Product | null;
  draft: CheckoutDraft;
  onDraftChange: (patch: Partial<CheckoutDraft>) => void;
  onContinue: (trxRef: string) => void;
  onCancel: () => void;
}> = ({ product, draft, onDraftChange, onContinue, onCancel }) => {
  const [numberError, setNumberError] = useState<string | null>(null);
  const targetInputRef = useRef<HTMLInputElement>(null);
  const flow = COPY.checkout.flow;

  if (!product) {
    return (
      <PageFrame title={COPY.checkout.title} onClose={onCancel}>
        <EmptyState onBack={onCancel} />
      </PageFrame>
    );
  }

  const digits = draft.destination.replace(/\D/g, '');
  const detected = detectProviderFromNumber(draft.destination);
  const operatorMismatch =
    OPERATOR_PROVIDERS.includes(product.provider) && detected !== null && detected !== product.provider;
  const mismatchMessage = COPY.checkout.errOperatorMismatch
    .replace('{detected}', detected ?? '')
    .replace('{expected}', product.provider);

  const selectedMethod =
    PAYMENT_METHODS.find((m) => m.id === draft.payment) || PAYMENT_METHODS[0];
  const totalAmount = product.price + selectedMethod.fee;

  const destLabel =
    COPY.checkout.destinationLabels[product.targetType as keyof typeof COPY.checkout.destinationLabels] ||
    'Nomor Tujuan';

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (digits.length < 9) {
      setNumberError(COPY.checkout.errNumberShort);
      targetInputRef.current?.focus();
      return;
    }
    if (operatorMismatch) {
      setNumberError(mismatchMessage);
      targetInputRef.current?.focus();
      return;
    }
    setNumberError(null);

    const now = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    onContinue(
      `VRX${now.getFullYear()}${p(now.getMonth() + 1)}${p(now.getDate())}-${Math.floor(
        1000 + Math.random() * 9000,
      )}`,
    );
  };

  return (
    <PageFrame title={COPY.checkout.title} onClose={onCancel}>
      <form onSubmit={handleContinue} className="grid lg:grid-cols-12 gap-4 items-start">
        <section className="lg:col-span-7 bg-white rounded-[28px] border border-slate-200/70 p-6 md:p-9">
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 rounded-2xl bg-violet-600 text-white grid place-items-center shrink-0">
              <span className="material-symbols-outlined text-[26px]">receipt_long</span>
            </span>
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl font-black tracking-[-0.03em] text-[#0c0a1d] leading-tight">
                {product.title}
              </h2>
              <p className="text-slate-500 mt-1 text-sm">{product.description}</p>
            </div>
          </div>

          <label htmlFor="checkout-target" className="block mt-8 text-sm font-bold text-[#0c0a1d]">
            {destLabel}
          </label>
          <input
            ref={targetInputRef}
            id="checkout-target"
            type="text"
            inputMode="numeric"
            value={draft.destination}
            onChange={(e) => {
              onDraftChange({ destination: e.target.value });
              if (numberError) setNumberError(null);
            }}
            placeholder={product.targetPlaceholder}
            aria-invalid={numberError !== null}
            className={`mt-3 w-full px-5 py-4 rounded-2xl border-2 outline-none text-lg font-medium text-[#0c0a1d] transition-colors ${
              numberError
                ? 'border-rose-500 shadow-[5px_5px_0_#f43f5e]'
                : 'border-slate-900 shadow-[5px_5px_0_#7c3aed] focus:border-violet-700'
            }`}
          />
          {numberError ? (
            <p role="alert" className="mt-3 text-sm font-bold text-rose-600">
              {numberError}
            </p>
          ) : detected && operatorMismatch ? (
            <p role="status" className="mt-3 text-sm font-bold text-amber-700">
              {mismatchMessage}
            </p>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              {detected ? `${detected} ${COPY.checkout.detectedBadge}. ` : ''}
              {COPY.checkout.destinationWarning}
            </p>
          )}

          <label htmlFor="checkout-wa" className="block mt-6 text-sm font-bold text-[#0c0a1d]">
            {COPY.checkout.waFieldLabel}
          </label>
          <input
            id="checkout-wa"
            type="text"
            inputMode="numeric"
            value={draft.whatsapp}
            onChange={(e) => onDraftChange({ whatsapp: e.target.value })}
            placeholder={COPY.checkout.waFieldPlaceholder}
            className="mt-3 w-full px-5 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-violet-600 outline-none text-base text-[#0c0a1d] font-medium"
          />

          <p className="mt-8 text-sm font-bold text-[#0c0a1d]">{COPY.checkout.paymentMethodLabel}</p>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PAYMENT_METHODS.map((pm) => {
              const isSelected = draft.payment === pm.id;
              return (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => onDraftChange({ payment: pm.id })}
                  aria-pressed={isSelected}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-violet-600 bg-violet-50 text-violet-700'
                      : 'border-slate-200 hover:border-violet-400'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">{pm.icon}</span>
                    <span className="text-[12px] font-bold truncate">{pm.name.split(' (')[0]}</span>
                  </span>
                  <span className="block text-[11px] mt-1 opacity-70">
                    {pm.fee === 0 ? COPY.checkout.summaryFree : `+${formatRupiah(pm.fee)}`}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-slate-500">{COPY.checkout.reviewNote}</p>
        </section>

        <aside className="lg:col-span-5 w-full">
          <div className="bg-slate-900 text-white rounded-[28px] p-6 lg:sticky lg:top-24">
            <p className="text-sm text-white/60">{flow.summary}</p>
            <p className="mt-2 text-2xl font-black">{product.title}</p>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-white/60">{flow.rowNumber}</span>
                <span className="font-semibold text-right break-all">
                  {draft.destination || flow.notChosen}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-white/60">{flow.rowProvider}</span>
                <span className="font-semibold text-right">{product.providerBadgeText}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-white/60">{flow.rowMethod}</span>
                <span className="font-semibold text-right">
                  {selectedMethod.name.split(' (')[0]}
                </span>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-white/10 space-y-2 text-sm">
              {selectedMethod.fee > 0 && (
                <div className="flex justify-between gap-3">
                  <span className="text-white/60">{COPY.checkout.summaryFee}</span>
                  <span className="font-semibold">{formatRupiah(selectedMethod.fee)}</span>
                </div>
              )}
              <div className="flex justify-between items-end gap-3">
                <span className="text-white/60">{flow.rowTotal}</span>
                <span className="text-2xl font-black">{formatRupiah(totalAmount)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 active:scale-[0.99] font-bold transition-all cursor-pointer"
            >
              {flow.btnContinuePay}
            </button>
            <div className="mt-5 flex items-center gap-3 text-sm text-white/60">
              <span className="material-symbols-outlined text-[20px]">chat</span>
              {flow.helpCs}
            </div>
          </div>
        </aside>
      </form>
    </PageFrame>
  );
};

/* ══════════════════════════════════════════════════════════════
   HALAMAN 2 — Pembayaran (setara pages/pembayaran)
   ══════════════════════════════════════════════════════════════ */
export const CheckoutPaymentPage: React.FC<{
  product: Product | null;
  draft: CheckoutDraft;
  onBack: () => void;
  onConfirm: (order: Order) => void;
  onOpenTracking: () => void;
  onCancel: () => void;
}> = ({ product, draft, onBack, onConfirm, onOpenTracking, onCancel }) => {
  const [countdown, setCountdown] = useState(900);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const flow = COPY.checkout.flow;
  const { settings } = useCatalog();

  useEffect(() => {
    const timer = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const selectedMethod =
    PAYMENT_METHODS.find((m) => m.id === draft.payment) || PAYMENT_METHODS[0];

  const vaNumber = useMemo(() => {
    const prefix = VA_PREFIX[draft.payment] ?? '8808';
    return `${prefix}${String(hashString(`${product?.id ?? ''}-${draft.payment}`)).padStart(8, '0')}`;
  }, [product?.id, draft.payment]);

  if (!product) {
    return (
      <PageFrame title={COPY.checkout.title} onClose={onCancel}>
        <EmptyState onBack={onCancel} />
      </PageFrame>
    );
  }

  const fee = selectedMethod.fee;
  const totalAmount = product.price + fee;
  const isQris = selectedMethod.category === 'qris';
  const isVa = selectedMethod.category === 'va';
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  const handleConfirm = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      const sn =
        product.category === 'pln'
          ? Array.from({ length: 5 }, () => Math.floor(1000 + Math.random() * 9000)).join('-')
          : `${Date.now()}${Math.floor(100000 + Math.random() * 900000)}`;

      // Waktu WIB bentuk 'YYYY-MM-DD HH:mm:ss' (sama dengan data pesanan lain).
      const createdAt = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' });

      try {
        confetti({ particleCount: 80, spread: 65, origin: { y: 0.35 } });
      } catch {
        /* confetti is a visual nicety only */
      }

      onConfirm({
        id: `ord-${Date.now()}`,
        invoiceNumber: draft.trxRef || `VRX-${Math.floor(100000 + Math.random() * 900000)}`,
        productId: product.id,
        productTitle: product.title,
        provider: product.provider,
        destination: draft.destination,
        whatsappContact: draft.whatsapp || draft.destination,
        price: product.price,
        fee,
        total: totalAmount,
        paymentMethod: selectedMethod.name,
        status: 'BERHASIL',
        createdAt,
        serialNumber: sn,
        notes: product.isBill
          ? 'Tagihan berhasil diverifikasi dan diselesaikan ke biller resmi.'
          : 'Transaksi berhasil diproses oleh pihak provider.',
      });
    }, 1200);
  };

  const rows: { label: string; value: string }[] = [
    { label: flow.rowNumber, value: draft.destination || '-' },
    { label: flow.rowProvider, value: product.providerBadgeText },
    { label: flow.rowChoice, value: product.title },
    { label: flow.rowMethod, value: selectedMethod.name.split(' (')[0] },
  ];

  return (
    <PageFrame title={COPY.checkout.title} onClose={onCancel}>
      <div className="grid lg:grid-cols-5 gap-4 items-start max-w-5xl mx-auto">
        <section className="lg:col-span-3 bg-white rounded-[28px] border border-slate-200/70 p-6 md:p-10 text-center">
          <button
            type="button"
            onClick={onBack}
            className="block text-left text-sm text-slate-500 hover:text-violet-700 transition-colors cursor-pointer"
          >
            ← {flow.btnBackToEdit}
          </button>

          <span className="mt-6 inline-flex items-center gap-2 bg-violet-50 text-violet-900 rounded-full pl-1.5 pr-4 py-1.5 text-sm">
            <span className="bg-violet-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {selectedMethod.name.split(' (')[0]}
            </span>
            {flow.waitingBadge}
          </span>

          <h2 className="mt-5 text-3xl md:text-5xl font-black tracking-[-0.04em] text-[#0c0a1d]">
            {isQris ? flow.payTitle : COPY.checkout.payOtherTitle}
          </h2>
          <p className="mt-2 text-slate-500 text-sm sm:text-base">
            {isQris
              ? flow.paySubtitle
              : isVa
                ? COPY.checkout.vaInstruction
                : COPY.checkout.ewalletInstruction}
          </p>

          {isQris ? (
            <>
              <div className="mt-8 mx-auto w-64 md:w-72 p-4 rounded-[28px] border-2 border-slate-900 shadow-[6px_6px_0_#7c3aed] bg-white">
                <div className="aspect-square rounded-2xl border border-slate-100 p-2">
                  {settings.qris_image_url ? (
                    <img
                      src={cldImg(settings.qris_image_url, { w: 360 })}
                      loading="lazy"
                      alt="QRIS Virello"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <QrisMatrix />
                  )}
                </div>
                <p className="mt-3 text-xs font-bold tracking-widest text-slate-400">
                  {flow.qrisCaption}
                </p>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-slate-500">
                {flow.chips.map((chip) => (
                  <span key={chip} className="px-3 py-1.5 rounded-full border border-slate-200">
                    {chip}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-8 mx-auto w-full max-w-sm p-5 rounded-[28px] border-2 border-slate-900 shadow-[6px_6px_0_#7c3aed] bg-white text-left">
              <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                {isVa ? COPY.checkout.vaLabel : COPY.checkout.merchantLabel}
              </p>
              <p className="mt-2 text-2xl sm:text-3xl font-black tracking-wider text-[#0c0a1d] break-all">
                {vaNumber}
              </p>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(vaNumber);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
                {copied ? COPY.checkout.btnCopiedVa : COPY.checkout.btnCopyVa}
              </button>
              <p className="mt-4 text-sm text-slate-500">
                {COPY.checkout.summaryTotal}:{' '}
                <span className="font-bold">{formatRupiah(totalAmount)}</span>
              </p>
            </div>
          )}

          <p className="mt-5 text-sm font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-2xl py-2.5 px-4 inline-block">
            {COPY.checkout.qrisTimerNotice} {pad(minutes)}:{pad(seconds)}
          </p>
        </section>

        <aside className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-slate-900 text-white rounded-[28px] p-6">
            <p className="text-sm text-white/60">{flow.summaryOrder}</p>
            <p className="mt-2 text-2xl font-black">{product.title}</p>

            <div className="mt-5 space-y-3 text-sm">
              {rows.map((row) => (
                <div key={row.label} className="flex justify-between gap-3">
                  <span className="text-white/60">{row.label}</span>
                  <span className="font-semibold text-right break-all">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-5 border-t border-white/10 flex justify-between items-end gap-3">
              <span className="text-white/60 text-sm">{flow.rowTotal}</span>
              <span className="text-xl font-black">{formatRupiah(totalAmount)}</span>
            </div>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handleConfirm}
              className="mt-6 block w-full py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 active:scale-[0.99] font-bold transition-all cursor-pointer disabled:opacity-60"
            >
              {isProcessing ? COPY.checkout.verifyingText : COPY.checkout.btnAlreadyPaid}
            </button>
            <button
              type="button"
              onClick={onOpenTracking}
              className="mt-3 block w-full py-3 rounded-2xl border border-white/15 text-sm font-semibold hover:bg-white/5 transition-colors cursor-pointer"
            >
              {flow.btnCheckStatus}
            </button>
          </div>

          <div className="bg-white rounded-[28px] border border-slate-200/70 p-6">
            <p className="font-black text-lg text-[#0c0a1d]">{flow.howToPay}</p>
            <ol className="mt-4 space-y-4 text-sm">
              {flow.howToPaySteps.map((text, idx) => (
                <li key={text} className="flex gap-3">
                  <span className="w-7 h-7 shrink-0 rounded-full bg-violet-600 text-white grid place-items-center font-bold text-xs">
                    {idx + 1}
                  </span>
                  <span className="text-slate-600">{text}</span>
                </li>
              ))}
            </ol>
            <div className="mt-5 flex items-center gap-3 text-sm text-slate-500">
              <span className="material-symbols-outlined text-[20px] text-violet-600">chat</span>
              {flow.helpCs}
            </div>
          </div>
        </aside>
      </div>
    </PageFrame>
  );
};

/* ══════════════════════════════════════════════════════════════
   HALAMAN 3 — Berhasil (setara pages/berhasil)
   ══════════════════════════════════════════════════════════════ */
export const CheckoutSuccessPage: React.FC<{
  order: Order | null;
  isPln: boolean;
  onBuyAgain: () => void;
  onGoHome: () => void;
  onCancel: () => void;
}> = ({ order, isPln, onBuyAgain, onGoHome, onCancel }) => {
  const flow = COPY.checkout.flow;

  if (!order) {
    return (
      <PageFrame title={COPY.checkout.title} onClose={onCancel}>
        <EmptyState onBack={onCancel} />
      </PageFrame>
    );
  }

  const detailRows = [
    { label: flow.detailOrderId, value: order.invoiceNumber },
    { label: flow.rowProvider, value: order.provider },
    { label: COPY.checkout.detailDestination, value: order.destination },
    { label: flow.rowChoice, value: order.productTitle },
    { label: COPY.checkout.detailMethod, value: order.paymentMethod },
    { label: COPY.checkout.detailDate, value: order.createdAt },
  ];

  return (
    <PageFrame title={COPY.checkout.title} onClose={onCancel}>
      <div className="max-w-3xl mx-auto space-y-4">
        <section className="bg-white rounded-[28px] border border-slate-200/70 p-6 md:p-10 text-center">
          <span className="mx-auto w-20 h-20 rounded-full bg-emerald-400 text-emerald-950 grid place-items-center shadow-[6px_6px_0_#7c3aed]">
            <span className="material-symbols-outlined text-[40px]">check</span>
          </span>
          <span className="mt-6 inline-block px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-sm font-bold">
            {COPY.checkout.successBadge}
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-black tracking-[-0.04em] text-[#0c0a1d]">
            {flow.successTitle}
          </h2>
          <p className="mt-2 text-slate-500">
            {isPln ? flow.successMsgPln : flow.successMsg}
          </p>

          <ol className="mt-8 grid grid-cols-3 gap-2 text-left">
            {flow.stages.map((stage, idx) => {
              const isLast = idx === flow.stages.length - 1;
              return (
                <li
                  key={stage}
                  className={`p-4 rounded-2xl ${
                    isLast ? 'bg-violet-600 text-white' : 'bg-violet-50 text-[#0c0a1d]'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-full grid place-items-center ${
                      isLast ? 'bg-white text-violet-700' : 'bg-violet-600 text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </span>
                  <p className="mt-2 text-sm font-bold">{stage}</p>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="bg-white rounded-[28px] border border-slate-200/70 p-6 md:p-10">
          <p className="text-xl font-black text-[#0c0a1d]">{flow.detailTitle}</p>

          <div className="mt-4 text-sm">
            {detailRows.map((row) => (
              <div
                key={row.label}
                className="flex justify-between gap-4 py-3.5 border-b border-slate-100"
              >
                <span className="text-slate-500">{row.label}</span>
                <span className="font-semibold text-right text-[#0c0a1d] break-all">
                  {row.value}
                </span>
              </div>
            ))}
            <div className="flex justify-between gap-4 py-3.5">
              <span className="text-slate-500">{flow.detailStatus}</span>
              <span className="font-bold text-emerald-700">{flow.statusSuccess}</span>
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onBuyAgain}
              className="text-center px-6 py-4 rounded-2xl bg-violet-600 hover:bg-violet-700 active:scale-[0.99] text-white font-bold transition-all cursor-pointer"
            >
              {flow.btnBuyAgain}
            </button>
            <button
              type="button"
              onClick={onGoHome}
              className="text-center px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold transition-all cursor-pointer"
            >
              {flow.btnHome}
            </button>
          </div>

          <p className="mt-5 text-center text-sm text-slate-500">{flow.csNote}</p>
        </section>
      </div>
    </PageFrame>
  );
};
