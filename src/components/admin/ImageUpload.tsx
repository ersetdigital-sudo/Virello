'use client';

import React, { useRef, useState } from 'react';
import { cldImg } from '../../lib/cloudinary';
import { req } from '../../services/adminApi';
import { MicroLabel } from './ui';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 2 * 1024 * 1024;

interface SignResponse {
  cloud_name: string;
  api_key: string;
  upload_preset: string;
  folder: string;
  timestamp: number;
  signature: string;
}

interface DestroyResponse {
  api_key: string;
  timestamp: number;
  signature: string;
}

function extractPublicId(url: string): string | null {
  const marker = '/image/upload/';
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  const segments = url.slice(idx + marker.length).split('/');
  if (segments[0]?.includes(',')) segments.shift();
  if (segments[0] && /^v\d+$/.test(segments[0])) segments.shift();
  const joined = segments.join('/');
  if (!joined) return null;
  return joined.replace(/\.[a-zA-Z0-9]+$/, '');
}

async function destroyByUrl(url: string, cloudName: string) {
  const publicId = extractPublicId(url);
  if (!publicId) return;
  try {
    const sig = await req<DestroyResponse>('/api/admin/cloudinary/sign-destroy', {
      method: 'POST',
      body: JSON.stringify({ public_id: publicId }),
    });
    const body = new URLSearchParams({
      api_key: sig.api_key,
      public_id: publicId,
      timestamp: String(sig.timestamp),
      signature: sig.signature,
    });
    await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: 'POST',
      body,
    });
  } catch {
    // gambar lama gagal dihapus tidak boleh memblokir alur utama
  }
}

export function ImageUpload({
  value,
  onChange,
  label,
  previewClassName = 'w-40',
  layout = 'default',
}: {
  value?: string | null;
  onChange: (url: string | null) => void;
  label: string;
  previewClassName?: string;
  layout?: 'default' | 'compact';
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);

  const handleFile = async (file: File) => {
    setError('');
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Format harus JPG, PNG, atau WebP');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('Ukuran gambar maksimal 2MB');
      return;
    }
    setBusy(true);
    try {
      const sign = await req<SignResponse>('/api/admin/cloudinary/sign', {
        method: 'POST',
        body: '{}',
      });
      const form = new FormData();
      form.append('file', file);
      form.append('api_key', sign.api_key);
      form.append('timestamp', String(sign.timestamp));
      form.append('signature', sign.signature);
      form.append('upload_preset', sign.upload_preset);
      form.append('folder', sign.folder);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${sign.cloud_name}/image/upload`,
        { method: 'POST', body: form },
      );
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.secure_url) {
        throw new Error(data?.error?.message ?? 'Upload gagal, coba lagi');
      }
      const previous = value;
      onChange(data.secure_url as string);
      if (previous) void destroyByUrl(previous, sign.cloud_name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload gagal, coba lagi');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    if (value) void destroyByUrl(value, 'lkx4drmd');
    onChange(null);
  };

  const publicId = value ? extractPublicId(value) : null;

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept="image/jpeg,image/png,image/webp"
      className="sr-only"
      disabled={busy}
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) void handleFile(file);
      }}
    />
  );

  return (
    <div className="space-y-2">
      <MicroLabel>{label}</MicroLabel>

      {layout === 'compact' ? (
        value ? (
          <div className="flex flex-wrap items-center gap-4">
            <div className="h-[132px] w-[132px] shrink-0 overflow-hidden rounded-xl border border-[#E9E5E0] bg-white p-1.5">
              <img
                src={cldImg(value, { w: 300 })}
                alt={label}
                loading="lazy"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-[#1B1B1F]">
                  <span className="material-symbols-outlined text-[16px] text-[#6D28D9]">
                    check_circle
                  </span>
                  QRIS terunggah
                </p>
                <p className="mt-0.5 truncate text-xs text-[#6a6a72]">
                  {publicId ?? label}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-[#E9E5E0] bg-white px-3.5 text-[13px] font-medium text-[#1B1B1F] transition-colors hover:bg-[#F7F4EE]">
                  <span className="material-symbols-outlined text-[16px]">upload</span>
                  Ganti Gambar
                  {fileInput}
                </label>
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={busy}
                  className="inline-flex h-10 items-center gap-2 rounded-xl px-3.5 text-[13px] font-medium text-[#FF6B57] transition-colors hover:bg-[#FFF1EE] disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ) : (
          <label
            className={`flex h-[160px] max-w-[680px] cursor-pointer items-center gap-4 rounded-2xl border border-dashed px-5 text-left transition-colors ${
              dragging
                ? 'border-[#6D28D9] bg-[#f5f0ff]'
                : 'border-[#E9E5E0] bg-white hover:border-[#6D28D9] hover:bg-[#faf8ff]'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) void handleFile(file);
            }}
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f5f0ff]">
              <span className="material-symbols-outlined text-[22px] text-[#6D28D9]">
                cloud_upload
              </span>
            </span>
            <span className="flex min-w-0 flex-col gap-1">
              <span className="text-sm font-semibold text-[#1B1B1F]">Upload QRIS</span>
              <span className="text-xs text-[#6a6a72]">
                Klik untuk memilih atau drag &amp; drop
              </span>
              <span className="text-[11px] text-[#8a8a94]">PNG, JPG, WebP · Maks. 2 MB</span>
            </span>
            {fileInput}
          </label>
        )
      ) : value ? (
        <div className="flex flex-wrap items-start gap-4">
          <div className="rounded-xl border border-[#e7e7ec] bg-white p-2">
            <img
              src={cldImg(value, { w: 400 })}
              alt={label}
              loading="lazy"
              className={`${previewClassName} max-h-48 rounded-lg object-contain`}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#e0e0e6] bg-white px-3 text-xs font-semibold transition-colors hover:bg-[#f5f5f7]">
              <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
              Ganti gambar
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                disabled={busy}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleFile(file);
                }}
              />
            </label>
            <button
              type="button"
              onClick={handleRemove}
              disabled={busy}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-xs font-semibold text-[#b23e33] transition-colors hover:bg-[#fdecea] disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              Hapus gambar
            </button>
          </div>
        </div>
      ) : (
        <label className="flex h-36 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#c9c9d2] bg-[#fafafd] px-4 text-center transition-colors hover:border-[#6d28d9] hover:bg-[#f5f0ff]">
          <span className="material-symbols-outlined text-[26px] text-[#6d28d9]">
            cloud_upload
          </span>
          <span className="text-sm font-semibold">Tarik gambar atau klik untuk unggah</span>
          <span className="text-xs text-[#5c5c66]">JPG, PNG, atau WebP — maksimal 2MB</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
        </label>
      )}

      {busy ? (
        <p className="flex items-center gap-1.5 text-xs font-medium text-[#5c5c66]">
          <span className="material-symbols-outlined animate-spin text-[14px]">
            progress_activity
          </span>
          Mengunggah…
        </p>
      ) : null}
      {error ? <p className="text-xs font-medium text-[#b23e33]">{error}</p> : null}
    </div>
  );
}
