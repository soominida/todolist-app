// 환경변수 설정 (pool.js보다 먼저)
process.env.POSTGRES_CONNECTION_STRING =
  'postgresql://todolist_user:todolist1234@localhost:5432/todolist_test_db';
process.env.JWT_SECRET = 'test-secret-key';
process.env.CORS_ORIGIN = 'http://localhost:5173';
process.env.NODE_ENV = 'test';

const { default: request } = await import('supertest');
const { default: app } = await import('../../app.js');
const { default: pool } = await import('../../db/pool.js');

async function truncateTables() {
  await pool.query('TRUNCATE "user", category, todo RESTART IDENTITY CASCADE');
}

afterAll(async () => {
  await pool.end();
});

describe('POST /api/auth/register', () => {
  beforeEach(async () => {
    await truncateTables();
  });

  it('정상 가입 시 201과 token을 반환한다', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@test.com',
      password: 'password123',
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe('test@test.com');
  });

  it('중복 이메일로 가입하면 409를 반환한다', async () => {
    await request(app).post('/api/auth/register').send({
      email: 'dup@test.com',
      password: 'password123',
    });
    const res = await request(app).post('/api/auth/register').send({
      email: 'dup@test.com',
      password: 'password123',
    });
    expect(res.status).toBe(409);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await truncateTables();
    await request(app).post('/api/auth/register').send({
      email: 'login@test.com',
      password: 'password123',
    });
  });

  it('정상 로그인 시 200과 token을 반환한다', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@test.com',
      password: 'password123',
    });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });

  it('잘못된 비밀번호로 로그인하면 401을 반환한다', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@test.com',
      password: 'wrongpassword1',
    });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  let token;

  beforeEach(async () => {
    await truncateTables();
    const res = await request(app).post('/api/auth/register').send({
      email: 'me@test.com',
      password: 'password123',
    });
    token = res.body.data.token;
  });

  it('유효한 토큰으로 GET /api/auth/me 시 200과 user를 반환한다', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe('me@test.com');
  });

  it('토큰 없이 GET /api/auth/me 시 401을 반환한다', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
