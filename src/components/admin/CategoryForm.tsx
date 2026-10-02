'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CategoryMeta } from '../../data/categories';
import { CategoryId } from '../../types';
import { createCategory, updateCategory } from '../../services/adminApi';
import { Btn, Card, Field, INPUT_H_CLS, MicroLabel, TitleRow, Toggle } from './ui';

interface Draft {
  id: string;
  label: string;
  desc: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  slug: string;
  variant: 'nominal' | 'bill';
  inputLabel: string;
  inputPlaceholder: string;
  chipsTitle: string;
  chips: string;
  nominalTitle: string;
  nominalLayout: '' | 'grid4' | 'grid3';
  inSidebar: boolean;
  isActive: boolean;
  sortOrder: string;
}

const DEFAULT_DRAFT: Draft = {
  id: '',
  label: '',
  desc: '',
  icon: 'category',
  iconBg: 'bg-[#f5f0ff]',
  iconColor: 'text-[#6d28d9]',
  slug: '',
  variant: 'nominal',
  inputLabel: '',
  inputPlaceholder: '',
  chipsTitle: '',
  chips: '',
  nominalTitle: '',
  nominalLayout: '',
  inSidebar: true,
  isActive: true,
  sortOrder: '0',
};

const toDraft = (c: CategoryMeta): Draft => ({
  id: c.id,
  label: c.label,
  desc: c.desc,
  icon: c.icon,
  iconBg: c.iconBg,
  iconColor: c.iconColor,
  slug: c.slug,
  variant: c.variant,
  inputLabel: c.inputLabel,
  inputPlaceholder: c.inputPlaceholder,
  chipsTitle: c.chipsTitle ?? '',
  chips: (c.chips ?? []).join(', '),
  nominalTitle: c.nominalTitle ?? '',
  nominalLayout: c.nominalLayout ?? '',
  inSidebar: c.inSidebar !== false,
  isActive: c.is_active !== false,
  sortOrder: String(c.sort_order ?? 0),
});

const SELECT_CLS = `${INPUT_H_CLS} appearance-none pr-8`;

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="p-5 md:p-6">
      <div className="pb-4">
        <MicroLabel>{title}</MicroLabel>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </Card>
  );
}

