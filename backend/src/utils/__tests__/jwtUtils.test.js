import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';

// 테스트 전 환경변수 설정
const ORIGINAL_ENV = process.env;

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV, JWT_SECRET: 'test-secret-key-for-jest-unit-testing-only' };
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
  jest.resetModules();
});

describe('jwtUtils', () => {
  let signToken, verifyToken;

  beforeEach(async () => {
    // 모듈 캐시를 초기화하고 재임포트
    jest.resetModules();
    const module = await import('../jwtUtils.js');
    signToken = module.signToken;
    verifyToken = module.verifyToken;
  });

  describe('signToken', () => {
    it('페이로드를 담은 JWT 토큰을 반환한다', () => {
      const payload = { userId: 1, email: 'test@example.com' };
      const token = signToken(payload);

      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('verifyToken으로 원본 페이로드를 복원할 수 있다', () => {
      const payload = { userId: 42, email: 'user@example.com' };
      const token = signToken(payload);
      const decoded = verifyToken(token);

      expect(decoded.userId).toBe(42);
      expect(decoded.email).toBe('user@example.com');
    });

    it('HS512 알고리즘을 사용한다', () => {
      const token = signToken({ userId: 1 });
      const header = jwt.decode(token, { complete: true }).header;

      expect(header.alg).toBe('HS512');
    });

    it('JWT_SECRET이 없으면 Error를 던진다', async () => {
      delete process.env.JWT_SECRET;
      jest.resetModules();
      const { signToken: signWithoutSecret } = await import('../jwtUtils.js');

      expect(() => signWithoutSecret({ userId: 1 })).toThrow('JWT_SECRET 환경변수가 설정되지 않았습니다.');
    });
  });

  describe('verifyToken', () => {
    it('유효한 토큰을 검증하고 페이로드를 반환한다', () => {
      const payload = { userId: 10 };
      const token = signToken(payload);
      const decoded = verifyToken(token);

      expect(decoded.userId).toBe(10);
    });

    it('잘못된 토큰이면 Error를 던진다', () => {
      expect(() => verifyToken('invalid.token.string')).toThrow();
    });

    it('만료된 토큰이면 Error를 던진다', async () => {
      // 1ms 만료 토큰 발급
      const secret = process.env.JWT_SECRET;
      const expiredToken = jwt.sign({ userId: 99 }, secret, {
        algorithm: 'HS512',
        expiresIn: '1ms',
      });

      // 1ms 이상 대기하여 토큰 만료
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(() => verifyToken(expiredToken)).toThrow();
    });

    it('JWT_SECRET이 없으면 Error를 던진다', async () => {
      const validToken = signToken({ userId: 1 });
      delete process.env.JWT_SECRET;
      jest.resetModules();
      const { verifyToken: verifyWithoutSecret } = await import('../jwtUtils.js');

      expect(() => verifyWithoutSecret(validToken)).toThrow('JWT_SECRET 환경변수가 설정되지 않았습니다.');
    });
  });
});
