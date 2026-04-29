import jwt from 'jsonwebtoken';

/**
 * JWT 토큰 서명
 * @param {object} payload - 토큰에 담을 페이로드
 * @returns {string} 서명된 JWT 토큰 (24시간 만료)
 */
export function signToken(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET 환경변수가 설정되지 않았습니다.');
  }
  return jwt.sign(payload, secret, { algorithm: 'HS512', expiresIn: '24h' });
}

/**
 * JWT 토큰 검증
 * @param {string} token - 검증할 JWT 토큰
 * @returns {object} 디코딩된 페이로드
 * @throws {Error} 유효하지 않거나 만료된 토큰인 경우
 */
export function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET 환경변수가 설정되지 않았습니다.');
  }
  return jwt.verify(token, secret, { algorithms: ['HS512'] });
}
