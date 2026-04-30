import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import TodoForm from './TodoForm';

const mockMutate = vi.fn();

vi.mock('@/hooks/useTodos', () => ({
  useCreateTodo: () => ({ mutate: mockMutate, isPending: false }),
  useUpdateTodo: () => ({ mutate: mockMutate, isPending: false }),
}));

vi.mock('@/hooks/useCategories', () => ({
  useCategories: () => ({ data: [{ id: 1, name: '업무' }] }),
  useCreateCategory: () => ({ mutate: mockMutate, isPending: false }),
}));

const mockOnClose = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

describe('TodoForm', () => {
  it('생성 모드: 빈 폼으로 렌더링, 타이틀 "할일 추가"', () => {
    render(<TodoForm isOpen={true} onClose={mockOnClose} initialValues={null} />);
    expect(screen.getByText('할일 추가')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('제목을 입력하세요')).toHaveValue('');
  });

  it('수정 모드: initialValues로 폼 채워짐, 타이틀 "할일 수정"', () => {
    const todo = {
      id: 1,
      title: '기존 제목',
      description: '기존 설명',
      categoryId: 1,
      dueDate: null,
    };
    render(<TodoForm isOpen={true} onClose={mockOnClose} initialValues={todo} />);
    expect(screen.getByText('할일 수정')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('제목을 입력하세요')).toHaveValue('기존 제목');
  });

  it('제목 미입력 제출 시 오류 메시지 표시', async () => {
    render(<TodoForm isOpen={true} onClose={mockOnClose} initialValues={null} />);
    await userEvent.click(screen.getByText('저장'));
    expect(await screen.findByText('제목은 필수 항목입니다')).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('제목 100자 초과 시 오류 메시지 표시', async () => {
    render(<TodoForm isOpen={true} onClose={mockOnClose} initialValues={null} />);
    const input = screen.getByPlaceholderText('제목을 입력하세요');
    await userEvent.type(input, 'a'.repeat(101));
    await userEvent.click(screen.getByText('저장'));
    expect(await screen.findByText('제목은 최대 100자입니다')).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('정상 제출 시 mutate 호출', async () => {
    mockMutate.mockImplementation((_payload, { onSuccess } = {}) => {
      onSuccess?.();
    });
    render(<TodoForm isOpen={true} onClose={mockOnClose} initialValues={null} />);
    await userEvent.type(screen.getByPlaceholderText('제목을 입력하세요'), '새 할일');
    await userEvent.click(screen.getByText('저장'));
    await waitFor(() => expect(mockMutate).toHaveBeenCalled());
  });

  it('정상 제출 성공 시 onClose 호출', async () => {
    mockMutate.mockImplementation((_payload, { onSuccess } = {}) => {
      onSuccess?.();
    });
    render(<TodoForm isOpen={true} onClose={mockOnClose} initialValues={null} />);
    await userEvent.type(screen.getByPlaceholderText('제목을 입력하세요'), '새 할일');
    await userEvent.click(screen.getByText('저장'));
    await waitFor(() => expect(mockOnClose).toHaveBeenCalled());
  });

  it('카테고리 드롭다운에 카테고리 목록 표시', () => {
    render(<TodoForm isOpen={true} onClose={mockOnClose} initialValues={null} />);
    expect(screen.getByText('업무')).toBeInTheDocument();
  });

  it('닫혀있으면 렌더링 안 함', () => {
    render(<TodoForm isOpen={false} onClose={mockOnClose} initialValues={null} />);
    expect(screen.queryByText('할일 추가')).not.toBeInTheDocument();
  });
});
