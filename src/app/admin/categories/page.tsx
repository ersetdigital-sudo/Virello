'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { CategoryMeta } from '../../../data/categories';
import { deleteCategory, getCategories, runSeed } from '../../../services/adminApi';
import { Btn, Card, EmptyState, Pill, TitleRow } from '../../../components/admin/ui';

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<CategoryMeta[] | null>(null);
  const [error, setError] = useState('');
  const [seeding, setSeeding] = useState(false);

  const load = useCallback(() => {
    getCategories()
      .then((res) => {
        setItems(res);
        setError('');
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat kategori'));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await runSeed();
      load();
    } catch {
      setError('Impor data awal gagal');
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async (c: CategoryMeta) => {
    if (!window.confirm(`Hapus kategori “${c.label}”? Semua produk di kategori ini ikut terhapus.`))
      return;
    try {
      await deleteCategory(c.id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus kategori');
    }
  };

  return (
    <div className="space-y-6">
      <TitleRow title="Kategori" sub={`${items?.length ?? 0} kategori terdaftar`}>
        <Btn href="/admin/categories/baru">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Tambah Kategori
        </Btn>
      </TitleRow>

      {error ? (
        <p className="rounded-xl border border-[#f3c9c4] bg-[#fdecea] px-4 py-3 text-sm font-medium text-[#b23e33]">
          {error}
        </p>
      ) : null}

      <Card>
        {items === null ? (
          <div className="flex items-center justify-center py-16 text-sm text-[#5c5c66]">
            <span className="material-symbols-outlined mr-2 animate-spin text-[18px]">
              progress_activity
            </span>
            Memuat kategori…
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon="category"
            title="Belum ada kategori"
            desc="Impor data awal untuk memuat kategori contoh, atau tambahkan kategori baru."
          >
            <Btn variant="ghost" onClick={handleSeed} disabled={seeding}>
              <span className="material-symbols-outlined text-[18px]">download</span>
              {seeding ? 'Mengimpor…' : 'Impor data awal'}
            </Btn>
            <Btn href="/admin/categories/baru">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Tambah Kategori
            </Btn>
          </EmptyState>
        ) : (
          <ul className="divide-y divide-[#f2f2f5]">
            {items.map((c) => (
              <li
                key={c.id}
                className="flex flex-wrap items-center gap-3 px-4 py-3 transition-colors hover:bg-[#fafafb] md:px-5"
              >
                <div
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${c.iconBg} ${c.iconColor}`}
                >
                  <span className="material-symbols-outlined text-[20px]">{c.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">{c.label}</span>
                    <span className="text-xs text-[#5c5c66]">{c.slug}</span>
                  </div>
                  <p className="truncate text-xs text-[#5c5c66]">{c.desc}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone={c.variant === 'nominal' ? 'violet' : 'blue'}>{c.variant}</Pill>
                  {c.inSidebar === false ? <Pill tone="gray">tanpa sidebar</Pill> : null}
                  <Pill tone={c.is_active !== false ? 'emerald' : 'gray'}>
                    {c.is_active !== false ? 'Aktif' : 'Nonaktif'}
                  </Pill>
                </div>
                <div className="flex gap-1">
                  <a
                    href={`/admin/categories/${c.id}`}
                    title="Edit"
                    className="grid h-8 w-8 place-items-center rounded-lg text-[#5c5c66] transition-colors hover:bg-[#f2f2f5] hover:text-[#141416]"
                  >
                    <span className="material-symbols-outlined text-[17px]">edit</span>
                  </a>
                  <button
                    type="button"
                    title="Hapus"
                    onClick={() => handleDelete(c)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-[#5c5c66] transition-colors hover:bg-[#fdecea] hover:text-[#b23e33]"
                  >
                    <span className="material-symbols-outlined text-[17px]">delete</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
