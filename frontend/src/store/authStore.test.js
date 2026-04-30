import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './authStore';

const mockUser = { id: 1, email: 'test@example.com', createdAt: '2026-04-29T00:00:00.000Z' };
const mockToken = 'eyJhbGciOiJIUzUxMiJ9.test';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
    localStorage.clear();
  });

  describe('초기 상태', () => {
    it('token이 null이다', () => {
      expect(useAuthStore.getState().token).toBeNull();
    });

    it('user가 null이다', () => {
      expect(useAuthStore.getState().user).toBeNull();
    });

    it('isAuthenticated가 false이다', () => {
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe('setAuth', () => {
    it('token과 user를 저장하고 isAuthenticated를 true로 설정한다', () => {
      useAuthStore.getState().setAuth({ token: mockToken, user: mockUser });
      const state = useAuthStore.getState();
      expect(state.token).toBe(mockToken);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('setAuth 호출 후 localStorage에 token이 저장된다', () => {
      useAuthStore.getState().setAuth({ token: mockToken, user: mockUser });
      const stored = JSON.parse(localStorage.getItem('auth-storage'));
      expect(stored.state.token).toBe(mockToken);
    });
  });

  describe('clearAuth', () => {
    it('clearAuth 호출 후 인증 정보가 초기화된다', () => {
      useAuthStore.getState().setAuth({ token: mockToken, user: mockUser });
      useAuthStore.getState().clearAuth();
      const state = useAuthStore.getState();
      expect(state.token).toBeNull();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('clearAuth 호출 후 localStorage에서 token이 제거된다', () => {
      useAuthStore.getState().setAuth({ token: mockToken, user: mockUser });
      useAuthStore.getState().clearAuth();
      const stored = JSON.parse(localStorage.getItem('auth-storage'));
      expect(stored.state.token).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('token이 있으면 isAuthenticated가 true이다', () => {
      useAuthStore.getState().setAuth({ token: mockToken, user: mockUser });
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    it('token이 없으면 isAuthenticated가 false이다', () => {
      useAuthStore.getState().clearAuth();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });
});
