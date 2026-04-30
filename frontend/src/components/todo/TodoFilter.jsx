import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const STATUS_TABS = [
  { value: '', labelKey: 'filter.all' },
  { value: 'pending', labelKey: 'filter.pending' },
  { value: 'completed', labelKey: 'filter.completed' },
  { value: 'overdue', labelKey: 'filter.overdue' },
];

const SORT_OPTIONS = [
  { value: 'createdAt:desc', labelKey: 'filter.sortCreatedDesc' },
  { value: 'createdAt:asc', labelKey: 'filter.sortCreatedAsc' },
  { value: 'dueDate:asc', labelKey: 'filter.sortDueDateAsc' },
  { value: 'dueDate:desc', labelKey: 'filter.sortDueDateDesc' },
];

const selectStyle = {
  border: '1px solid var(--border)',
  borderRadius: '4px',
  padding: '6px 12px',
  fontSize: '14px',
  backgroundColor: 'var(--surface)',
  color: 'var(--text-primary)',
  cursor: 'pointer',
};

export default function TodoFilter({ categories = [] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const categoryId = searchParams.get('categoryId') ?? '';
  const status = searchParams.get('status') ?? '';
  const sortBy = searchParams.get('sortBy') ?? 'createdAt';
  const sortOrder = searchParams.get('sortOrder') ?? 'desc';
  const sortValue = `${sortBy}:${sortOrder}`;

  function handleCategoryChange(e) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (e.target.value) next.set('categoryId', e.target.value);
      else next.delete('categoryId');
      return next;
    });
  }

  function handleStatusChange(value) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (value) next.set('status', value);
      else next.delete('status');
      return next;
    });
  }

  function handleSortChange(e) {
    const [by, order] = e.target.value.split(':');
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('sortBy', by);
      next.set('sortOrder', order);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 flex-wrap">
        <select value={categoryId} onChange={handleCategoryChange} style={selectStyle}>
          <option value="">{t('filter.allCategories')}</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
          <option value="uncategorized">{t('filter.uncategorized')}</option>
        </select>

        <select value={sortValue} onChange={handleSortChange} style={selectStyle}>
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {t(opt.labelKey)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex overflow-x-auto gap-1">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => handleStatusChange(tab.value)}
            style={
              status === tab.value
                ? {
                    backgroundColor: 'var(--color-primary)',
                    color: '#fff',
                    border: '1px solid var(--color-primary)',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                  }
                : {
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                  }
            }
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>
    </div>
  );
}
