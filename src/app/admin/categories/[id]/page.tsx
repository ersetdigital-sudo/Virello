'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CategoryMeta } from '../../../../data/categories';
import { getCategories } from '../../../../services/adminApi';
import { CategoryForm } from '../../../../components/admin/CategoryForm';

export default function EditCategoryPage() {
  const params = useParams<{ id: string }>();
  const [category, setCategory] = useState<CategoryMeta | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getCategories()
      .then((list) => {
        const found = list.find((c) => c.id === params.id);
        if (found) setCategory(found);
        else setError('Kategori tidak ditemukan');
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat kategori'));
  }, [params.id]);

  if (error) {
    return (
      <p className="rounded-xl border border-[#f3c9c4] bg-[#fdecea] px-4 py-3 text-sm font-medium text-[#b23e33]">
        {error}
      </p>
    );
  }

  if (!category) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-[#5c5c66]">
        <span className="material-symbols-outlined mr-2 animate-spin text-[18px]">
          progress_activity
        </span>
        Memuat kategori…
      </div>
    );
  }

  return <CategoryForm mode="edit" initial={category} />;
}
