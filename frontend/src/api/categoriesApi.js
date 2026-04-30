import { httpClient } from '@/lib/httpClient';

export async function getCategories() {
  const res = await httpClient.get('/categories');
  return res.data?.categories ?? [];
}

export async function createCategory(name) {
  const res = await httpClient.post('/categories', { name });
  return res.data?.category ?? res.data;
}

export async function updateCategory(id, name) {
  const res = await httpClient.put(`/categories/${id}`, { name });
  return res.data?.category ?? res.data;
}

export async function deleteCategory(id) {
  return httpClient.delete(`/categories/${id}`);
}
