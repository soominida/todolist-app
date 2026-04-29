import {
  findCategoriesByUserId,
  findCategoryById,
  createCategory as dbCreateCategory,
  updateCategory as dbUpdateCategory,
  deleteCategory as dbDeleteCategory,
} from '../db/queries/categoryQueries.js';
import { MAX_CATEGORY_NAME_LENGTH } from '../constants/index.js';

function toCamel(row) {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    createdAt: row.created_at,
  };
}

function validateName(name) {
  if (!name || name.length < 1 || name.length > MAX_CATEGORY_NAME_LENGTH) {
    const err = new Error(
      `카테고리 이름은 1자 이상 ${MAX_CATEGORY_NAME_LENGTH}자 이하여야 합니다.`
    );
    err.statusCode = 400;
    throw err;
  }
}

export async function listCategories(userId) {
  const rows = await findCategoriesByUserId(userId);
  return rows.map(toCamel);
}

export async function createCategory(userId, name) {
  validateName(name);
  try {
    const row = await dbCreateCategory(userId, name);
    return toCamel(row);
  } catch (err) {
    if (err.code === '23505') {
      const conflict = new Error('이미 존재하는 카테고리 이름입니다.');
      conflict.statusCode = 409;
      throw conflict;
    }
    throw err;
  }
}

export async function updateCategory(categoryId, userId, name) {
  validateName(name);
  const existing = await findCategoryById(categoryId, userId);
  if (!existing) {
    const err = new Error('카테고리를 찾을 수 없습니다.');
    err.statusCode = 404;
    throw err;
  }
  try {
    const row = await dbUpdateCategory(categoryId, userId, name);
    return toCamel(row);
  } catch (err) {
    if (err.code === '23505') {
      const conflict = new Error('이미 존재하는 카테고리 이름입니다.');
      conflict.statusCode = 409;
      throw conflict;
    }
    throw err;
  }
}

export async function deleteCategory(categoryId, userId) {
  const existing = await findCategoryById(categoryId, userId);
  if (!existing) {
    const err = new Error('카테고리를 찾을 수 없습니다.');
    err.statusCode = 404;
    throw err;
  }
  await dbDeleteCategory(categoryId, userId);
}
