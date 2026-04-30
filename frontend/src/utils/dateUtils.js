export function getTodoStatus(todo) {
  if (todo.isCompleted) return 'completed';
  if (!todo.dueDate) return 'pending';
  if (new Date(todo.dueDate) < new Date()) return 'overdue';
  return 'pending';
}

export function formatDate(dateString) {
  if (dateString == null) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
}

export function isOverdue(dueDate) {
  if (dueDate == null) return false;
  return new Date(dueDate) < new Date();
}
