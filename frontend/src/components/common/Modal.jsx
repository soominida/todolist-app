import { useEffect } from 'react';

/**
 * @param {{ isOpen: boolean, onClose: Function, title: string, children: React.ReactNode }} props
 */
export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="p-6 w-full max-w-sm shadow-lg"
        style={{
          borderRadius: '8px',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}
