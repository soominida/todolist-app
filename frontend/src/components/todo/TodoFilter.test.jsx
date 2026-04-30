import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import TodoFilter from './TodoFilter';

const mockCategories = [
  { id: 1, name: '업무' },
  { id: 2, name: '개인' },
];

function renderFilter(initialEntries = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="*" element={<TodoFilter categories={mockCategories} />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('TodoFilter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('카테고리 드롭다운과 정렬 드롭다운과 상태 탭 4개를 렌더링한다', () => {
    renderFilter();

    const combos = screen.getAllByRole('combobox');
    expect(combos).toHaveLength(2);
    expect(screen.getByRole('button', { name: '전체' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '미완료' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '완료' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '기한초과' })).toBeInTheDocument();
  });

  it('카테고리 옵션이 올바르게 렌더링된다', () => {
    renderFilter();

    expect(screen.getByRole('option', { name: '전체 카테고리' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '업무' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '개인' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '미분류' })).toBeInTheDocument();
  });

  it('카테고리 선택 시 URL 파라미터가 변경된다', async () => {
    const user = userEvent.setup();
    let currentSearch = '';

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="*"
            element={
              <>
                <TodoFilter categories={mockCategories} />
                <SearchCapture onSearch={s => { currentSearch = s; }} />
              </>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    const [categorySelect] = screen.getAllByRole('combobox');
    await user.selectOptions(categorySelect, '1');
    expect(currentSearch).toContain('categoryId=1');
  });

  it('상태 탭 클릭 시 URL 파라미터가 변경된다', async () => {
    const user = userEvent.setup();
    let currentSearch = '';

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="*"
            element={
              <>
                <TodoFilter categories={mockCategories} />
                <SearchCapture onSearch={s => { currentSearch = s; }} />
              </>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: '미완료' }));
    expect(currentSearch).toContain('status=pending');
  });

  it('전체 탭 클릭 시 status 파라미터를 제거한다', async () => {
    const user = userEvent.setup();
    let currentSearch = '';

    render(
      <MemoryRouter initialEntries={['/?status=pending']}>
        <Routes>
          <Route
            path="*"
            element={
              <>
                <TodoFilter categories={mockCategories} />
                <SearchCapture onSearch={s => { currentSearch = s; }} />
              </>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: '전체' }));
    expect(currentSearch).not.toContain('status=');
  });

  it('카테고리를 전체로 변경 시 categoryId 파라미터를 제거한다', async () => {
    const user = userEvent.setup();
    let currentSearch = '';

    render(
      <MemoryRouter initialEntries={['/?categoryId=1']}>
        <Routes>
          <Route
            path="*"
            element={
              <>
                <TodoFilter categories={mockCategories} />
                <SearchCapture onSearch={s => { currentSearch = s; }} />
              </>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    const [categorySelect] = screen.getAllByRole('combobox');
    await user.selectOptions(categorySelect, '');
    expect(currentSearch).not.toContain('categoryId=');
  });

  it('선택된 상태 탭이 파란색 강조 스타일을 가진다', () => {
    render(
      <MemoryRouter initialEntries={['/?status=pending']}>
        <Routes>
          <Route path="*" element={<TodoFilter categories={mockCategories} />} />
        </Routes>
      </MemoryRouter>
    );

    const pendingBtn = screen.getByRole('button', { name: '미완료' });
    expect(pendingBtn.style.backgroundColor).toBe('var(--color-primary)');
  });

  it('미선택 탭은 기본 스타일을 가진다', () => {
    renderFilter();

    const pendingBtn = screen.getByRole('button', { name: '미완료' });
    expect(pendingBtn.style.backgroundColor).toBe('transparent');
  });

  it('정렬 옵션 4개가 렌더링된다', () => {
    renderFilter();

    expect(screen.getByRole('option', { name: '등록일 최신순' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '등록일 오래된순' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '종료일 빠른순' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '종료일 늦은순' })).toBeInTheDocument();
  });

  it('정렬 변경 시 URL 파라미터가 변경된다', async () => {
    const user = userEvent.setup();
    let currentSearch = '';

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="*"
            element={
              <>
                <TodoFilter categories={mockCategories} />
                <SearchCapture onSearch={s => { currentSearch = s; }} />
              </>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    const [, sortSelect] = screen.getAllByRole('combobox');
    await user.selectOptions(sortSelect, 'dueDate:asc');
    expect(currentSearch).toContain('sortBy=dueDate');
    expect(currentSearch).toContain('sortOrder=asc');
  });
});

function SearchCapture({ onSearch }) {
  const { useSearchParams } = require('react-router-dom');
  const [searchParams] = useSearchParams();
  onSearch(searchParams.toString());
  return null;
}
