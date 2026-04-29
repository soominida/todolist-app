import { jest } from '@jest/globals';

jest.unstable_mockModule('../../db/queries/userQueries.js', () => ({
  findUserByEmail: jest.fn(),
  findUserById: jest.fn(),
  createUser: jest.fn(),
}));

jest.unstable_mockModule('bcrypt', () => ({
  default: {
    hash: jest.fn(),
    compare: jest.fn(),
  },
}));

jest.unstable_mockModule('../../utils/jwtUtils.js', () => ({
  signToken: jest.fn(),
  verifyToken: jest.fn(),
}));

// pool mock (authService 내부 findUserWithHash가 pool을 동적 import)
jest.unstable_mockModule('../../db/pool.js', () => ({
  default: {
    query: jest.fn(),
  },
}));

const { findUserByEmail, findUserById, createUser } = await import('../../db/queries/userQueries.js');
const bcrypt = (await import('bcrypt')).default;
const { signToken } = await import('../../utils/jwtUtils.js');
const pool = (await import('../../db/pool.js')).default;
const { register, login, getMe } = await import('../authService.js');

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('정상 가입 시 token과 user를 반환한다', async () => {
      findUserByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed_pw');
      createUser.mockResolvedValue({ id: 1, email: 'test@test.com', created_at: new Date() });
      signToken.mockReturnValue('jwt_token');

      const result = await register('test@test.com', 'password1');
      expect(result.token).toBe('jwt_token');
      expect(result.user.email).toBe('test@test.com');
    });

    it('이메일 형식이 잘못되면 statusCode 400을 던진다', async () => {
      await expect(register('invalid-email', 'password1')).rejects.toMatchObject({ statusCode: 400 });
    });

    it('비밀번호가 규칙에 맞지 않으면 statusCode 400을 던진다', async () => {
      await expect(register('test@test.com', 'short')).rejects.toMatchObject({ statusCode: 400 });
    });

    it('이미 존재하는 이메일이면 statusCode 409를 던진다', async () => {
      findUserByEmail.mockResolvedValue({ id: 1, email: 'test@test.com' });
      await expect(register('test@test.com', 'password1')).rejects.toMatchObject({ statusCode: 409 });
    });
  });

  describe('login', () => {
    it('정상 로그인 시 token과 user를 반환한다', async () => {
      const fakeUser = { id: 1, email: 'test@test.com', created_at: new Date() };
      findUserByEmail.mockResolvedValue(fakeUser);
      pool.query.mockResolvedValue({
        rows: [{ id: 1, email: 'test@test.com', password_hash: 'hashed', created_at: fakeUser.created_at }],
      });
      bcrypt.compare.mockResolvedValue(true);
      signToken.mockReturnValue('jwt_token');

      const result = await login('test@test.com', 'password1');
      expect(result.token).toBe('jwt_token');
      expect(result.user.email).toBe('test@test.com');
    });

    it('존재하지 않는 이메일이면 statusCode 401을 던진다', async () => {
      findUserByEmail.mockResolvedValue(null);
      await expect(login('no@test.com', 'password1')).rejects.toMatchObject({ statusCode: 401 });
    });

    it('비밀번호가 틀리면 statusCode 401을 던진다', async () => {
      const fakeUser = { id: 1, email: 'test@test.com', created_at: new Date() };
      findUserByEmail.mockResolvedValue(fakeUser);
      pool.query.mockResolvedValue({
        rows: [{ id: 1, email: 'test@test.com', password_hash: 'hashed', created_at: fakeUser.created_at }],
      });
      bcrypt.compare.mockResolvedValue(false);

      await expect(login('test@test.com', 'wrong_pw')).rejects.toMatchObject({ statusCode: 401 });
    });
  });

  describe('getMe', () => {
    it('유효한 userId로 user를 반환한다', async () => {
      findUserById.mockResolvedValue({ id: 1, email: 'test@test.com', created_at: new Date() });
      const result = await getMe(1);
      expect(result.user.email).toBe('test@test.com');
    });

    it('존재하지 않는 userId면 에러를 던진다', async () => {
      findUserById.mockResolvedValue(null);
      await expect(getMe(999)).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
