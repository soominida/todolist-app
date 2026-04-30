import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button';
import FormError from '@/components/common/FormError';
import { useUpdateCategory } from '@/hooks/useCategories';

/**
 * @param {{ category: { id: number, name: string }, onDelete: Function }} props
 */
export default function CategoryItem({ category, onDelete }) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(category.name);
  const [editError, setEditError] = useState('');

  const updateCategory = useUpdateCategory();

  function handleEditStart() {
    setEditName(category.name);
    setEditError('');
    setIsEditing(true);
  }

  function handleCancel() {
    setIsEditing(false);
    setEditError('');
  }

  function handleSave() {
    if (!editName.trim()) {
      setEditError(t('category.nameRequired'));
      return;
    }
    if (editName.length > 20) {
      setEditError(t('category.nameMaxLength'));
      return;
    }
    setEditError('');
    updateCategory.mutate(
      { id: category.id, name: editName.trim() },
      { onSuccess: () => setIsEditing(false) }
    );
  }

  const cardStyle = {
    border: '1px solid var(--border)',
    borderRadius: '8px',
    backgroundColor: 'var(--surface)',
  };

  const inputStyle = {
    border: `1px solid ${editError ? 'var(--color-danger)' : 'var(--border)'}`,
    borderRadius: '4px',
    outline: 'none',
    backgroundColor: 'var(--surface)',
    color: 'var(--text-primary)',
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 p-3" style={cardStyle}>
        <div className="flex gap-2 items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              maxLength={20}
              disabled={updateCategory.isPending}
              style={inputStyle}
              className="w-full px-3 py-2 pr-14 text-sm focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            />
            <span
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              {editName.length}/20
            </span>
          </div>
          <Button type="button" variant="outlined" disabled={updateCategory.isPending} onClick={handleCancel}>
            {t('category.cancel')}
          </Button>
          <Button type="button" variant="primary" isLoading={updateCategory.isPending} disabled={updateCategory.isPending} onClick={handleSave}>
            {t('category.save')}
          </Button>
        </div>
        <FormError message={editError} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-4 py-3" style={cardStyle}>
      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
        {category.name}
      </span>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={handleEditStart}
          aria-label={t('category.edit')}
          style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onDelete(category.id)}
          aria-label={t('category.delete')}
          style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--color-danger)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
