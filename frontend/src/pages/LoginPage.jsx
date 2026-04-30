import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLogin } from '@/hooks/useAuth';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import FormError from '@/components/common/FormError';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const login = useLogin();

  function validate() {
    const errors = {};
    if (!EMAIL_REGEX.test(email)) {
      errors.email = t('auth.emailError');
    }
    if (password.length < 1) {
      errors.password = t('auth.passwordRequired');
    }
    return errors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    login.mutate({ email, password });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg)' }}>
      <div
        className="w-full max-w-sm p-8 shadow-md"
        style={{ borderRadius: '8px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <h1 className="text-2xl font-bold text-center mb-6" style={{ color: 'var(--text-primary)' }}>
          {t('auth.loginTitle')}
        </h1>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Input
            id="email"
            type="email"
            label={t('auth.emailLabel')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
            placeholder={t('auth.emailPlaceholder')}
            disabled={login.isPending}
          />

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {t('auth.passwordLabel')}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                disabled={login.isPending}
                style={{
                  border: `1px solid ${fieldErrors.password ? 'var(--color-danger)' : 'var(--border)'}`,
                  borderRadius: '4px',
                  outline: 'none',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text-primary)',
                }}
                className="w-full px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs"
                style={{ color: 'var(--text-secondary)' }}
                aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
              >
                {showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
              </button>
            </div>
            {fieldErrors.password && (
              <span className="text-xs" style={{ color: 'var(--color-danger)' }}>
                {fieldErrors.password}
              </span>
            )}
          </div>

          <FormError message={login.error?.message} />

          <Button type="submit" variant="primary" isLoading={login.isPending} disabled={login.isPending}>
            {t('auth.loginButton')}
          </Button>
        </form>

        <p className="text-sm text-center mt-4" style={{ color: 'var(--text-muted)' }}>
          {t('auth.noAccount')}{' '}
          <Link to="/register" style={{ color: 'var(--color-primary)' }} className="hover:underline">
            {t('auth.register')}
          </Link>
        </p>
      </div>
    </div>
  );
}
