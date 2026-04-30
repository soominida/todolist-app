import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { useCreateTodo, useUpdateTodo } from '@/hooks/useTodos';
import { useCategories, useCreateCategory } from '@/hooks/useCategories';

function toLocalDatetime(iso) {
  if (!iso) return '';
  return iso.slice(0, 16);
}

export default function TodoForm({ isOpen, onClose, initialValues }) {
  const { t } = useTranslation();
  const isEditMode = initialValues != null;

  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [categoryId, setCategoryId] = useState(initialValues?.categoryId?.toString() ?? '');
  const [dueDate, setDueDate] = useState(toLocalDatetime(initialValues?.dueDate));
  const [errors, setErrors] = useState({});

  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const newCategoryInputRef = useRef(null);

  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();
  const createCategory = useCreateCategory();
  const { data: categories = [] } = useCategories();

  const isPending = createTodo.isPending || updateTodo.isPending;

  useEffect(() => {
    if (isOpen) {
      setTitle(initialValues?.title ?? '');
      setDescription(initialValues?.description ?? '');
      setCategoryId(initialValues?.categoryId?.toString() ?? '');
      setDueDate(toLocalDatetime(initialValues?.dueDate));
      setErrors({});
      setNewCategoryName('');
      setIsAddingCategory(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isAddingCategory && newCategoryInputRef.current) {
      newCategoryInputRef.current.focus();
    }
  }, [isAddingCategory]);

  function handleCategorySelectChange(e) {
    const val = e.target.value;
    if (val === '__new__') {
      setIsAddingCategory(true);
      setNewCategoryName('');
    } else {
      setCategoryId(val);
    }
  }

  function handleAddCategory() {
    const name = newCategoryName.trim();
    if (!name) return;
    createCategory.mutate(name, {
      onSuccess: (created) => {
        setCategoryId(String(created.id));
        setIsAddingCategory(false);
        setNewCategoryName('');
      },
    });
  }

  function handleCancelAddCategory() {
    setIsAddingCategory(false);
    setNewCategoryName('');
  }

  function validate() {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = t('todoForm.titleRequired');
    } else if (title.length > 100) {
      newErrors.title = t('todoForm.titleMaxLength');
    }
    if (description.length > 500) {
      newErrors.description = t('todoForm.descMaxLength');
    }
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      title: title.trim(),
      description: description || null,
      categoryId: categoryId ? Number(categoryId) : null,
      dueDate: dueDate || null,
    };

    if (isEditMode) {
      updateTodo.mutate({ id: initialValues.id, ...payload }, { onSuccess: onClose });
    } else {
      createTodo.mutate(payload, { onSuccess: onClose });
    }
  }

  const labelStyle = { fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' };
  const inputStyle = {
    width: '100%',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    padding: '8px 10px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: 'var(--surface)',
    color: 'var(--text-primary)',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? t('todoForm.editTitle') : t('todoForm.addTitle')}>
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>{t('todoForm.titleLabel')}</label>
          <input
            style={inputStyle}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={101}
            placeholder={t('todoForm.titlePlaceholder')}
          />
          <div className="flex justify-between" style={{ marginTop: '2px' }}>
            {errors.title && (
              <span style={{ fontSize: '12px', color: 'var(--color-danger)' }}>{errors.title}</span>
            )}
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
              ({title.length}/100)
            </span>
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>{t('todoForm.descLabel')}</label>
          <textarea
            style={{ ...inputStyle, resize: 'vertical' }}
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('todoForm.descPlaceholder')}
          />
          <div className="flex justify-between" style={{ marginTop: '2px' }}>
            {errors.description && (
              <span style={{ fontSize: '12px', color: 'var(--color-danger)' }}>{errors.description}</span>
            )}
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
              ({description.length}/500)
            </span>
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>{t('todoForm.categoryLabel')}</label>
          {isAddingCategory ? (
            <div className="flex gap-2">
              <input
                ref={newCategoryInputRef}
                style={{ ...inputStyle, flex: 1 }}
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); }
                  if (e.key === 'Escape') handleCancelAddCategory();
                }}
                placeholder={t('todoForm.newCategoryPlaceholder')}
                maxLength={20}
                disabled={createCategory.isPending}
              />
              <Button
                type="button"
                variant="primary"
                isLoading={createCategory.isPending}
                onClick={handleAddCategory}
              >
                {t('todoForm.addCategoryButton')}
              </Button>
              <Button type="button" variant="outlined" onClick={handleCancelAddCategory}>
                {t('todoForm.cancel')}
              </Button>
            </div>
          ) : (
            <select
              style={inputStyle}
              value={categoryId}
              onChange={handleCategorySelectChange}
            >
              <option value="">{t('todoForm.uncategorized')}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
              <option value="__new__">{t('todoForm.addCategory')}</option>
            </select>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>{t('todoForm.dueDateLabel')}</label>
          <input
            type="datetime-local"
            style={inputStyle}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outlined" type="button" onClick={onClose}>
            {t('todoForm.cancel')}
          </Button>
          <Button variant="primary" type="submit" isLoading={isPending}>
            {t('todoForm.save')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
