'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Product } from '../../../types';
import { deleteProduct, getProducts, runSeed } from '../../../services/adminApi';
import { Btn, Card, EmptyState, INPUT_CLS, Pill, rp, TitleRow } from '../../../components/admin/ui';

type Tab = 'active' | 'all';

export default function AdminProductsPage() {
  const [items, setItems] = useState<Product[] | null>(null);
  const [tab, setTab] = useState<Tab>('active');
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [seeding, setSeeding] = useState(false);

  const load = useCallback(() => {
    getProducts()
      .then((res) => {
        setItems(res);
        setError('');
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Gagal memuat produk');
      });
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

  const handleDelete = async (p: Product) => {
    if (!window.confirm(`Hapus produk “${p.title}”?`)) return;
    try {
      await deleteProduct(p.id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus produk');
    }
  };

  const filtered = (items ?? []).filter((p) => {
    const activeOk = tab === 'all' || p.is_active !== false;
    const q = query.trim().toLowerCase();
    const queryOk =
      !q || p.title.toLowerCase().includes(q) || p.provider.toLowerCase().includes(q);
    return activeOk && queryOk;
  });

  return (
    <div className="space-y-6">
      <TitleRow title="Produk" sub={`${items?.length ?? 0} produk terdaftar`}>
        <Btn href="/admin/products/baru">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Tambah Produk
        </Btn>
      </TitleRow>

      {error ? (
        <p className="rounded-xl border border-[#f3c9c4] bg-[#fdecea] px-4 py-3 text-sm font-medium text-[#b23e33]">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex h-9 items-center rounded-full border border-[#e0e0e6] bg-white p-1">
          {(
            [
              ['active', 'Aktif'],
              ['all', 'Semua'],
            ] as [Tab, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`h-7 rounded-full px-3.5 text-xs font-bold transition-colors ${
                tab === key ? 'bg-[#6d28d9] text-white' : 'text-[#5c5c66] hover:text-[#141416]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="relative">
          <span className="material-symbols-outlined pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-[#9a9aa4]">
            search
          </span>
          <input
            className={`${INPUT_CLS} h-9 w-full pl-8 sm:w-64`}
            placeholder="Cari judul / provider…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        {items === null ? (
          <div className="flex items-center justify-center py-16 text-sm text-[#5c5c66]">
            <span className="material-symbols-outlined mr-2 animate-spin text-[18px]">
              progress_activity
            </span>
            Memuat produk…
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="inventory_2"
            title={items.length === 0 ? 'Belum ada produk' : 'Tidak ada hasil'}
            desc={
              items.length === 0
                ? 'Impor data awal untuk memuat produk contoh, atau tambahkan produk pertama.'
                : 'Coba ubah kata kunci atau tab filter.'
            }
          >
            {items.length === 0 ? (
              <Btn variant="ghost" onClick={handleSeed} disabled={seeding}>
                <span className="material-symbols-outlined text-[18px]">download</span>
                {seeding ? 'Mengimpor…' : 'Impor data awal'}
              </Btn>
            ) : null}
            <Btn href="/admin/products/baru">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Tambah Produk
            </Btn>
          </EmptyState>
        ) : (
          <>
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#ececf0] text-left">
                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#5c5c66]">
                      Produk
                    </th>
                    <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#5c5c66]">
                      Kategori
                    </th>
                    <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-[#5c5c66]">
                      Harga
                    </th>
                    <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#5c5c66]">
                      Status
                    </th>
                    <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-[#5c5c66]">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-[#f2f2f5] transition-colors last:border-0 hover:bg-[#fafafb]"
                    >
                      <td className="px-5 py-3">
                        <div className="min-w-0">
                          <div className="truncate font-semibold">{p.title}</div>
                          <div className="truncate text-xs text-[#5c5c66]">{p.provider}</div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="rounded-full bg-[#f2f2f5] px-2.5 py-1 text-xs font-semibold">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">
                        <div className="font-semibold">{rp(p.price)}</div>
                        {p.originalPrice ? (
                          <div className="text-xs text-[#9a9aa4] line-through">
                            {rp(p.originalPrice)}
                          </div>
                        ) : null}
                      </td>
                      <td className="px-3 py-3">
                        <Pill tone={p.is_active !== false ? 'emerald' : 'gray'}>
                          {p.is_active !== false ? 'Aktif' : 'Nonaktif'}
                        </Pill>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1">
                          <a
                            href={`/admin/products/${p.id}`}
                            title="Edit"
                            className="grid h-8 w-8 place-items-center rounded-lg text-[#5c5c66] transition-colors hover:bg-[#f2f2f5] hover:text-[#141416]"
                          >
                            <span className="material-symbols-outlined text-[17px]">edit</span>
                          </a>
                          <button
                            type="button"
                            title="Hapus"
                            onClick={() => handleDelete(p)}
                            className="grid h-8 w-8 place-items-center rounded-lg text-[#5c5c66] transition-colors hover:bg-[#fdecea] hover:text-[#b23e33]"
                          >
                            <span className="material-symbols-outlined text-[17px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 p-4 md:hidden">
              {filtered.map((p) => (
                <div key={p.id} className="rounded-xl border border-[#ececf0] p-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{p.title}</div>
                    <div className="truncate text-xs text-[#5c5c66]">{p.provider}</div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="text-sm font-bold tabular-nums">{rp(p.price)}</span>
                      <Pill tone={p.is_active !== false ? 'emerald' : 'gray'}>
                        {p.is_active !== false ? 'Aktif' : 'Nonaktif'}
                      </Pill>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end gap-2 border-t border-[#f2f2f5] pt-2">
                    <a
                      href={`/admin/products/${p.id}`}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-[#5c5c66] hover:bg-[#f2f2f5]"
                    >
                      <span className="material-symbols-outlined text-[15px]">edit</span>
                      Edit
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDelete(p)}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-[#b23e33] hover:bg-[#fdecea]"
                    >
                      <span className="material-symbols-outlined text-[15px]">delete</span>
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
