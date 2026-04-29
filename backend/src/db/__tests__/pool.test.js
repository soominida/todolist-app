/** @jest-environment node */

import { execSync } from 'child_process';

const DB_URL = 'postgresql://todolist_user:todolist1234@localhost:5432/todolist_db';
const POOL_PATH = '/Users/soomin/_vibe/todolist-app/backend/src/db/pool.js';

// ------------------------------------------------------------------
// 테스트 1: 환경변수 누락 시 process.exit(1) 호출
// 별도 Node 프로세스를 실행하여 격리된 환경에서 검증
// ------------------------------------------------------------------
describe('환경변수 누락 시 프로세스 종료', () => {
  test('POSTGRES_CONNECTION_STRING 미설정 시 종료 코드가 1이다', () => {
    let exitCode;
    try {
      execSync(
        `node --input-type=module -e "import '${POOL_PATH}'"`,
        {
          // PATH만 전달해 POSTGRES_CONNECTION_STRING 없는 환경 재현
          env: { PATH: process.env.PATH },
          stdio: 'pipe',
        }
      );
      exitCode = 0;
    } catch (err) {
      exitCode = err.status;
    }
    expect(exitCode).toBe(1);
  });
});

// ------------------------------------------------------------------
// 테스트 2~4: 실제 DB 연결 필요 — afterAll에서 pool 종료
// ESM 모듈 캐시 덕분에 import를 여러 번 해도 동일 인스턴스
// ------------------------------------------------------------------
describe('pool 인스턴스 (실제 DB 연결)', () => {
  let pool;
  let testConnection;

  beforeAll(async () => {
    process.env.POSTGRES_CONNECTION_STRING = DB_URL;
    const mod = await import(POOL_PATH);
    pool = mod.default;
    testConnection = mod.testConnection;
  });

  afterAll(async () => {
    if (pool) await pool.end();
  });

  // 테스트 2: Pool 싱글턴 확인
  test('같은 경로를 두 번 import해도 동일한 pool 인스턴스를 반환한다', async () => {
    const mod1 = await import(POOL_PATH);
    const mod2 = await import(POOL_PATH);
    expect(mod1.default).toBe(mod2.default);
  });

  // 테스트 3: testConnection 성공
  test('testConnection()이 예외 없이 완료된다', async () => {
    await expect(testConnection()).resolves.toBeUndefined();
  });

  // 테스트 4: pool.on('error') 핸들러 등록 확인
  test('pool 인스턴스에 error 이벤트 리스너가 등록되어 있다', () => {
    const listeners = pool.listeners('error');
    expect(listeners.length).toBeGreaterThan(0);
  });
});
