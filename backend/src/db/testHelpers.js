import pool from './pool.js';

export async function clearDatabase() {
  await pool.query('TRUNCATE "user", category, todo RESTART IDENTITY CASCADE');
}
