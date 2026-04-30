import { useTranslation } from 'react-i18next';
import { useToggleTodoComplete } from '@/hooks/useTodos';
import { formatDate } from '@/utils/dateUtils';

const ACCENT_COLOR = {
  pending: 'var(--color-primary)',
  completed: 'var(--color-success)',
  overdue: 'var(--color-danger)',
};

const BADGE_STYLE = {
  pending: { backgroundColor: 'var(--color-primary-bg)', color: 'var(--color-primary)' },
  completed: { backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)' },
  overdue: { backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)' },
};

export default function TodoItem({ todo, onEdit, onDelete }) {
  const { t } = useTranslation();
  const toggleComplete = useToggleTodoComplete();
  const status = todo.status ?? 'pending';
  const categoryLabel = todo.categoryName ?? t('todo.uncategorized');

  const STATUS_LABEL = {
    pending: t('filter.pending'),
    completed: t('filter.completed'),
    overdue: t('filter.overdue'),
  };

  function handleToggle() {
    toggleComplete.mutate(todo.id);
  }

  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderLeft: `4px solid ${ACCENT_COLOR[status] ?? ACCENT_COLOR.pending}`,
        borderRadius: '8px',
        padding: '12px 16px',
        marginBottom: '8px',
        backgroundColor: 'var(--surface)',
      }}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggle}
          aria-label={todo.isCompleted ? t('todo.uncompleteLabel') : t('todo.completeLabel')}
          disabled={toggleComplete.isPending}
          style={{
            width: '18px',
            height: '18px',
            minWidth: '18px',
            borderRadius: '50%',
            border: todo.isCompleted ? 'none' : '2px solid var(--border)',
            backgroundColor: todo.isCompleted ? 'var(--color-success)' : 'transparent',
            cursor: 'pointer',
            marginTop: '2px',
          }}
        />

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span
              style={{
                color: todo.isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                textDecoration: todo.isCompleted ? 'line-through' : 'none',
                fontSize: '14px',
                fontWeight: '500',
                wordBreak: 'break-word',
              }}
            >
              {todo.title}
            </span>
            <span
              style={{
                ...BADGE_STYLE[status],
                borderRadius: '12px',
                padding: '2px 10px',
                fontSize: '11px',
                fontWeight: '500',
                whiteSpace: 'nowrap',
              }}
            >
              {STATUS_LABEL[status]}
            </span>
          </div>

          {todo.description && (
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              {todo.description}
            </p>
          )}

          <div className="flex flex-wrap gap-3" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            <span>{t('todo.category')}: {categoryLabel}</span>
            <span>{t('todo.dueDate')}: {todo.dueDate ? formatDate(todo.dueDate) : t('todo.noDueDate')}</span>
          </div>
        </div>

        <div className="flex gap-1 ml-2">
          <button
            onClick={() => onEdit(todo)}
            aria-label={t('todo.editLabel')}
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
            onClick={() => onDelete(todo)}
            aria-label={t('todo.deleteLabel')}
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
    </div>
  );
}
