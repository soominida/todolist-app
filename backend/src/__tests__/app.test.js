// 환경변수는 모듈 import 전에 설정 (ESM에서도 process.env는 동기적으로 적용됨)
process.env.CORS_ORIGIN = 'http://localhost:5173';
process.env.JWT_SECRET = 'test-secret-key';
process.env.POSTGRES_CONNECTION_STRING =
  'postgresql://todolist_user:todolist1234@localhost:5432/todolist_db';

import { jest } from '@jest/globals';
import request from 'supertest';

// ESM 모듈 캐시를 피하기 위해 동적 import 사용
const { default: app } = await import('../app.js');

describe('Express 앱 (app.js) 테스트', () => {
  // 1. 존재하지 않는 경로 → 404 + success:false
  test('GET /api/nonexistent → 404 응답', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('요청한 리소스를 찾을 수 없습니다.');
  });

  // 2. 또 다른 존재하지 않는 경로 → 404
  test('GET /api/health (미정의 경로) → 404 응답', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  // 3. CORS 헤더가 응답에 포함된다
  test('CORS 헤더가 응답에 포함된다', async () => {
    const res = await request(app)
      .get('/api/nonexistent')
      .set('Origin', 'http://localhost:5173');
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
  });

  // 4. 전역 에러 핸들러: statusCode 없는 에러 → 500 JSON 응답
  // app.js에 직접 테스트 라우트를 추가할 수 없으므로,
  // 에러 핸들러 로직을 별도의 express 인스턴스로 검증
  test('전역 에러 핸들러 - statusCode 없는 에러 → 500 JSON 응답', async () => {
    const { default: express } = await import('express');
    const { sendError } = await import('../utils/responseUtils.js');

    const testApp = express();
    testApp.use(express.json());

    testApp.get('/error-route', (_req, _res, next) => {
      const err = new Error('테스트 에러');
      next(err);
    });

    // 전역 에러 핸들러 (app.js와 동일한 로직)
    // eslint-disable-next-line no-unused-vars
    testApp.use((err, _req, res, _next) => {
      const statusCode = err.statusCode ?? 500;
      const message = err.message || '서버 내부 오류가 발생했습니다.';
      sendError(res, message, statusCode);
    });

    const res = await request(testApp).get('/error-route');
    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('테스트 에러');
  });

  // 5. 전역 에러 핸들러: statusCode 포함 에러 처리
  test('전역 에러 핸들러 - statusCode 있는 에러 → 해당 상태 코드 반환', async () => {
    const { default: express } = await import('express');
    const { sendError } = await import('../utils/responseUtils.js');

    const testApp = express();
    testApp.use(express.json());

    testApp.get('/custom-error', (_req, _res, next) => {
      const err = new Error('커스텀 에러');
      err.statusCode = 422;
      next(err);
    });

    // eslint-disable-next-line no-unused-vars
    testApp.use((err, _req, res, _next) => {
      const statusCode = err.statusCode ?? 500;
      const message = err.message || '서버 내부 오류가 발생했습니다.';
      sendError(res, message, statusCode);
    });

    const res = await request(testApp).get('/custom-error');
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('커스텀 에러');
  });

  // 6. express.json() 동작: POST 요청에 JSON body 파싱
  test('express.json() 동작 - POST JSON body 파싱', async () => {
    const { default: express } = await import('express');

    const testApp = express();
    testApp.use(express.json());
    testApp.post('/echo', (req, res) => {
      res.status(200).json({ success: true, data: req.body });
    });

    const payload = { title: '테스트 할일', done: false };
    const res = await request(testApp)
      .post('/echo')
      .set('Content-Type', 'application/json')
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(payload);
  });
});
