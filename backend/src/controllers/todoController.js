import {
  listTodos as svcList,
  createTodo as svcCreate,
  updateTodo as svcUpdate,
  toggleComplete as svcToggle,
  deleteTodo as svcDelete,
} from '../services/todoService.js';
import { sendSuccess } from '../utils/responseUtils.js';
import { HTTP_STATUS } from '../constants/index.js';

export async function list(req, res, next) {
  try {
    const { status, categoryId } = req.query;
    const data = await svcList(req.user.id, { status, categoryId });
    sendSuccess(res, { todos: data });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const { title, description, categoryId, dueDate } = req.body;
    const data = await svcCreate(req.user.id, { title, description, categoryId, dueDate });
    sendSuccess(res, { todo: data }, HTTP_STATUS.CREATED);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const data = await svcUpdate(req.params.id, req.user.id, req.body);
    sendSuccess(res, { todo: data });
  } catch (err) {
    next(err);
  }
}

export async function toggleComplete(req, res, next) {
  try {
    const data = await svcToggle(req.params.id, req.user.id);
    sendSuccess(res, { todo: data });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await svcDelete(req.params.id, req.user.id);
    res.status(HTTP_STATUS.NO_CONTENT).end();
  } catch (err) {
    next(err);
  }
}
