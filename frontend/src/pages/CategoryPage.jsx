import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCategories, useCreateCategory, useDeleteCategory } from '@/hooks/useCategories';
import CategoryForm from '@/components/category/CategoryForm';
import CategoryList from '@/components/category/CategoryList';
import CategoryDeleteDialog from '@/components/category/CategoryDeleteDialog';

export default function CategoryPage() {
  const { t } = useTranslation();
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  function handleDeleteRequest(id) {
    setSelectedCategoryId(id);
  }

  function handleDeleteConfirm() {
    deleteCategory.mutate(selectedCategoryId, {
      onSuccess: () => setSelectedCategoryId(null),
    });
  }

  function handleDialogClose() {
    setSelectedCategoryId(null);
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="mb-6">
          <Link
            to="/"
            className="text-sm hover:underline"
            style={{ color: 'var(--color-primary)' }}
          >
            {t('category.backToTodo')}
          </Link>
        </div>

        <h1 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
          {t('category.pageTitle')}
        </h1>

        <div
          className="p-4 mb-4"
          style={{
            border: '1px solid var(--border)',
            borderRadius: '8px',
            backgroundColor: 'var(--surface)',
          }}
        >
          <CategoryForm
            onSubmit={(name) => createCategory.mutate(name)}
            isLoading={createCategory.isPending}
            error={createCategory.error?.message}
          />
        </div>

        {isLoading ? (
          <p className="text-sm text-center py-8" style={{ color: 'var(--text-secondary)' }}>
            {t('todo.loading')}
          </p>
        ) : (
          <CategoryList
            categories={categories}
            onDeleteRequest={handleDeleteRequest}
          />
        )}

        <CategoryDeleteDialog
          isOpen={selectedCategoryId !== null}
          onClose={handleDialogClose}
          onConfirm={handleDeleteConfirm}
          isLoading={deleteCategory.isPending}
        />
      </div>
    </div>
  );
}
