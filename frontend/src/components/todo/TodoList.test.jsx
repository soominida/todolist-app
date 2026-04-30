import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import TodoList from './TodoList';

vi.mock('@/hooks/useTodos', () => ({
  useToggleTodoComplete: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock('@/utils/dateUtils', () => ({
  formatDate: (d) => d,
}));

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
  {
    id: 2,
    title: '두 번째 할일',
    description: '',
    categoryId: 1,
    dueDate: null,
    isCompleted: false,
    status: 'overdue',
  },
];

const noop = vi.fn();

describe('TodoList', () => {
  it('로딩 상태 텍스트 표시', () => {
    render(<TodoList isLoading={true} isError={false} todos={[]} categories={[]} onEdit={noop} onDelete={noop} />);
    expect(screen.getByText('로딩 중...')).toBeInTheDocument();
  });

  it('에러 상태 텍스트 표시', () => {
    render(<TodoList isLoading={false} isError={true} todos={[]} categories={[]} onEdit={noop} onDelete={noop} />);
    expect(screen.getByText('할일을 불러오는 데 실패했습니다.')).toBeInTheDocument();
  });

  it('빈 배열 시 EmptyState 표시', () => {
    render(<TodoList isLoading={false} isError={false} todos={[]} categories={[]} onEdit={noop} onDelete={noop} />);
    expect(screen.getByText('할일이 없습니다.')).toBeInTheDocument();
  });

  it('todos 있을 때 TodoItem 렌더링', () => {
    const categories = [{ id: 1, name: '업무' }];
    render(
      <TodoList
        isLoading={false}
        isError={false}
        todos={mockTodos}
        categories={categories}
        onEdit={noop}
        onDelete={noop}
      />
    );
    expect(screen.getByText('첫 번째 할일')).toBeInTheDocument();
    expect(screen.getByText('두 번째 할일')).toBeInTheDocument();
  });

  it('카테고리 이름 매핑이 올바르게 동작', () => {
    const categories = [{ id: 1, name: '업무' }];
    render(
      <TodoList
        isLoading={false}
        isError={false}
        todos={[mockTodos[1]]}
        categories={categories}
        onEdit={noop}
        onDelete={noop}
      />
    );
    expect(screen.getByText(/업무/)).toBeInTheDocument();
  });
});