export function CategoryForm({ mode, initial }: { mode: 'create' | 'edit'; initial?: CategoryMeta }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(() => (initial ? toDraft(initial) : DEFAULT_DRAFT));
  const [errors, setErrors] = useState<{ id?: string; label?: string; slug?: string }>({});
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { id?: string; label?: string; slug?: string } = {};
    if (mode === 'create' && !draft.id.trim()) nextErrors.id = 'ID wajib diisi';
    if (mode === 'create' && !/^[a-z0-9-]+$/.test(draft.id.trim())) {
      nextErrors.id = 'ID hanya boleh huruf kecil, angka, dan tanda -';
    }
    if (!draft.label.trim()) nextErrors.label = 'Label wajib diisi';
    if (!draft.slug.trim()) nextErrors.slug = 'Slug wajib diisi (mis. /pulsa)';
    else if (!draft.slug.trim().startsWith('/')) nextErrors.slug = 'Slug harus diawali /';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const chips = draft.chips
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Partial<CategoryMeta> = {
      label: draft.label.trim(),
      desc: draft.desc,
      icon: draft.icon,
      iconBg: draft.iconBg,
      iconColor: draft.iconColor,
      slug: draft.slug.trim(),
      variant: draft.variant,
      inputLabel: draft.inputLabel,
      inputPlaceholder: draft.inputPlaceholder,
      chipsTitle: draft.chipsTitle || undefined,
      chips: chips.length > 0 ? chips : undefined,
      nominalTitle: draft.nominalTitle || undefined,
      nominalLayout: draft.nominalLayout === '' ? undefined : draft.nominalLayout,
      inSidebar: draft.inSidebar,
      is_active: draft.isActive,
      sort_order: Number(draft.sortOrder) || 0,
    };

    setSaving(true);
    setSaveError('');
    try {
      if (mode === 'create') await createCategory({ id: draft.id.trim() as CategoryId, ...payload });
      else if (initial) await updateCategory(initial.id, payload);
      router.push('/admin/categories');
      router.refresh();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Gagal menyimpan kategori');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TitleRow
        title={mode === 'create' ? 'Tambah Kategori' : 'Edit Kategori'}
        sub={mode === 'create' ? 'Kategori baru tampil di katalog dan sidebar' : `Mengubah “${initial?.label ?? ''}”`}
      >
        <Btn variant="ghost" href="/admin/categories">
          Batal
        </Btn>
        <Btn type="submit" disabled={saving}>
          <span className="material-symbols-outlined text-[18px]">check</span>
          {saving ? 'Menyimpan…' : 'Simpan'}
        </Btn>
      </TitleRow>

      {saveError ? (
        <p className="rounded-xl border border-[#f3c9c4] bg-[#fdecea] px-4 py-3 text-sm font-medium text-[#b23e33]">
          {saveError}
        </p>
      ) : null}

      <SectionCard title="Identitas">
        <Field label="ID kategori *" error={errors.id} hint={mode === 'edit' ? 'ID tidak dapat diubah' : 'Huruf kecil, angka, tanda - (mis. pdam)'}>
          <input
            className={INPUT_H_CLS}
            value={draft.id}
            disabled={mode === 'edit'}
            onChange={(e) => set('id', e.target.value)}
            placeholder="pdam"
          />
        </Field>
        <Field label="Label *" error={errors.label}>
          <input
            className={INPUT_H_CLS}
            value={draft.label}
            onChange={(e) => set('label', e.target.value)}
            placeholder="PDAM"
          />
        </Field>
        <Field label="Deskripsi">
          <input
            className={INPUT_H_CLS}
            value={draft.desc}
            onChange={(e) => set('desc', e.target.value)}
            placeholder="Pembayaran tagihan air."
          />
        </Field>
        <Field label="Slug halaman *" error={errors.slug} hint="Diawali / (mis. /pdam)">
          <input
            className={INPUT_H_CLS}
            value={draft.slug}
            onChange={(e) => set('slug', e.target.value)}
            placeholder="/pdam"
          />
        </Field>
      </SectionCard>

      <SectionCard title="Ikon & Tampilan">
        <Field label="Nama ikon Material" hint="Contoh: water_drop, bolt, smartphone">
          <input
            className={INPUT_H_CLS}
            value={draft.icon}
            onChange={(e) => set('icon', e.target.value)}
          />
        </Field>
        <Field label="Varian halaman">
          <select
            className={SELECT_CLS}
            value={draft.variant}
            onChange={(e) => set('variant', e.target.value as Draft['variant'])}
          >
            <option value="nominal">Nominal (grid harga)</option>
            <option value="bill">Bill (cek tagihan)</option>
          </select>
        </Field>
        <Field label="Kelas latar ikon">
          <input
            className={INPUT_H_CLS}
            value={draft.iconBg}
            onChange={(e) => set('iconBg', e.target.value)}
            placeholder="bg-[#f5f0ff]"
          />
        </Field>
        <Field label="Kelas warna ikon">
          <input
            className={INPUT_H_CLS}
            value={draft.iconColor}
            onChange={(e) => set('iconColor', e.target.value)}
            placeholder="text-[#6d28d9]"
          />
        </Field>
      </SectionCard>

      <SectionCard title="Form Target">
        <Field label="Label input">
          <input
            className={INPUT_H_CLS}
            value={draft.inputLabel}
            onChange={(e) => set('inputLabel', e.target.value)}
            placeholder="Nomor pelanggan PDAM"
          />
        </Field>
        <Field label="Placeholder input">
          <input
            className={INPUT_H_CLS}
            value={draft.inputPlaceholder}
            onChange={(e) => set('inputPlaceholder', e.target.value)}
            placeholder="Masukkan nomor pelanggan"
          />
        </Field>
        <Field label="Judul chip" hint="Opsional (mis. Pilih layanan)">
          <input
            className={INPUT_H_CLS}
            value={draft.chipsTitle}
            onChange={(e) => set('chipsTitle', e.target.value)}
          />
        </Field>
        <Field label="Daftar chip" hint="Pisahkan dengan koma">
          <input
            className={INPUT_H_CLS}
            value={draft.chips}
            onChange={(e) => set('chips', e.target.value)}
            placeholder="IndiHome, Layanan lainnya"
          />
        </Field>
        <Field label="Judul grid nominal" hint="Opsional (mis. Pilih nominal)">
          <input
            className={INPUT_H_CLS}
            value={draft.nominalTitle}
            onChange={(e) => set('nominalTitle', e.target.value)}
          />
        </Field>
        <Field label="Tata letak grid">
          <select
            className={SELECT_CLS}
            value={draft.nominalLayout}
            onChange={(e) => set('nominalLayout', e.target.value as Draft['nominalLayout'])}
          >
            <option value="">Default (auto)</option>
            <option value="grid4">Grid 4 kolom</option>
            <option value="grid3">Grid 3 kolom</option>
          </select>
        </Field>
      </SectionCard>

      <SectionCard title="Penempatan & Status">
        <div className="flex flex-col gap-4 pb-1 sm:col-span-2 sm:flex-row sm:items-center sm:gap-10">
          <Toggle
            checked={draft.inSidebar}
            onChange={(v) => set('inSidebar', v)}
            label="Tampil di sidebar"
          />
          <Toggle
            checked={draft.isActive}
            onChange={(v) => set('isActive', v)}
            label="Kategori aktif"
          />
          <label className="block w-32 space-y-1.5">
            <MicroLabel>Urutan</MicroLabel>
            <input
              className={INPUT_H_CLS}
              inputMode="numeric"
              value={draft.sortOrder}
              onChange={(e) => set('sortOrder', e.target.value)}
            />
          </label>
        </div>
      </SectionCard>
    </form>
  );
}
