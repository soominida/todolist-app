import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { useCategories, useCreateCategory, useDeleteCategory } from './useCategories';

vi.mock('@/api/categoriesApi', () => ({
  getCategories: vi.fn(),
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
}));

import { getCategories, createCategory, deleteCategory } from '@/api/categoriesApi';

const mockCategories = [{ id: 1, name: '업무' }];

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe('useCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('카테고리 목록을 반환한다', async () => {
    getCategories.mockResolvedValue(mockCategories);

    const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockCategories);
  });
});

describe('useCreateCategory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('성공 후 categories 쿼리를 무효화한다', async () => {
    createCategory.mockResolvedValue({ id: 2, name: '개인' });

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    function Wrapper({ children }) {
      return createElement(QueryClientProvider, { client: queryClient }, children);
    }

    const { result } = renderHook(() => useCreateCategory(), { wrapper: Wrapper });

    await act(async () => {
      result.current.mutate('개인');
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['categories'] });
  });
});

describe('useDeleteCategory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('성공 후 categories 쿼리를 무효화한다', async () => {
    deleteCategory.mockResolvedValue({ success: true });

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    function Wrapper({ children }) {
      return createElement(QueryClientProvider, { client: queryClient }, children);
    }

    const { result } = renderHook(() => useDeleteCategory(), { wrapper: Wrapper });

    await act(async () => {
      result.current.mutate(1);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['categories'] });
  });
});
