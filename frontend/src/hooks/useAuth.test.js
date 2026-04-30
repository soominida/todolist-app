import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { createElement } from 'react';
import { useLogin, useRegister, useLogout } from './useAuth';
import { useAuthStore } from '@/store/authStore';

vi.mock('@/api/authApi', () => ({
  login: vi.fn(),
  register: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { login as loginApi, register as registerApi } from '@/api/authApi';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }) {
    return createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(MemoryRouter, null, children)
    );
  };
}

const mockToken = 'test-token';
const mockUser = { id: 1, email: 'test@example.com' };

describe('useLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
  });

  it('성공 시 setAuth를 호출하고 "/"로 이동한다', async () => {
    loginApi.mockResolvedValue({ token: mockToken, user: mockUser });

    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate({ email: 'test@example.com', password: 'password' });
    });

    expect(useAuthStore.getState().token).toBe(mockToken);
    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('실패 시 error를 반환한다', async () => {
    const err = new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    loginApi.mockRejectedValue(err);

    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

    act(() => {
      result.current.mutate({ email: 'test@example.com', password: 'wrong' });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe('이메일 또는 비밀번호가 올바르지 않습니다.');
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

describe('useRegister', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('성공 시 isSuccess가 true가 된다', async () => {
    registerApi.mockResolvedValue({});

    const { result } = renderHook(() => useRegister(), { wrapper: createWrapper() });

    act(() => {
      result.current.mutate({ email: 'new@example.com', password: 'password' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

describe('useLogout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ token: mockToken, user: mockUser, isAuthenticated: true });
  });

  it('clearAuth, queryClient.clear, "/login" 이동을 수행한다', () => {
    const queryClient = new QueryClient();
    const clearSpy = vi.spyOn(queryClient, 'clear');

    function Wrapper({ children }) {
      return createElement(
        QueryClientProvider,
        { client: queryClient },
        createElement(MemoryRouter, null, children)
      );
    }

    const { result } = renderHook(() => useLogout(), { wrapper: Wrapper });

    act(() => {
      result.current();
    });

    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(clearSpy).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
