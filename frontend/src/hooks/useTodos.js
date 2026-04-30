import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTodos, createTodo, updateTodo, deleteTodo, toggleTodoComplete } from '@/api/todosApi';

export function useTodos({ categoryId, status } = {}) {
  return useQuery({
    queryKey: ['todos', { categoryId, status }],
    queryFn: () => getTodos({ categoryId, status }),
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createTodo(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => updateTodo(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteTodo(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });
}

export function useToggleTodoComplete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => toggleTodoComplete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });
}
