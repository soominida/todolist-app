import { sendError } from '../utils/responseUtils.js';

/**
 * 전역 에러 핸들러 미들웨어
 * Express 4인수 에러 핸들러: (err, req, res, next)
 */
// eslint-disable-next-line no-unused-vars
export function errorMiddleware(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || '서버 오류가 발생했습니다.';

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    console.error(err.stack);
  }

  sendError(res, message, statusCode);
}
