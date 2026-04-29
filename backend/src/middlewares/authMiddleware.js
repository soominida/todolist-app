import { verifyToken } from '../utils/jwtUtils.js';
import { sendError } from '../utils/responseUtils.js';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * JWT 인증 미들웨어
 * Authorization: Bearer <token> 헤더를 검증하고 req.user 를 주입합니다.
 */
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, '인증이 필요합니다.', HTTP_STATUS.UNAUTHORIZED);
  }

  const token = authHeader.slice(7); // 'Bearer ' 이후 토큰 추출

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.id };
    next();
  } catch {
    sendError(res, '유효하지 않은 토큰입니다.', HTTP_STATUS.UNAUTHORIZED);
  }
}
