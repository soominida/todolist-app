import { useTranslation } from 'react-i18next';
import CategoryItem from './CategoryItem';

/**
 * @param {{ categories: Array<{ id: number, name: string }>, onDeleteRequest: Function }} props
 */
export default function CategoryList({ categories, onDeleteRequest }) {
  const { t } = useTranslation();

  if (categories.length === 0) {
    return (
      <p className="text-sm text-center py-8" style={{ color: 'var(--text-secondary)' }}>
        {t('category.empty')}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {categories.map((category) => (
        <li key={category.id}>
          <CategoryItem category={category} onDelete={onDeleteRequest} />
        </li>
      ))}
    </ul>
  );
}
