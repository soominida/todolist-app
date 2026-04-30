import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from './RegisterPage';

const mockMutate = vi.fn();

vi.mock('@/hooks/useAuth', () => ({
  useRegister: () => ({
    mutate: mockMutate,
    isPending: false,
    error: null,
  }),
}));

vi.mock('@/store/authStore', () => ({
  useAuthStore: (selector) =>
    selector({ isAuthenticated: false }),
}));

function renderRegisterPage() {
  return render(
    <MemoryRouter>
      <RegisterPage />
    </MemoryRouter>
  );
}

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('이메일, 비밀번호, 비밀번호 확인, 가입 버튼이 렌더링된다', () => {
    renderRegisterPage();
    expect(screen.getByLabelText('이메일')).toBeInTheDocument();
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
    expect(screen.getByLabelText('비밀번호 확인')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '가입' })).toBeInTheDocument();
  });

  it('비밀번호 8자 미만 입력 시 오류 메시지를 표시한다', async () => {
    renderRegisterPage();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('이메일'), 'test@example.com');
    await user.type(screen.getByLabelText('비밀번호'), 'abc12');
    await user.type(screen.getByLabelText('비밀번호 확인'), 'abc12');
    await user.click(screen.getByRole('button', { name: '가입' }));

    expect(await screen.findByText('영문+숫자 조합 8자 이상으로 입력해 주세요.')).toBeInTheDocument();
  });

  it('영문/숫자 미혼합 비밀번호 입력 시 오류 메시지를 표시한다', async () => {
    renderRegisterPage();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('이메일'), 'test@example.com');
    await user.type(screen.getByLabelText('비밀번호'), 'abcdefgh');
    await user.type(screen.getByLabelText('비밀번호 확인'), 'abcdefgh');
    await user.click(screen.getByRole('button', { name: '가입' }));

    expect(await screen.findByText('영문+숫자 조합 8자 이상으로 입력해 주세요.')).toBeInTheDocument();
  });

  it('비밀번호 불일치 시 오류 메시지를 표시한다', async () => {
    renderRegisterPage();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('이메일'), 'test@example.com');
    await user.type(screen.getByLabelText('비밀번호'), 'password123');
    await user.type(screen.getByLabelText('비밀번호 확인'), 'different123');
    await user.click(screen.getByRole('button', { name: '가입' }));

    expect(await screen.findByText('비밀번호가 일치하지 않습니다.')).toBeInTheDocument();
  });

  it('/login 링크가 존재한다', () => {
    renderRegisterPage();
    const link = screen.getByRole('link', { name: '로그인' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/login');
  });
});
