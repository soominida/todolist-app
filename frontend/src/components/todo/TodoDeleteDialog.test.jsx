import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import TodoDeleteDialog from './TodoDeleteDialog';

const mockMutate = vi.fn();
let mockIsPending = false;

vi.mock('@/hooks/useTodos', () => ({
  useDeleteTodo: () => ({ mutate: mockMutate, isPending: mockIsPending }),
}));

const mockOnClose = vi.fn();
const todo = { id: 1, title: '테스트 할일' };

beforeEach(() => {
  vi.clearAllMocks();
  mockIsPending = false;
});

describe('TodoDeleteDialog', () => {
  it('다이얼로그 렌더링 - 메시지 표시', () => {
    render(<TodoDeleteDialog isOpen={true} onClose={mockOnClose} todo={todo} />);
    expect(
      screen.getByText('이 할일을 영구 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')
    ).toBeInTheDocument();
  });

  it('취소 버튼 클릭 시 onClose 호출', async () => {
    render(<TodoDeleteDialog isOpen={true} onClose={mockOnClose} todo={todo} />);
    await userEvent.click(screen.getByText('취소'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('삭제 버튼 클릭 시 deleteTodo.mutate 호출', async () => {
    render(<TodoDeleteDialog isOpen={true} onClose={mockOnClose} todo={todo} />);
    await userEvent.click(screen.getByText('삭제'));
    expect(mockMutate).toHaveBeenCalledWith(todo.id, expect.any(Object));
  });

  it('isPending 중 삭제 버튼 비활성화', () => {
    mockIsPending = true;
    render(<TodoDeleteDialog isOpen={true} onClose={mockOnClose} todo={todo} />);
    expect(screen.getByText('...')).toBeDisabled();
  });

  it('닫혀있으면 렌더링 안 함', () => {
    render(<TodoDeleteDialog isOpen={false} onClose={mockOnClose} todo={todo} />);
    expect(screen.queryByText('삭제 확인')).not.toBeInTheDocument();
  });
});
