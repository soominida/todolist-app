import { describe, it, expect, vi, beforeEach } from 'vitest';
import { register, login, getMe } from './authApi';
import { httpClient } from '@/lib/httpClient';

vi.mock('@/lib/httpClient', () => ({
  httpClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

const mockUser = { id: 1, email: 'test@example.com', createdAt: '2026-04-29T00:00:00.000Z' };
const mockToken = 'eyJhbGciOiJIUzUxMiJ9.test';

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('성공 시 token과 user를 반환한다', async () => {
      httpClient.post.mockResolvedValue({ data: { token: mockToken, user: mockUser } });
      const result = await register('test@example.com', 'password123');
      expect(result).toEqual({ token: mockToken, user: mockUser });
      expect(httpClient.post).toHaveBeenCalledWith('/auth/register', {
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('중복 이메일 시 Error를 throw한다', async () => {
      const err = new Error('이미 사용 중인 이메일입니다.');
      err.status = 409;
      httpClient.post.mockRejectedValue(err);
      await expect(register('dup@example.com', 'password123')).rejects.toThrow('이미 사용 중인 이메일입니다.');
    });

    it('입력값 오류 시 Error를 throw한다', async () => {
      const err = new Error('비밀번호는 8자 이상이며 영문과 숫자를 혼합해야 합니다.');
      err.status = 400;
      httpClient.post.mockRejectedValue(err);
      await expect(register('test@example.com', 'short')).rejects.toThrow();
    });
  });

  describe('login', () => {
    it('성공 시 token과 user를 반환한다', async () => {
      httpClient.post.mockResolvedValue({ data: { token: mockToken, user: mockUser } });
      const result = await login('test@example.com', 'password123');
      expect(result).toEqual({ token: mockToken, user: mockUser });
      expect(httpClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('잘못된 자격증명 시 Error를 throw한다', async () => {
      const err = new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      err.status = 401;
      httpClient.post.mockRejectedValue(err);
      await expect(login('test@example.com', 'wrong')).rejects.toThrow('이메일 또는 비밀번호가 올바르지 않습니다.');
    });
  });

  describe('getMe', () => {
    it('성공 시 user 정보를 반환한다', async () => {
      httpClient.get.mockResolvedValue({ data: { user: mockUser } });
      const result = await getMe();
      expect(result).toEqual({ user: mockUser });
      expect(httpClient.get).toHaveBeenCalledWith('/auth/me');
    });

    it('GET /auth/me 요청 시 httpClient.get을 호출한다 (토큰 주입은 httpClient 담당)', async () => {
      httpClient.get.mockResolvedValue({ data: { user: mockUser } });
      await getMe();
      expect(httpClient.get).toHaveBeenCalledTimes(1);
    });

    it('인증 실패 시 Error를 throw한다', async () => {
      const err = new Error('인증이 필요합니다.');
      err.status = 401;
      httpClient.get.mockRejectedValue(err);
      await expect(getMe()).rejects.toThrow();
    });
  });
});
