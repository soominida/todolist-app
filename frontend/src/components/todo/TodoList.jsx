import { useTranslation } from 'react-i18next';
import EmptyState from './EmptyState';
import TodoItem from './TodoItem';

export default function TodoList({ todos = [], isLoading, isError, categories = [], onEdit, onDelete }) {
  const { t } = useTranslation();

  if (isLoading) {
    return <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>{t('todo.loading')}</p>;
  }

  if (isError) {
    return (
      <p style={{ textAlign: 'center', color: 'var(--color-danger)', fontSize: '14px' }}>
        {t('todo.loadError')}
      </p>
    );
  }

  if (todos.length === 0) {
    return <EmptyState message={t('todo.empty')} />;
  }

  const categoryMap = new Map(categories?.map((c) => [c.id, c.name]) ?? []);

  return (
    <div>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={{ ...todo, categoryName: categoryMap.get(todo.categoryId) }}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
