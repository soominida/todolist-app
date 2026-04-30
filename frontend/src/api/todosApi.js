import { httpClient } from '@/lib/httpClient';

export async function getTodos({ categoryId, status } = {}) {
  const params = new URLSearchParams();
  if (categoryId != null) params.append('categoryId', categoryId);
  if (status) params.append('status', status);
  const query = params.toString();
  const url = query ? `/todos?${query}` : '/todos';
  const res = await httpClient.get(url);
  return res.data?.todos ?? [];
}

export async function createTodo(data) {
  const res = await httpClient.post('/todos', data);
  return res.data?.todo ?? res.data;
}

export async function updateTodo(id, data) {
  const res = await httpClient.put(`/todos/${id}`, data);
  return res.data?.todo ?? res.data;
}

export async function deleteTodo(id) {
  await httpClient.delete(`/todos/${id}`);
}

export async function toggleTodoComplete(id) {
  const res = await httpClient.patch(`/todos/${id}/complete`);
  return res.data?.todo ?? res.data;
}
