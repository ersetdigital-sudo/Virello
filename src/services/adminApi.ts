import { Product } from '../types';
import { CategoryMeta } from '../data/categories';

export interface AdminSettings {
  whatsapp_number: string;
  whatsapp_message: string;
  qris_image_url: string | null;
}

export interface Overview {
  product_count: number;
  active_product_count: number;
  category_count: number;
  settings: AdminSettings;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    method: init?.method ?? 'GET',
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    body: init?.body,
  });
  if (res.status === 401) throw new ApiError('unauthorized', 401);
  let message = 'Permintaan gagal, coba lagi';
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    if (body && typeof body.error === 'string') message = body.error;
    throw new ApiError(message, res.status);
  }
  return body as T;
}

export const login = (password: string) =>
  req<{ ok: boolean }>('/api/admin/login', { method: 'POST', body: JSON.stringify({ password }) });

export const logout = () => req<{ ok: boolean }>('/api/admin/logout', { method: 'POST' });

export const getOverview = () => req<Overview>('/api/admin/overview');

export const getProducts = () => req<Product[]>('/api/admin/products?all=1');

export const createProduct = (payload: Partial<Product>) =>
  req<Product>('/api/admin/products', { method: 'POST', body: JSON.stringify(payload) });

export const updateProduct = (id: string, payload: Partial<Product>) =>
  req<Product>(`/api/admin/products/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });

export const deleteProduct = (id: string) =>
  req<{ ok: boolean }>(`/api/admin/products/${id}`, { method: 'DELETE' });

export const getCategories = () => req<CategoryMeta[]>('/api/admin/categories?all=1');

export const createCategory = (payload: Partial<CategoryMeta>) =>
  req<CategoryMeta>('/api/admin/categories', { method: 'POST', body: JSON.stringify(payload) });

export const updateCategory = (id: string, payload: Partial<CategoryMeta>) =>
  req<CategoryMeta>(`/api/admin/categories/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });

export const deleteCategory = (id: string) =>
  req<{ ok: boolean }>(`/api/admin/categories/${id}`, { method: 'DELETE' });

export const getSettings = () => req<AdminSettings>('/api/admin/settings');

export const saveSettings = (payload: AdminSettings) =>
  req<{ ok: boolean }>('/api/admin/settings', { method: 'PUT', body: JSON.stringify(payload) });

export const runSeed = () =>
  req<{ ok: boolean; categories: number; products: number }>('/api/admin/seed', {
    method: 'POST',
  });
