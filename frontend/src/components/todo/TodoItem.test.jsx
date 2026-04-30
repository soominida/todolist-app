import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import TodoItem from './TodoItem';

const mockMutate = vi.fn();

vi.mock('@/hooks/useTodos', () => ({
  useToggleTodoComplete: () => ({ mutate: mockMutate, isPending: false }),
}));

vi.mock('@/utils/dateUtils', () => ({
  formatDate: (d) => `날짜:${d}`,
}));

const baseTodo = {
  id: 1,
  title: '테스트 할일',
  description: '',
  categoryId: null,
  categoryName: undefined,
  dueDate: null,
  isCompleted: false,
  status: 'pending',
};

const mockOnEdit = vi.fn();
const mockOnDelete = vi.fn();

function renderItem(todo) {
  return render(<TodoItem todo={todo} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('TodoItem', () => {
  it('pending 상태: 파란 accent bar, 파란 배지, 취소선 없음', () => {
    renderItem({ ...baseTodo, status: 'pending' });
    const card = screen.getByText('테스트 할일').closest('[style]');
    expect(screen.getByText('미완료')).toBeInTheDocument();
    expect(screen.getByText('테스트 할일')).not.toHaveStyle({ textDecoration: 'line-through' });
  });

  it('completed 상태: 녹색 배지, 취소선 있음', () => {
    renderItem({ ...baseTodo, status: 'completed', isCompleted: true });
    expect(screen.getByText('완료')).toBeInTheDocument();
    expect(screen.getByText('테스트 할일')).toHaveStyle({ textDecoration: 'line-through' });
  });

  it('overdue 상태: 빨간 배지', () => {
    renderItem({ ...baseTodo, status: 'overdue' });
    expect(screen.getByText('기한초과')).toBeInTheDocument();
  });

  it('체크박스 클릭 시 useToggleTodoComplete mutate 호출', async () => {
    renderItem(baseTodo);
    const checkbox = screen.getByRole('button', { name: '완료 처리' });
    await userEvent.click(checkbox);
    expect(mockMutate).toHaveBeenCalledWith(baseTodo.id);
  });

  it('완료 상태 체크박스 aria-label "완료 취소"', () => {
    renderItem({ ...baseTodo, status: 'completed', isCompleted: true });
    expect(screen.getByRole('button', { name: '완료 취소' })).toBeInTheDocument();
  });

  it('수정 버튼 클릭 시 onEdit 호출', async () => {
    renderItem(baseTodo);
    await userEvent.click(screen.getByRole('button', { name: '수정' }));
    expect(mockOnEdit).toHaveBeenCalledWith(baseTodo);
  });

  it('삭제 버튼 클릭 시 onDelete 호출', async () => {
    renderItem(baseTodo);
    await userEvent.click(screen.getByRole('button', { name: '삭제' }));
    expect(mockOnDelete).toHaveBeenCalledWith(baseTodo);
  });

  it('dueDate 있을 때 날짜 표시', () => {
    renderItem({ ...baseTodo, dueDate: '2025-12-31T00:00:00Z' });
    expect(screen.getByText(/날짜:2025-12-31/)).toBeInTheDocument();
  });

  it('dueDate 없을 때 "종료일 없음" 표시', () => {
    renderItem({ ...baseTodo, dueDate: null });
    expect(screen.getByText(/종료일 없음/)).toBeInTheDocument();
  });

  it('categoryName 없으면 미분류 표시', () => {
    renderItem({ ...baseTodo, categoryName: undefined });
    expect(screen.getByText(/미분류/)).toBeInTheDocument();
  });

  it('categoryName 있으면 카테고리 이름 표시', () => {
    renderItem({ ...baseTodo, categoryName: '업무' });
    expect(screen.getByText(/업무/)).toBeInTheDocument();
  });
});
