/**
 * @param {{ id: string, type?: string, label: string, value: string, onChange: Function, error?: string, placeholder?: string, disabled?: boolean }} props
 */
export default function Input({ id, type = 'text', label, value, onChange, error, placeholder, disabled, ...rest }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          border: `1px solid ${error ? 'var(--color-danger)' : 'var(--border)'}`,
          borderRadius: '4px',
          outline: 'none',
          backgroundColor: 'var(--surface)',
          color: 'var(--text-primary)',
        }}
        className="px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
        {...rest}
      />
      {error && <span className="text-xs" style={{ color: 'var(--color-danger)' }}>{error}</span>}
    </div>
  );
}
