import pool from '../pool.js';

export async function findCategoriesByUserId(userId) {
  const { rows } = await pool.query(
    'SELECT * FROM category WHERE user_id = $1 ORDER BY created_at',
    [userId]
  );
  return rows;
}

export async function findCategoryById(id, userId) {
  const { rows } = await pool.query(
    'SELECT * FROM category WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return rows[0] ?? null;
}

export async function createCategory(userId, name) {
  const { rows } = await pool.query(
    'INSERT INTO category (user_id, name) VALUES ($1, $2) RETURNING *',
    [userId, name]
  );
  return rows[0];
}

export async function updateCategory(id, userId, name) {
  const { rows } = await pool.query(
    'UPDATE category SET name = $3 WHERE id = $1 AND user_id = $2 RETURNING *',
    [id, userId, name]
  );
  return rows[0] ?? null;
}

export async function deleteCategory(id, userId) {
  const { rowCount } = await pool.query(
    'DELETE FROM category WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return rowCount > 0;
}
