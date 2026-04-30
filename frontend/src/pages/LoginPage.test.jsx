import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

const mockMutate = vi.fn();
const mockIsPending = { current: false };

vi.mock('@/hooks/useAuth', () => ({
  useLogin: () => ({
    mutate: mockMutate,
    isPending: mockIsPending.current,
    error: null,
  }),
}));

function renderLoginPage() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsPending.current = false;
  });

  it('이메일과 비밀번호 필드가 렌더링된다', () => {
    renderLoginPage();
    expect(screen.getByLabelText('이메일')).toBeInTheDocument();
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
  });

  it('잘못된 이메일 형식 입력 시 에러 메시지를 표시한다', async () => {
    renderLoginPage();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('이메일'), 'invalid-email');
    await user.type(screen.getByLabelText('비밀번호'), 'password');
    await user.click(screen.getByRole('button', { name: '로그인' }));

    expect(await screen.findByText('올바른 이메일 형식을 입력해 주세요.')).toBeInTheDocument();
  });

  it('유효한 폼 제출 시 useLogin mutate를 호출한다', async () => {
    renderLoginPage();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('이메일'), 'test@example.com');
    await user.type(screen.getByLabelText('비밀번호'), 'password');
    await user.click(screen.getByRole('button', { name: '로그인' }));

    expect(mockMutate).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
  });

  it('/register 링크가 표시된다', () => {
    renderLoginPage();
    const link = screen.getByRole('link', { name: '회원가입' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/register');
  });
});
