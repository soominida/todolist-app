import pool from '../pool.js';

export async function findUserByEmail(email) {
  const { rows } = await pool.query(
    'SELECT id, email, created_at FROM "user" WHERE email = $1',
    [email]
  );
  return rows[0] ?? null;
}

export async function findUserById(id) {
  const { rows } = await pool.query(
    'SELECT id, email, created_at FROM "user" WHERE id = $1',
    [id]
  );
  return rows[0] ?? null;
}

export async function createUser(email, passwordHash) {
  const { rows } = await pool.query(
    'INSERT INTO "user" (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
    [email, passwordHash]
  );
  return rows[0];
}
