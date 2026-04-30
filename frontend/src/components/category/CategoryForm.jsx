import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button';
import FormError from '@/components/common/FormError';

/**
 * @param {{ onSubmit: Function, isLoading: boolean, error?: string }} props
 */
export default function CategoryForm({ onSubmit, isLoading, error }) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [localError, setLocalError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setLocalError(t('category.nameRequired'));
      return;
    }
    if (name.length > 20) {
      setLocalError(t('category.nameMaxLength'));
      return;
    }
    setLocalError('');
    onSubmit(name.trim());
    setName('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <div className="flex-1 flex flex-col gap-1">
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('category.namePlaceholder')}
              maxLength={20}
              disabled={isLoading}
              style={{
                border: `1px solid ${localError ? 'var(--color-danger)' : 'var(--border)'}`,
                borderRadius: '4px',
                outline: 'none',
                backgroundColor: 'var(--surface)',
                color: 'var(--text-primary)',
              }}
              className="w-full px-3 py-2 pr-14 text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            <span
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              {name.length}/20
            </span>
          </div>
        </div>
        <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
          {t('category.addButton')}
        </Button>
      </div>
      <FormError message={localError || error} />
    </form>
  );
}
