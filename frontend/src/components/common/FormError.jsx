/**
 * @param {{ message?: string }} props
 */
export default function FormError({ message }) {
  if (!message) return null;
  return (
    <p className="text-sm" style={{ color: 'var(--color-danger)' }} role="alert">
      {message}
    </p>
  );
}
