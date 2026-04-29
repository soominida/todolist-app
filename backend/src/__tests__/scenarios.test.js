// ESM에서 환경변수를 먼저 설정하기 위해 최상단에 배치
process.env.JWT_SECRET = 'test-secret-key';
process.env.POSTGRES_CONNECTION_STRING = 'postgresql://todolist_user:todolist1234@localhost:5432/todolist_db';
process.env.CORS_ORIGIN = 'http://localhost:5173';

import request from 'supertest';
import { jest } from '@jest/globals';

// 앱과 DB 풀을 동적으로 임포트하여 환경변수 적용 보장
const { default: app } = await import('../app.js');
const { default: pool } = await import('../db/pool.js');

describe('사용자 시나리오 기반 종합 API 테스트 (App Instance)', () => {
  let token;
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  
  let workCategoryId;
  let personalCategoryId;
  let todoId;

  // 테스트 종료 후 DB 연결 종료
  afterAll(async () => {
    await pool.end();
  });

  // SCN-01: 신규 사용자 회원가입 및 첫 로그인
  describe('SCN-01: 회원가입 및 로그인', () => {
    test('회원가입 성공', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: testEmail, password: testPassword });
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe(testEmail);
    });

    test('로그인 성공 및 토큰 발급', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testEmail, password: testPassword });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      token = res.body.data.token;
      expect(token).toBeDefined();
    });
  });

  // SCN-02: 업무 카테고리 생성 및 할일 등록
  describe('SCN-02: 카테고리 생성 및 할일 등록', () => {
    test('카테고리 생성 및 할일 등록', async () => {
      // 카테고리 생성
      const catRes = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: '업무' });
      workCategoryId = catRes.body.data.category.id;

      // 할일 등록
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 2);
      const todoRes = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Q2 기획서 작성',
          categoryId: workCategoryId,
          dueDate: futureDate.toISOString()
        });
      
      expect(todoRes.status).toBe(201);
      expect(todoRes.body.data.todo.category_id).toBe(workCategoryId);
      todoId = todoRes.body.data.todo.id;
    });
  });

  // SCN-03: 카테고리 필터로 업무 할일 집중 조회
  describe('SCN-03: 카테고리 필터링', () => {
    test('"업무" 카테고리 필터링', async () => {
      const res = await request(app)
        .get(`/api/todos?categoryId=${workCategoryId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.data.todos.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data.todos.every(t => t.category_id === workCategoryId)).toBe(true);
    });
  });

  // SCN-04: 할일 완료 처리 및 완료 목록 확인
  describe('SCN-04: 할일 완료 처리', () => {
    test('할일 완료 처리 및 필터링', async () => {
      // 완료 처리
      await request(app)
        .patch(`/api/todos/${todoId}/complete`)
        .set('Authorization', `Bearer ${token}`);
      
      // 완료 목록 조회
      const res = await request(app)
        .get('/api/todos?status=completed')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.data.todos.some(t => t.id === todoId)).toBe(true);
    });
  });

  // SCN-05: 기한 초과 할일 파악 및 마감일 재조정
  describe('SCN-05: 기한 초과 관리', () => {
    test('기한 초과 할일 수정', async () => {
      const pastDate = new Date();
      pastDate.setMinutes(pastDate.getMinutes() - 10);
      
      const overRes = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: '기한초과 테스트', dueDate: pastDate.toISOString() });
      const overdueId = overRes.body.data.todo.id;
      expect(overRes.body.data.todo.status).toBe('overdue');

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const updateRes = await request(app)
        .put(`/api/todos/${overdueId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ dueDate: futureDate.toISOString() });
      
      expect(updateRes.body.data.todo.status).toBe('pending');
    });
  });

  // SCN-06: 카테고리 삭제 시 할일 미분류 처리 확인
  describe('SCN-06: 카테고리 삭제 영향', () => {
    test('카테고리 삭제 후 할일 보존', async () => {
      const catRes = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: '삭제용' });
      const cid = catRes.body.data.category.id;

      const todoRes = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: '보존될 할일', categoryId: cid });
      const tid = todoRes.body.data.todo.id;

      await request(app)
        .delete(`/api/categories/${cid}`)
        .set('Authorization', `Bearer ${token}`);
      
      const listRes = await request(app)
        .get('/api/todos?categoryId=0')
        .set('Authorization', `Bearer ${token}`);
      
      const found = listRes.body.data.todos.find(t => t.id === tid);
      expect(found).toBeDefined();
      expect(found.category_id).toBeNull();
    });
  });

  // SCN-07: 할일 삭제
  describe('SCN-07: 할일 삭제', () => {
    test('할일 영구 삭제', async () => {
      await request(app)
        .delete(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${token}`);
      
      const res = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${token}`);
      expect(res.body.data.todos.some(t => t.id === todoId)).toBe(false);
    });
  });

  // SCN-08: 비인증 접근 차단
  describe('SCN-08: 보안', () => {
    test('인증 없이 접근 불가', async () => {
      const res = await request(app).get('/api/categories');
      expect(res.status).toBe(401);
    });
  });
});
