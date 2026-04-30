import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRegister } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import FormError from '@/components/common/FormError';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

export default function RegisterPage() {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const register = useRegister();

  if (isAuthenticated) return <Navigate to="/" replace />;

  if (register.isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg)' }}>
        <div
          className="w-full max-w-sm p-8 shadow-md text-center"
          style={{ borderRadius: '8px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-success-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            {t('auth.registerSuccess')}
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            {t('auth.registerSuccessDesc')}
          </p>
          <Link to="/login">
            <Button variant="primary" style={{ width: '100%' }}>
              {t('auth.goToLogin')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  function validate() {
    const errors = {};
    if (!EMAIL_REGEX.test(email)) {
      errors.email = t('auth.emailError');
    }
    if (!PASSWORD_REGEX.test(password)) {
      errors.password = t('auth.passwordError');
    }
    if (password !== passwordConfirm) {
      errors.passwordConfirm = t('auth.confirmPasswordError');
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
    register.mutate({ email, password });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg)' }}>
      <div
        className="w-full max-w-sm p-8 shadow-md"
        style={{ borderRadius: '8px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <h1 className="text-2xl font-bold text-center mb-6" style={{ color: 'var(--text-primary)' }}>
          {t('auth.registerHeading')}
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
            disabled={register.isPending}
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
                disabled={register.isPending}
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
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {t('auth.passwordHint')}
            </p>
            {fieldErrors.password && (
              <span className="text-xs" style={{ color: 'var(--color-danger)' }}>
                {fieldErrors.password}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="passwordConfirm" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {t('auth.confirmPasswordLabel')}
            </label>
            <div className="relative">
              <input
                id="passwordConfirm"
                type={showPasswordConfirm ? 'text' : 'password'}
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder={t('auth.confirmPasswordPlaceholder')}
                disabled={register.isPending}
                style={{
                  border: `1px solid ${fieldErrors.passwordConfirm ? 'var(--color-danger)' : 'var(--border)'}`,
                  borderRadius: '4px',
                  outline: 'none',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text-primary)',
                }}
                className="w-full px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs"
                style={{ color: 'var(--text-secondary)' }}
                aria-label={showPasswordConfirm ? t('auth.hidePassword') : t('auth.showPassword')}
              >
                {showPasswordConfirm ? t('auth.hidePassword') : t('auth.showPassword')}
              </button>
            </div>
            {fieldErrors.passwordConfirm && (
              <span className="text-xs" style={{ color: 'var(--color-danger)' }}>
                {fieldErrors.passwordConfirm}
              </span>
            )}
          </div>

          <FormError message={register.error?.message} />

          <Button type="submit" variant="primary" isLoading={register.isPending} disabled={register.isPending}>
            {t('auth.registerButton')}
          </Button>
        </form>

        <p className="text-sm text-center mt-4" style={{ color: 'var(--text-muted)' }}>
          {t('auth.hasAccount')}{' '}
          <Link to="/login" style={{ color: 'var(--color-primary)' }} className="hover:underline">
            {t('auth.login')}
          </Link>
        </p>
      </div>
    </div>
  );
}
