import { useTranslation } from 'react-i18next';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';

/**
 * @param {{ isOpen: boolean, onClose: Function, onConfirm: Function, isLoading: boolean }} props
 */
export default function CategoryDeleteDialog({ isOpen, onClose, onConfirm, isLoading }) {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('category.deleteTitle')}>
      <p className="text-sm mb-6" style={{ color: 'var(--text-primary)' }}>
        {t('category.deleteMessage')}
      </p>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outlined" disabled={isLoading} onClick={onClose}>
          {t('category.deleteCancel')}
        </Button>
        <Button type="button" variant="danger" isLoading={isLoading} disabled={isLoading} onClick={onConfirm}>
          {t('category.deleteConfirm')}
        </Button>
      </div>
    </Modal>
  );
}
