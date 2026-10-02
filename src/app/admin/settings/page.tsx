'use client';

import React, { useEffect, useState } from 'react';
import {
  AdminSettings,
  getSettings,
  saveSettings,
} from '../../../services/adminApi';
import { ImageUpload } from '../../../components/admin/ImageUpload';

const CARD_CLS =
  'rounded-2xl border border-[#E9E5E0] bg-white shadow-[0_1px_2px_rgba(27,27,31,0.05)]';

const INPUT_CLS =
  'h-11 w-full rounded-[10px] border border-[#E9E5E0] bg-white px-3.5 text-sm text-[#1B1B1F] outline-none transition-colors placeholder:text-[#9a9aa4] focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/10';

const LABEL_CLS = 'block text-[13px] font-medium text-[#1B1B1F]';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={CARD_CLS}>
      <div className="border-b border-[#E9E5E0] px-5 py-4 md:px-6">
        <h2 className="text-[15px] font-semibold text-[#1B1B1F]">{title}</h2>
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings()
      .then((res) => {
        setSettings(res);
        setError('');
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat pengaturan'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      await saveSettings(settings);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-[#5c5c66]">
        <span className="material-symbols-outlined mr-2 animate-spin text-[18px]">
          progress_activity
        </span>
        Memuat pengaturan…
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="-mx-4 -mt-6 min-h-[calc(100vh-3.5rem)] bg-[#F7F4EE] px-4 py-6 md:-mx-8 md:-mt-8 md:px-8 md:py-8"
    >
      <div className="mx-auto max-w-[1120px] space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1B1B1F]">Pengaturan</h1>
            <p className="mt-1 text-sm text-[#6a6a72]">
              Kelola konfigurasi toko dan pembayaran Virello
            </p>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#5b21b6] disabled:pointer-events-none disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">check</span>
            {saving ? 'Menyimpan…' : 'Simpan Perubahan'}
          </button>
        </div>

        {error ? (
          <p className="rounded-xl border border-[#f3c9c4] bg-[#fdecea] px-4 py-3 text-sm font-medium text-[#b23e33]">
            {error}
          </p>
        ) : null}
        {saved ? (
          <p className="rounded-xl border border-[#bfe6d5] bg-[#e7f6f0] px-4 py-3 text-sm font-medium text-[#0e7a56]">
            Pengaturan tersimpan.
          </p>
        ) : null}

        <Section title="Informasi Kontak">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className={LABEL_CLS}>Nomor WhatsApp</span>
              <input
                className={INPUT_CLS}
                inputMode="tel"
                value={settings.whatsapp_number}
                onChange={(e) =>
                  setSettings((prev) =>
                    prev ? { ...prev, whatsapp_number: e.target.value } : prev,
                  )
                }
                placeholder="6281234567890"
              />
              <p className="text-xs text-[#6a6a72]">Format internasional tanpa +, diawali 62.</p>
            </label>
            <label className="block space-y-1.5 sm:col-span-2">
              <span className={LABEL_CLS}>Pesan WhatsApp Default</span>
              <textarea
                className={`${INPUT_CLS} h-[90px] resize-y py-2.5 leading-relaxed`}
                value={settings.whatsapp_message}
                onChange={(e) =>
                  setSettings((prev) =>
                    prev ? { ...prev, whatsapp_message: e.target.value } : prev,
                  )
                }
                placeholder="Halo CS Virello, saya membutuhkan bantuan…"
              />
            </label>
          </div>
        </Section>

        <Section title="Pembayaran">
          <ImageUpload
            layout="compact"
            label="Gambar QRIS"
            value={settings.qris_image_url}
            onChange={(url) =>
              setSettings((prev) => (prev ? { ...prev, qris_image_url: url } : prev))
            }
          />
          <p className="mt-3 text-xs text-[#6a6a72]">
            Gambar ini akan digunakan pada halaman pembayaran.
          </p>
        </Section>
      </div>
    </form>
  );
}
