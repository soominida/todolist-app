/**
 * @param {{ variant?: 'primary'|'outlined'|'text'|'danger', isLoading?: boolean, disabled?: boolean, children: React.ReactNode }} props
 */
export default function Button({ variant = 'primary', isLoading = false, disabled = false, children, ...rest }) {
  const base = 'px-6 py-2 text-sm font-medium rounded-full transition-colors duration-150 cursor-pointer';

  const styles = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: '#fff',
    },
    outlined: {
      backgroundColor: 'transparent',
      color: 'var(--color-primary)',
      border: '1px solid var(--color-primary)',
    },
    text: {
      backgroundColor: 'transparent',
      color: 'var(--color-primary)',
    },
    danger: {
      backgroundColor: 'var(--color-danger)',
      color: '#fff',
    },
  };

  const hoverClass = {
    primary: 'hover:opacity-90',
    outlined: 'hover:opacity-80',
    text: 'hover:opacity-80',
    danger: 'hover:opacity-90',
  };

  return (
    <button
      style={styles[variant] ?? styles.primary}
      className={`${base} ${hoverClass[variant] ?? ''} disabled:opacity-60 disabled:cursor-not-allowed`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? '...' : children}
    </button>
  );
}
