import {
  findTodosByUserId,
  findTodoById as dbFindTodoById,
  createTodo as dbCreateTodo,
  updateTodo as dbUpdateTodo,
  deleteTodo as dbDeleteTodo,
  toggleComplete as dbToggleComplete,
} from '../db/queries/todoQueries.js';
import { findCategoryById } from '../db/queries/categoryQueries.js';
import { MAX_TITLE_LENGTH, MAX_DESC_LENGTH } from '../constants/index.js';

function toCamel(todo) {
  return {
    id: todo.id,
    userId: todo.user_id,
    categoryId: todo.category_id,
    title: todo.title,
    description: todo.description,
    dueDate: todo.due_date,
    isCompleted: todo.is_completed,
    status: todo.status,
    createdAt: todo.created_at,
    updatedAt: todo.updated_at,
  };
}

function calcStatus(todo) {
  if (todo.is_completed) return 'completed';
  if (todo.due_date && new Date(todo.due_date) < new Date()) return 'overdue';
  return 'pending';
}

function withStatus(todo) {
  return toCamel({ ...todo, status: calcStatus(todo) });
}

export async function listTodos(userId, filters = {}) {
  const todos = await findTodosByUserId(userId, filters);
  return todos.map(withStatus);
}

export async function createTodo(userId, { title, description, categoryId, dueDate }) {
  if (!title || title.trim().length === 0) {
    const err = new Error('제목은 필수입니다.');
    err.statusCode = 400;
    throw err;
  }
  if (title.length > MAX_TITLE_LENGTH) {
    const err = new Error(`제목은 ${MAX_TITLE_LENGTH}자 이하여야 합니다.`);
    err.statusCode = 400;
    throw err;
  }
  if (description && description.length > MAX_DESC_LENGTH) {
    const err = new Error(`설명은 ${MAX_DESC_LENGTH}자 이하여야 합니다.`);
    err.statusCode = 400;
    throw err;
  }
  if (categoryId !== undefined && categoryId !== null) {
    const category = await findCategoryById(categoryId, userId);
    if (!category) {
      const err = new Error('존재하지 않거나 접근할 수 없는 카테고리입니다.');
      err.statusCode = 400;
      throw err;
    }
  }
  const todo = await dbCreateTodo(userId, { title, description, categoryId, dueDate });
  return withStatus(todo);
}

export async function updateTodo(todoId, userId, fields) {
  const existing = await dbFindTodoById(todoId, userId);
  if (!existing) {
    const err = new Error('할일을 찾을 수 없습니다.');
    err.statusCode = 404;
    throw err;
  }

  if (fields.title !== undefined) {
    if (!fields.title || fields.title.trim().length === 0) {
      const err = new Error('제목은 필수입니다.');
      err.statusCode = 400;
      throw err;
    }
    if (fields.title.length > MAX_TITLE_LENGTH) {
      const err = new Error(`제목은 ${MAX_TITLE_LENGTH}자 이하여야 합니다.`);
      err.statusCode = 400;
      throw err;
    }
  }

  if (fields.categoryId !== undefined && fields.categoryId !== null) {
    const category = await findCategoryById(fields.categoryId, userId);
    if (!category) {
      const err = new Error('존재하지 않거나 접근할 수 없는 카테고리입니다.');
      err.statusCode = 400;
      throw err;
    }
  }

  // camelCase → snake_case 변환
  const dbFields = {};
  if (fields.title !== undefined) dbFields.title = fields.title;
  if (fields.description !== undefined) dbFields.description = fields.description;
  if (fields.categoryId !== undefined) dbFields.category_id = fields.categoryId;
  if (fields.dueDate !== undefined) dbFields.due_date = fields.dueDate;
  if (fields.isCompleted !== undefined) dbFields.is_completed = fields.isCompleted;

  const todo = await dbUpdateTodo(todoId, userId, dbFields);
  return withStatus(todo);
}

export async function toggleComplete(todoId, userId) {
  const existing = await dbFindTodoById(todoId, userId);
  if (!existing) {
    const err = new Error('할일을 찾을 수 없습니다.');
    err.statusCode = 404;
    throw err;
  }
  const todo = await dbToggleComplete(todoId, userId);
  return withStatus(todo);
}

export async function deleteTodo(todoId, userId) {
  const existing = await dbFindTodoById(todoId, userId);
  if (!existing) {
    const err = new Error('할일을 찾을 수 없습니다.');
    err.statusCode = 404;
    throw err;
  }
  await dbDeleteTodo(todoId, userId);
}
