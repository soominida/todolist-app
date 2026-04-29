import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';

// 테스트용 시크릿 (32자 이상)
const TEST_SECRET = 'test-secret-key-min-32-characters-long';
process.env.JWT_SECRET = TEST_SECRET;

// authMiddleware 동적 임포트 (환경변수 설정 후)
const { authMiddleware } = await import('../authMiddleware.js');

// 모킹 헬퍼
const mockReq = (authHeader) => ({
  headers: { authorization: authHeader },
});

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// 유효한 토큰 생성 헬퍼
const createToken = (payload = { id: 1 }, secret = TEST_SECRET, options = {}) =>
  jwt.sign(payload, secret, { algorithm: 'HS512', ...options });

describe('authMiddleware', () => {
  let mockNext;

  beforeEach(() => {
    mockNext = jest.fn();
  });

  test('Authorization 헤더 없음 → 401 + { success: false }', () => {
    const req = mockReq(undefined);
    const res = mockRes();

    authMiddleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('잘못된 헤더 형식 (Bearer 없음) → 401', () => {
    const token = createToken();
    const req = mockReq(`Token ${token}`);
    const res = mockRes();

    authMiddleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('유효한 토큰 → req.user.id 주입 + next() 호출', () => {
    const token = createToken({ id: 42 });
    const req = mockReq(`Bearer ${token}`);
    const res = mockRes();

    authMiddleware(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(req.user).toEqual({ id: 42 });
    expect(res.status).not.toHaveBeenCalled();
  });

  test('만료된 토큰 → 401', () => {
    const token = createToken({ id: 1 }, TEST_SECRET, { expiresIn: '0s' });
    const req = mockReq(`Bearer ${token}`);
    const res = mockRes();

    authMiddleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: '유효하지 않은 토큰입니다.',
      })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('잘못된 시크릿으로 서명된 토큰 → 401', () => {
    const token = createToken({ id: 1 }, 'wrong-secret-key-min-32-characters!!');
    const req = mockReq(`Bearer ${token}`);
    const res = mockRes();

    authMiddleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: '유효하지 않은 토큰입니다.',
      })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });
});
