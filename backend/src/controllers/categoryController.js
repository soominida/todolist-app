import {
  listCategories as svcList,
  createCategory as svcCreate,
  updateCategory as svcUpdate,
  deleteCategory as svcDelete,
} from '../services/categoryService.js';
import { sendSuccess } from '../utils/responseUtils.js';
import { HTTP_STATUS } from '../constants/index.js';

export async function list(req, res, next) {
  try {
    const data = await svcList(req.user.id);
    sendSuccess(res, { categories: data });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const data = await svcCreate(req.user.id, req.body.name);
    sendSuccess(res, { category: data }, HTTP_STATUS.CREATED);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const data = await svcUpdate(req.params.id, req.user.id, req.body.name);
    sendSuccess(res, { category: data });
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
