import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCategories, createCategory, updateCategory, deleteCategory } from './categoriesApi';
import { httpClient } from '@/lib/httpClient';

vi.mock('@/lib/httpClient', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockCategory = { id: 1, name: '업무' };

describe('categoriesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCategories', () => {
    it('성공 시 카테고리 배열을 반환한다', async () => {
      httpClient.get.mockResolvedValue({ data: { categories: [mockCategory] } });
      const result = await getCategories();
      expect(result).toEqual([mockCategory]);
      expect(httpClient.get).toHaveBeenCalledWith('/categories');
    });

    it('data.categories가 없을 경우 빈 배열을 반환한다', async () => {
      httpClient.get.mockResolvedValue({ data: {} });
      const result = await getCategories();
      expect(result).toEqual([]);
    });
  });

  describe('createCategory', () => {
    it('성공 시 생성된 카테고리를 반환한다', async () => {
      httpClient.post.mockResolvedValue({ data: { category: mockCategory } });
      const result = await createCategory('업무');
      expect(result).toEqual(mockCategory);
      expect(httpClient.post).toHaveBeenCalledWith('/categories', { name: '업무' });
    });
  });

  describe('updateCategory', () => {
    it('성공 시 수정된 카테고리를 반환한다', async () => {
      const updated = { id: 1, name: '개인' };
      httpClient.put.mockResolvedValue({ data: { category: updated } });
      const result = await updateCategory(1, '개인');
      expect(result).toEqual(updated);
      expect(httpClient.put).toHaveBeenCalledWith('/categories/1', { name: '개인' });
    });
  });

  describe('deleteCategory', () => {
    it('성공 시 httpClient.delete를 호출한다', async () => {
      httpClient.delete.mockResolvedValue({ success: true });
      await deleteCategory(1);
      expect(httpClient.delete).toHaveBeenCalledWith('/categories/1');
    });
  });
});
