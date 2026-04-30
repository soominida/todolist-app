export default function EmptyState({ message = '할일이 없습니다.' }) {
  return (
    <div
      style={{
        padding: '64px 0',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '14px',
      }}
    >
      {message}
    </div>
  );
}
