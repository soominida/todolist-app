import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTodos, createTodo, updateTodo, deleteTodo, toggleTodoComplete } from './todosApi';
import { httpClient } from '@/lib/httpClient';

vi.mock('@/lib/httpClient', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockTodo = { id: 1, title: '할 일', isCompleted: false };

describe('todosApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTodos', () => {
    it('필터 없이 호출하면 /todos를 조회한다', async () => {
      httpClient.get.mockResolvedValue({ data: { todos: [mockTodo] } });
      const result = await getTodos();
      expect(result).toEqual([mockTodo]);
      expect(httpClient.get).toHaveBeenCalledWith('/todos');
    });

    it('categoryId만 있으면 쿼리스트링에 포함한다', async () => {
      httpClient.get.mockResolvedValue({ data: { todos: [mockTodo] } });
      await getTodos({ categoryId: 2 });
      expect(httpClient.get).toHaveBeenCalledWith('/todos?categoryId=2');
    });

    it('status만 있으면 쿼리스트링에 포함한다', async () => {
      httpClient.get.mockResolvedValue({ data: { todos: [] } });
      await getTodos({ status: 'pending' });
      expect(httpClient.get).toHaveBeenCalledWith('/todos?status=pending');
    });

    it('categoryId와 status 둘 다 있으면 모두 포함한다', async () => {
      httpClient.get.mockResolvedValue({ data: { todos: [] } });
      await getTodos({ categoryId: 1, status: 'completed' });
      expect(httpClient.get).toHaveBeenCalledWith('/todos?categoryId=1&status=completed');
    });

    it('data.todos가 없을 경우 빈 배열을 반환한다', async () => {
      httpClient.get.mockResolvedValue({ data: {} });
      const result = await getTodos();
      expect(result).toEqual([]);
    });
  });

  describe('createTodo', () => {
    it('성공 시 생성된 todo를 반환한다', async () => {
      httpClient.post.mockResolvedValue({ data: { todo: mockTodo } });
      const result = await createTodo({ title: '할 일' });
      expect(result).toEqual(mockTodo);
      expect(httpClient.post).toHaveBeenCalledWith('/todos', { title: '할 일' });
    });
  });

  describe('updateTodo', () => {
    it('성공 시 수정된 todo를 반환한다', async () => {
      const updated = { ...mockTodo, title: '수정된 할 일' };
      httpClient.put.mockResolvedValue({ data: { todo: updated } });
      const result = await updateTodo(1, { title: '수정된 할 일' });
      expect(result).toEqual(updated);
      expect(httpClient.put).toHaveBeenCalledWith('/todos/1', { title: '수정된 할 일' });
    });
  });

  describe('deleteTodo', () => {
    it('성공 시 httpClient.delete를 호출한다', async () => {
      httpClient.delete.mockResolvedValue({ success: true });
      await deleteTodo(1);
      expect(httpClient.delete).toHaveBeenCalledWith('/todos/1');
    });
  });

  describe('toggleTodoComplete', () => {
    it('성공 시 수정된 todo를 반환한다', async () => {
      const completed = { ...mockTodo, isCompleted: true };
      httpClient.patch.mockResolvedValue({ data: { todo: completed } });
      const result = await toggleTodoComplete(1);
      expect(result).toEqual(completed);
      expect(httpClient.patch).toHaveBeenCalledWith('/todos/1/complete');
    });
  });
});
