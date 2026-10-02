'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CategoryMeta } from '../../data/categories';
import { CategoryId, FilterTab, Product } from '../../types';
import { createProduct, getCategories, updateProduct } from '../../services/adminApi';
import { ImageUpload } from './ImageUpload';
import { Btn, Card, Field, INPUT_H_CLS, MicroLabel, TitleRow, Toggle } from './ui';

interface Draft {
  title: string;
  category: string;
  description: string;
  price: string;
  originalPrice: string;
  nominalLabel: string;
  nominalSub: string;
  isBill: boolean;
  filterTab: FilterTab;
  popularScore: string;
  sortOrder: string;
  isActive: boolean;
  targetType: string;
  targetPlaceholder: string;
  actionText: Product['actionText'];
  provider: string;
  providerBadgeText: string;
  providerBadgeClass: string;
  tag: string;
  tagColor: string;
  image_url: string | null;
}

const DEFAULT_DRAFT: Draft = {
  title: '',
  category: 'pulsa',
  description: '',
  price: '',
  originalPrice: '',
  nominalLabel: '',
  nominalSub: '',
  isBill: false,
  filterTab: 'all',
  popularScore: '0',
  sortOrder: '0',
  isActive: true,
  targetType: 'phone',
  targetPlaceholder: '',
  actionText: 'Beli',
  provider: '',
  providerBadgeText: '',
  providerBadgeClass: '',
  tag: '',
  tagColor: 'emerald',
  image_url: null,
};

