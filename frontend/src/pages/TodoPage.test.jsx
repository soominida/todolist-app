import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import TodoPage from './TodoPage';

const mockTodos = [
  {
    id: 1,
    title: '첫 번째 할일',
    description: '',
    categoryId: null,
    dueDate: null,
    isCompleted: false,
    status: 'pending',
  },
];

vi.mock('@/hooks/useTodos', () => ({
  useTodos: () => ({ data: mockTodos, isLoading: false, isError: false }),
  useToggleTodoComplete: () => ({ mutate: vi.fn(), isPending: false }),
  useCreateTodo: () => ({ mutate: vi.fn(), isPending: false }),
  useUpdateTodo: () => ({ mutate: vi.fn(), isPending: false }),
  useDeleteTodo: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock('@/hooks/useCategories', () => ({
  useCategories: () => ({ data: [] }),
  useCreateCategory: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock('@/hooks/useAuth', () => ({
  useLogout: () => vi.fn(),
}));

vi.mock('@/store/authStore', () => ({
  useAuthStore: (selector) =>
    selector({ user: { email: 'test@test.com' }, isAuthenticated: true, clearAuth: vi.fn() }),
}));

vi.mock('@/utils/dateUtils', () => ({
  formatDate: (d) => d,
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <TodoPage />
    </MemoryRouter>
  );
}

describe('TodoPage', () => {
  it('할일 목록 렌더링', () => {
    renderPage();
    expect(screen.getByText('첫 번째 할일')).toBeInTheDocument();
  });

  it('"할일 추가" 버튼 클릭 시 TodoForm 모달 열림', async () => {
    renderPage();
    await userEvent.click(screen.getByText('+ 할일 추가'));
    expect(screen.getByText('할일 추가')).toBeInTheDocument();
  });

  it('헤더 이메일 표시', () => {
    renderPage();
    expect(screen.getByText('test@test.com')).toBeInTheDocument();
  });

  it('"할일 관리" 타이틀 표시', () => {
    renderPage();
    expect(screen.getByText('할일 관리')).toBeInTheDocument();
  });
});
