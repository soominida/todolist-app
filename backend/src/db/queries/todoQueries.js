import pool from '../pool.js';

export async function findTodosByUserId(userId, filters = {}) {
  const { categoryId, status } = filters;
  const params = [userId];
  const conditions = ['user_id = $1'];

  if (categoryId !== undefined) {
    if (categoryId === '0' || categoryId === 0 || categoryId === 'null') {
      conditions.push('category_id IS NULL');
    } else {
      params.push(categoryId);
      conditions.push(`category_id = $${params.length}`);
    }
  }

  if (status === 'completed') {
    conditions.push('is_completed = TRUE');
  } else if (status === 'pending') {
    conditions.push('is_completed = FALSE');
    conditions.push('(due_date IS NULL OR due_date >= NOW())');
  } else if (status === 'overdue') {
    conditions.push('is_completed = FALSE');
    conditions.push('due_date < NOW()');
  }

  const sql = `SELECT * FROM todo WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC`;
  const { rows } = await pool.query(sql, params);
  return rows;
}

export async function findTodoById(id, userId) {
  const { rows } = await pool.query(
    'SELECT * FROM todo WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return rows[0] ?? null;
}

export async function createTodo(userId, { title, description, categoryId, dueDate }) {
  const { rows } = await pool.query(
    `INSERT INTO todo (user_id, category_id, title, description, due_date)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, categoryId ?? null, title, description ?? null, dueDate ?? null]
  );
  return rows[0];
}

export async function updateTodo(id, userId, fields) {
  const allowed = ['title', 'description', 'category_id', 'due_date', 'is_completed'];
  const setClauses = ['updated_at = NOW()'];
  const params = [id, userId];

  for (const [key, value] of Object.entries(fields)) {
    if (allowed.includes(key)) {
      params.push(value);
      setClauses.push(`${key} = $${params.length}`);
    }
  }

  const sql = `UPDATE todo SET ${setClauses.join(', ')} WHERE id = $1 AND user_id = $2 RETURNING *`;
  const { rows } = await pool.query(sql, params);
  return rows[0] ?? null;
}

export async function deleteTodo(id, userId) {
  const { rowCount } = await pool.query(
    'DELETE FROM todo WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return rowCount > 0;
}

export async function toggleComplete(id, userId) {
  const { rows } = await pool.query(
    `UPDATE todo
     SET is_completed = NOT is_completed, updated_at = NOW()
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [id, userId]
  );
  return rows[0] ?? null;
}
