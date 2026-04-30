import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { useLogout } from '@/hooks/useAuth';
import Button from '@/components/common/Button';

function formatToday() {
  const now = new Date();
  return `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export default function Header() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const today = formatToday();
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <header
      style={{
        height: '64px',
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
      }}
    >
      <span style={{ fontWeight: 'bold', color: 'var(--color-primary)', fontSize: '18px', flex: 1 }}>
        {t('app.title')}
      </span>

      <div className="flex items-center gap-3">
        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{today}</span>
        {user?.email && (
          <span
            className="hidden md:block"
            style={{ fontSize: '14px', color: 'var(--text-secondary)' }}
          >
            {user.email}
          </span>
        )}
        <button
          onClick={toggleTheme}
          aria-label={isDark ? t('header.lightMode') : t('header.darkMode')}
          style={{
            color: 'var(--text-secondary)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
        <select
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            padding: '2px 6px',
            cursor: 'pointer',
            backgroundColor: 'var(--surface)',
          }}
        >
          <option value="ko">한국어</option>
          <option value="en">English</option>
          <option value="ja">日本語</option>
        </select>
        <Link
          to="/categories"
          className="hidden md:block"
          style={{ fontSize: '14px', color: 'var(--color-primary)', textDecoration: 'none' }}
        >
          {t('header.categoryManage')}
        </Link>
        <Button variant="text" onClick={logout}>
          {t('header.logout')}
        </Button>
      </div>
    </header>
  );
}