const toDraft = (p: Product): Draft => ({
  title: p.title,
  category: p.category,
  description: p.description,
  price: String(p.price),
  originalPrice: p.originalPrice !== undefined ? String(p.originalPrice) : '',
  nominalLabel: p.nominalLabel ?? '',
  nominalSub: p.nominalSub ?? '',
  isBill: Boolean(p.isBill),
  filterTab: p.filterTab,
  popularScore: String(p.popularScore ?? 0),
  sortOrder: String(p.sort_order ?? 0),
  isActive: p.is_active !== false,
  targetType: p.targetType,
  targetPlaceholder: p.targetPlaceholder,
  actionText: p.actionText,
  provider: p.provider,
  providerBadgeText: p.providerBadgeText,
  providerBadgeClass: p.providerBadgeClass,
  tag: p.tag ?? '',
  tagColor: p.tagColor ?? 'emerald',
  image_url: p.image_url ?? null,
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

export function ProductForm({ mode, initial }: { mode: 'create' | 'edit'; initial?: Product }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(() => (initial ? toDraft(initial) : DEFAULT_DRAFT));
  const [categories, setCategories] = useState<CategoryMeta[]>([]);
  const [errors, setErrors] = useState<{ title?: string; price?: string }>({});
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { title?: string; price?: string } = {};
    if (!draft.title.trim()) nextErrors.title = 'Judul wajib diisi';
    const priceNum = Number(draft.price);
    if (draft.price === '' || Number.isNaN(priceNum) || priceNum < 0) {
      nextErrors.price = 'Harga harus angka ≥ 0';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload: Partial<Product> = {
      title: draft.title.trim(),
      category: draft.category as CategoryId,
      description: draft.description,
      price: priceNum,
      originalPrice:
        draft.originalPrice === '' ? undefined : Number(draft.originalPrice) || undefined,
      nominalLabel: draft.nominalLabel || undefined,
      nominalSub: draft.nominalSub || undefined,
      isBill: draft.isBill,
      filterTab: draft.filterTab,
      popularScore: Number(draft.popularScore) || 0,
      sort_order: Number(draft.sortOrder) || 0,
      is_active: draft.isActive,
      targetType: draft.targetType as Product['targetType'],
      targetPlaceholder: draft.targetPlaceholder,
      actionText: draft.actionText,
      provider: draft.provider,
      providerBadgeText: draft.providerBadgeText,
      providerBadgeClass: draft.providerBadgeClass,
      tag: draft.tag || undefined,
      tagColor: draft.tag ? (draft.tagColor as Product['tagColor']) : undefined,
      image_url: draft.image_url,
    };

    setSaving(true);
    setSaveError('');
    try {
      if (mode === 'create') await createProduct(payload);
      else if (initial) await updateProduct(initial.id, payload);
      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Gagal menyimpan produk');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TitleRow
        title={mode === 'create' ? 'Tambah Produk' : 'Edit Produk'}
        sub={
          mode === 'create'
            ? 'Produk baru akan tampil di katalog terkait'
            : `Mengubah “${initial?.title ?? ''}”`
        }
      >
        <Btn variant="ghost" href="/admin/products">
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

      <SectionCard title="Info Produk">
        <Field label="Judul produk *" error={errors.title} className="sm:col-span-2">
          <input
            className={INPUT_H_CLS}
            value={draft.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Mis. Telkomsel 25rb"
          />
        </Field>
        <Field label="Kategori">
          <select
            className={SELECT_CLS}
            value={draft.category}
            onChange={(e) => set('category', e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Deskripsi">
          <input
            className={INPUT_H_CLS}
            value={draft.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Deskripsi singkat"
          />
        </Field>
      </SectionCard>

      <SectionCard title="Harga">
        <Field label="Harga (Rp) *" error={errors.price}>
          <input
            className={INPUT_H_CLS}
            inputMode="numeric"
            value={draft.price}
            onChange={(e) => set('price', e.target.value)}
            placeholder="25000"
          />
        </Field>
        <Field label="Harga coret (opsional)">
          <input
            className={INPUT_H_CLS}
            inputMode="numeric"
            value={draft.originalPrice}
            onChange={(e) => set('originalPrice', e.target.value)}
            placeholder="27000"
          />
        </Field>
        <Field label="Label nominal (mis. 25rb)">
          <input
            className={INPUT_H_CLS}
            value={draft.nominalLabel}
            onChange={(e) => set('nominalLabel', e.target.value)}
          />
        </Field>
        <Field label="Keterangan nominal (mis. Pulsa)">
          <input
            className={INPUT_H_CLS}
            value={draft.nominalSub}
            onChange={(e) => set('nominalSub', e.target.value)}
          />
        </Field>
        <div className="sm:col-span-2">
          <Toggle
            checked={draft.isBill}
            onChange={(v) => set('isBill', v)}
            label="Produk tagihan (bill)"
          />
        </div>
      </SectionCard>

      <SectionCard title="Penempatan">
        <Field label="Tab filter">
          <select
            className={SELECT_CLS}
            value={draft.filterTab}
            onChange={(e) => set('filterTab', e.target.value as FilterTab)}
          >
            <option value="all">Semua</option>
            <option value="pulsa-data">Pulsa & Data</option>
            <option value="pln">PLN</option>
            <option value="emoney">E-Money</option>
            <option value="tagihan">Tagihan</option>
          </select>
        </Field>
        <Field label="Skor popularitas">
          <input
            className={INPUT_H_CLS}
            inputMode="numeric"
            value={draft.popularScore}
            onChange={(e) => set('popularScore', e.target.value)}
          />
        </Field>
        <Field label="Urutan tampil (kecil = atas)">
          <input
            className={INPUT_H_CLS}
            inputMode="numeric"
            value={draft.sortOrder}
            onChange={(e) => set('sortOrder', e.target.value)}
          />
        </Field>
        <div className="flex items-end pb-1">
          <Toggle
            checked={draft.isActive}
            onChange={(v) => set('isActive', v)}
            label="Produk aktif"
          />
        </div>
      </SectionCard>

      <SectionCard title="Target Transaksi">
        <Field label="Jenis target">
          <select
            className={SELECT_CLS}
            value={draft.targetType}
            onChange={(e) => set('targetType', e.target.value)}
          >
            <option value="phone">Nomor HP</option>
            <option value="meter">Nomor meter</option>
            <option value="id_pelanggan">ID pelanggan</option>
            <option value="bpjs_id">No. BPJS</option>
            <option value="pdam_id">No. PDAM</option>
            <option value="kontrak_id">No. kontrak</option>
          </select>
        </Field>
        <Field label="Placeholder target">
          <input
            className={INPUT_H_CLS}
            value={draft.targetPlaceholder}
            onChange={(e) => set('targetPlaceholder', e.target.value)}
            placeholder="0812xxxxxxxx"
          />
        </Field>
        <Field label="Teks aksi">
          <select
            className={SELECT_CLS}
            value={draft.actionText}
            onChange={(e) => set('actionText', e.target.value as Product['actionText'])}
          >
            <option value="Beli">Beli</option>
            <option value="Top Up">Top Up</option>
            <option value="Cek Tagihan">Cek Tagihan</option>
          </select>
        </Field>
      </SectionCard>

      <SectionCard title="Identitas Provider">
        <Field label="Provider">
          <input
            className={INPUT_H_CLS}
            value={draft.provider}
            onChange={(e) => set('provider', e.target.value)}
            placeholder="Telkomsel"
          />
        </Field>
        <Field label="Teks badge provider">
          <input
            className={INPUT_H_CLS}
            value={draft.providerBadgeText}
            onChange={(e) => set('providerBadgeText', e.target.value)}
          />
        </Field>
        <Field label="Kelas badge provider" className="sm:col-span-2">
          <input
            className={INPUT_H_CLS}
            value={draft.providerBadgeClass}
            onChange={(e) => set('providerBadgeClass', e.target.value)}
            placeholder="bg-emerald-50 text-emerald-700"
          />
        </Field>
        <Field label="Tag (opsional)">
          <input
            className={INPUT_H_CLS}
            value={draft.tag}
            onChange={(e) => set('tag', e.target.value)}
            placeholder="Populer"
          />
        </Field>
        <Field label="Warna tag">
          <select
            className={SELECT_CLS}
            value={draft.tagColor}
            onChange={(e) => set('tagColor', e.target.value)}
          >
            <option value="emerald">Emerald</option>
            <option value="violet">Violet</option>
            <option value="amber">Amber</option>
            <option value="blue">Blue</option>
            <option value="gray">Gray</option>
          </select>
        </Field>
      </SectionCard>

      <Card className="p-5 md:p-6">
        <ImageUpload
          label="Gambar produk"
          value={draft.image_url}
          onChange={(url) => set('image_url', url)}
        />
      </Card>
    </form>
  );
}
