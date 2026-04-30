import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import CategoryItem from './CategoryItem';

const mockUpdateMutate = vi.fn();

vi.mock('@/hooks/useCategories', () => ({
  useUpdateCategory: () => ({
    mutate: mockUpdateMutate,
    isPending: false,
  }),
}));

const mockCategory = { id: 1, name: '업무' };

function createWrapper() {
  const queryClient = new QueryClient();
  return function Wrapper({ children }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

function renderCategoryItem(onDelete = vi.fn()) {
  return render(
    <CategoryItem category={mockCategory} onDelete={onDelete} />,
    { wrapper: createWrapper() }
  );
}

describe('CategoryItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('카테고리 이름을 렌더링한다', () => {
    renderCategoryItem();
    expect(screen.getByText('업무')).toBeInTheDocument();
  });

  it('[수정] 클릭 시 인라인 편집 모드로 전환된다', async () => {
    renderCategoryItem();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: '수정' }));

    expect(screen.getByRole('button', { name: '저장' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '취소' })).toBeInTheDocument();
  });

  it('[삭제] 클릭 시 onDelete를 호출한다', async () => {
    const onDelete = vi.fn();
    renderCategoryItem(onDelete);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: '삭제' }));

    expect(onDelete).toHaveBeenCalledWith(mockCategory.id);
  });
});
