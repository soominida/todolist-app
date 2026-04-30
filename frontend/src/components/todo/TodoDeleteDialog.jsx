import { useTranslation } from 'react-i18next';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { useDeleteTodo } from '@/hooks/useTodos';

export default function TodoDeleteDialog({ isOpen, onClose, todo }) {
  const { t } = useTranslation();
  const deleteTodo = useDeleteTodo();

  function handleDelete() {
    deleteTodo.mutate(todo.id, { onSuccess: onClose });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('todoDelete.title')}>
      <p style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '20px' }}>
        {t('todoDelete.message')}
      </p>
      <div className="flex justify-end gap-2">
        <Button variant="outlined" onClick={onClose}>
          {t('todoDelete.cancel')}
        </Button>
        <Button variant="danger" onClick={handleDelete} isLoading={deleteTodo.isPending}>
          {t('todoDelete.confirm')}
        </Button>
      </div>
    </Modal>
  );
}
