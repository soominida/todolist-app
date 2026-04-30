import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login, register } from '@/api/authApi';
import { useAuthStore } from '@/store/authStore';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({ email, password }) => login(email, password),
    onSuccess: (data) => {
      setAuth({ token: data.token, user: data.user });
      navigate('/');
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: ({ email, password }) => register(email, password),
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return () => {
    clearAuth();
    queryClient.clear();
    navigate('/login');
  };
}
