'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../types';
import { CategoryMeta, CATEGORY_META } from '../data/categories';
import { INITIAL_PRODUCTS } from '../data/mockData';
import {
  CatalogSettings,
  FALLBACK_SETTINGS,
  fetchCatalog,
  filterActive,
} from '../services/catalogService';

interface CatalogContextValue {
  products: Product[];
  categories: CategoryMeta[];
  settings: CatalogSettings;
  ready: boolean;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

/**
 * State awal = persis nilai statis hari ini, jadi situs tampil normal sebelum
 * (atau tanpa) respons /api/catalog. Fetch hanya menimpa state bila valid.
 */
export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<CategoryMeta[]>(CATEGORY_META);
  const [settings, setSettings] = useState<CatalogSettings>(FALLBACK_SETTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchCatalog().then((data) => {
      if (cancelled) return;
      if (data) {
        setProducts(filterActive(data.products));
        setCategories(filterActive(data.categories));
        setSettings(data.settings);
      }
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <CatalogContext.Provider value={{ products, categories, settings, ready }}>
      {children}
    </CatalogContext.Provider>
  );
};

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return ctx;
}
