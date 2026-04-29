import { register as svcRegister, login as svcLogin, getMe as svcGetMe } from '../services/authService.js';
import { sendSuccess } from '../utils/responseUtils.js';
import { HTTP_STATUS } from '../constants/index.js';

export async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    const data = await svcRegister(email, password);
    sendSuccess(res, data, HTTP_STATUS.CREATED);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const data = await svcLogin(email, password);
    sendSuccess(res, data, HTTP_STATUS.OK);
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    const data = await svcGetMe(req.user.id);
    sendSuccess(res, data, HTTP_STATUS.OK);
  } catch (err) {
    next(err);
  }
}

export function logout(_req, res) {
  sendSuccess(res, null, HTTP_STATUS.OK);
}
