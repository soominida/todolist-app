import { jest } from '@jest/globals';

jest.unstable_mockModule('../../db/queries/categoryQueries.js', () => ({
  findCategoriesByUserId: jest.fn(),
  findCategoryById: jest.fn(),
  createCategory: jest.fn(),
  updateCategory: jest.fn(),
  deleteCategory: jest.fn(),
}));

const {
  findCategoriesByUserId,
  findCategoryById,
  createCategory: dbCreateCategory,
  updateCategory: dbUpdateCategory,
  deleteCategory: dbDeleteCategory,
} = await import('../../db/queries/categoryQueries.js');

const {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = await import('../categoryService.js');

describe('categoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listCategories', () => {
    it('userId에 해당하는 카테고리 목록을 반환한다', async () => {
      const rows = [{ id: 1, name: '업무', user_id: 1 }];
      findCategoriesByUserId.mockResolvedValue(rows);
      const result = await listCategories(1);
      expect(result).toEqual(rows);
    });
  });

  describe('createCategory', () => {
    it('정상 생성 시 카테고리를 반환한다', async () => {
      const category = { id: 1, name: '업무', user_id: 1 };
      dbCreateCategory.mockResolvedValue(category);
      const result = await createCategory(1, '업무');
      expect(result).toEqual(category);
    });

    it('이름이 20자 초과면 statusCode 400을 던진다', async () => {
      await expect(createCategory(1, 'a'.repeat(21))).rejects.toMatchObject({ statusCode: 400 });
    });

    it('이름이 빈 문자열이면 statusCode 400을 던진다', async () => {
      await expect(createCategory(1, '')).rejects.toMatchObject({ statusCode: 400 });
    });

    it('DB UNIQUE 위반 시 statusCode 409를 던진다', async () => {
      const dbErr = new Error('unique');
      dbErr.code = '23505';
      dbCreateCategory.mockRejectedValue(dbErr);
      await expect(createCategory(1, '업무')).rejects.toMatchObject({ statusCode: 409 });
    });
  });

  describe('updateCategory', () => {
    it('정상 수정 시 업데이트된 카테고리를 반환한다', async () => {
      const category = { id: 1, name: '개인', user_id: 1 };
      findCategoryById.mockResolvedValue(category);
      dbUpdateCategory.mockResolvedValue({ ...category, name: '개인' });
      const result = await updateCategory(1, 1, '개인');
      expect(result.name).toBe('개인');
    });

    it('카테고리가 없으면 statusCode 404를 던진다', async () => {
      findCategoryById.mockResolvedValue(null);
      await expect(updateCategory(999, 1, '개인')).rejects.toMatchObject({ statusCode: 404 });
    });

    it('이름이 20자 초과면 statusCode 400을 던진다', async () => {
      await expect(updateCategory(1, 1, 'a'.repeat(21))).rejects.toMatchObject({ statusCode: 400 });
    });
  });

  describe('deleteCategory', () => {
    it('정상 삭제 시 에러 없이 완료된다', async () => {
      findCategoryById.mockResolvedValue({ id: 1, name: '업무', user_id: 1 });
      dbDeleteCategory.mockResolvedValue(true);
      await expect(deleteCategory(1, 1)).resolves.toBeUndefined();
    });

    it('카테고리가 없으면 statusCode 404를 던진다', async () => {
      findCategoryById.mockResolvedValue(null);
      await expect(deleteCategory(999, 1)).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
