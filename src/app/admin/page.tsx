'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { getOverview, runSeed, Overview, ApiError } from '../../services/adminApi';
import { Btn, Card, EmptyState, MicroLabel, Pill, TitleRow } from '../../components/admin/ui';

function StatCard({ label, value }: { label: string; value: number | null }) {
  return (
    <Card className="p-5">
      <MicroLabel>{label}</MicroLabel>
      <p className="mt-2 text-2xl font-bold tabular-nums">
        {value === null ? '—' : value.toLocaleString('id-ID')}
      </p>
    </Card>
  );
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState('');
  const [seeding, setSeeding] = useState(false);

  const load = useCallback(() => {
    getOverview()
      .then((res) => {
        setData(res);
        setError('');
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) return;
        setError('Gagal memuat ringkasan');
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

  const isEmpty = data !== null && data.product_count === 0;
  const qrisReady = Boolean(data?.settings.qris_image_url);

  return (
    <div className="space-y-6">
      <TitleRow title="Dashboard" sub="Ringkasan toko dan status pengaturan">
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Produk" value={data?.product_count ?? null} />
        <StatCard label="Produk Aktif" value={data?.active_product_count ?? null} />
        <StatCard label="Kategori" value={data?.category_count ?? null} />
      </div>

      <Card className="p-5">
        <MicroLabel>Status Pengaturan</MicroLabel>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <a href="/admin/settings" className="transition-opacity hover:opacity-80">
            <Pill tone={qrisReady ? 'emerald' : 'amber'}>
              QRIS: {qrisReady ? 'terhubung' : 'belum'}
            </Pill>
          </a>
          <a href="/admin/settings" className="transition-opacity hover:opacity-80">
            <Pill tone="emerald">WhatsApp: aktif</Pill>
          </a>
          <a
            href="/admin/settings"
            className="ml-auto text-sm font-semibold text-[#6d28d9] hover:underline"
          >
            Atur pengaturan →
          </a>
        </div>
      </Card>

      {isEmpty ? (
        <Card>
          <EmptyState
            icon="inventory_2"
            title="Belum ada produk"
            desc="Impor data awal untuk memuat produk dan kategori contoh, atau tambahkan produk baru."
          >
            <Btn variant="ghost" onClick={handleSeed} disabled={seeding}>
              <span className="material-symbols-outlined text-[18px]">download</span>
              {seeding ? 'Mengimpor…' : 'Impor data awal'}
            </Btn>
          </EmptyState>
        </Card>
      ) : null}
    </div>
  );
}
