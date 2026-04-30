import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

const mockLogout = vi.fn();

vi.mock('@/store/authStore', () => ({
  useAuthStore: (selector) =>
    selector({ user: { email: 'test@test.com' }, clearAuth: vi.fn() }),
}));

vi.mock('@/hooks/useAuth', () => ({
  useLogout: () => mockLogout,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Header', () => {
  it('사용자 이메일 표시', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByText('test@test.com')).toBeInTheDocument();
  });

  it('"카테고리 관리" 링크 존재', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByText('카테고리 관리')).toBeInTheDocument();
  });

  it('"로그아웃" 버튼 클릭 시 logout 함수 호출', async () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    await userEvent.click(screen.getByText('로그아웃'));
    expect(mockLogout).toHaveBeenCalled();
  });

  it('앱 타이틀 "할일 관리" 표시', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByText('할일 관리')).toBeInTheDocument();
  });
});
