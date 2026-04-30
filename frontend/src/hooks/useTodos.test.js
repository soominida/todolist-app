import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { useTodos, useCreateTodo, useUpdateTodo, useDeleteTodo, useToggleTodoComplete } from './useTodos';

vi.mock('@/api/todosApi', () => ({
  getTodos: vi.fn(),
  createTodo: vi.fn(),
  updateTodo: vi.fn(),
  deleteTodo: vi.fn(),
  toggleTodoComplete: vi.fn(),
}));

import { getTodos, createTodo, updateTodo, deleteTodo, toggleTodoComplete } from '@/api/todosApi';

const mockTodo = { id: 1, title: '할 일', isCompleted: false };

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe('useTodos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('todo 목록을 반환한다', async () => {
    getTodos.mockResolvedValue([mockTodo]);
    const { result } = renderHook(() => useTodos(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([mockTodo]);
  });

  it('queryKey에 필터 파라미터가 포함된다', async () => {
    getTodos.mockResolvedValue([]);
    const { result } = renderHook(() => useTodos({ categoryId: 1, status: 'pending' }), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getTodos).toHaveBeenCalledWith({ categoryId: 1, status: 'pending' });
  });
});

describe('useCreateTodo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('성공 후 todos 쿼리를 무효화한다', async () => {
    createTodo.mockResolvedValue(mockTodo);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    function Wrapper({ children }) {
      return createElement(QueryClientProvider, { client: queryClient }, children);
    }

    const { result } = renderHook(() => useCreateTodo(), { wrapper: Wrapper });

    await act(async () => {
      result.current.mutate({ title: '할 일' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['todos'] });
  });
});

describe('useUpdateTodo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('성공 후 todos 쿼리를 무효화한다', async () => {
    updateTodo.mockResolvedValue(mockTodo);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    function Wrapper({ children }) {
      return createElement(QueryClientProvider, { client: queryClient }, children);
    }

    const { result } = renderHook(() => useUpdateTodo(), { wrapper: Wrapper });

    await act(async () => {
      result.current.mutate({ id: 1, title: '수정된 할 일' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['todos'] });
  });
});

describe('useDeleteTodo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('성공 후 todos 쿼리를 무효화한다', async () => {
    deleteTodo.mockResolvedValue(undefined);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    function Wrapper({ children }) {
      return createElement(QueryClientProvider, { client: queryClient }, children);
    }

    const { result } = renderHook(() => useDeleteTodo(), { wrapper: Wrapper });

    await act(async () => {
      result.current.mutate(1);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['todos'] });
  });
});

describe('useToggleTodoComplete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('성공 후 todos 쿼리를 무효화한다', async () => {
    toggleTodoComplete.mockResolvedValue({ ...mockTodo, isCompleted: true });

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    function Wrapper({ children }) {
      return createElement(QueryClientProvider, { client: queryClient }, children);
    }

    const { result } = renderHook(() => useToggleTodoComplete(), { wrapper: Wrapper });

    await act(async () => {
      result.current.mutate(1);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['todos'] });
  });
});
