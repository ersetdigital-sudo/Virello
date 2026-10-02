'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Product } from '../../../../types';
import { getProducts } from '../../../../services/adminApi';
import { ProductForm } from '../../../../components/admin/ProductForm';

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getProducts()
      .then((list) => {
        const found = list.find((p) => p.id === params.id);
        if (found) setProduct(found);
        else setError('Produk tidak ditemukan');
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat produk'));
  }, [params.id]);

  if (error) {
    return (
      <p className="rounded-xl border border-[#f3c9c4] bg-[#fdecea] px-4 py-3 text-sm font-medium text-[#b23e33]">
        {error}
      </p>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-[#5c5c66]">
        <span className="material-symbols-outlined mr-2 animate-spin text-[18px]">
          progress_activity
        </span>
        Memuat produk…
      </div>
    );
  }

  return <ProductForm mode="edit" initial={product} />;
}
