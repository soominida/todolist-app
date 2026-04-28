import pg from 'pg';

const { Pool } = pg;

const connectionString = process.env.POSTGRES_CONNECTION_STRING;

if (!connectionString) {
  console.error('환경변수 POSTGRES_CONNECTION_STRING이 설정되지 않았습니다.');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('pg Pool 유휴 클라이언트 오류:', err);
});

export async function testConnection() {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
  } finally {
    client.release();
  }
}

export default pool;
