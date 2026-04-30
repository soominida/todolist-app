import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '@/components/common/Header';
import TodoFilter from '@/components/todo/TodoFilter';
import TodoList from '@/components/todo/TodoList';
import TodoForm from '@/components/todo/TodoForm';
import TodoDeleteDialog from '@/components/todo/TodoDeleteDialog';
import Button from '@/components/common/Button';
import { useTodos } from '@/hooks/useTodos';
import { useCategories } from '@/hooks/useCategories';

function sortTodos(todos, sortBy, sortOrder) {
  return [...todos].sort((a, b) => {
    const aVal = a[sortBy] ? new Date(a[sortBy]) : null;
    const bVal = b[sortBy] ? new Date(b[sortBy]) : null;
    if (aVal === null && bVal === null) return 0;
    if (aVal === null) return 1;
    if (bVal === null) return -1;
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });
}

export default function TodoPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('categoryId') || undefined;
  const status = searchParams.get('status') || undefined;
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  const { data: rawTodos = [], isLoading, isError } = useTodos({ categoryId, status });
  const todos = sortTodos(rawTodos, sortBy, sortOrder);
  const { data: categories = [] } = useCategories();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [deletingTodo, setDeletingTodo] = useState(null);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-4">
          <TodoFilter categories={categories} />
        </div>
        <TodoList
          todos={todos}
          isLoading={isLoading}
          isError={isError}
          categories={categories}
          onEdit={(todo) => {
            setEditingTodo(todo);
            setIsFormOpen(true);
          }}
          onDelete={(todo) => setDeletingTodo(todo)}
        />
        <div className="flex justify-center mt-6">
          <Button
            variant="primary"
            onClick={() => {
              setEditingTodo(null);
              setIsFormOpen(true);
            }}
          >
            {t('todo.addButton')}
          </Button>
        </div>
      </main>

      <TodoForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTodo(null);
        }}
        initialValues={editingTodo}
      />
      <TodoDeleteDialog
        isOpen={!!deletingTodo}
        onClose={() => setDeletingTodo(null)}
        todo={deletingTodo}
      />
    </div>
  );
}
