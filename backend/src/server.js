import 'dotenv/config';
import app from './app.js';
import { testConnection } from './db/pool.js';
import pool from './db/pool.js';
import { logger } from './utils/logger.js';

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await testConnection();
    logger.info('데이터베이스 연결 성공');
  } catch (err) {
    logger.error(`데이터베이스 연결 실패: ${err.message}`);
    process.exit(1);
  }

  const server = app.listen(PORT, () => {
    logger.info(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  });

  // Graceful shutdown
  const shutdown = async (signal) => {
    logger.info(`${signal} 수신. 서버를 종료합니다.`);
    server.close(async () => {
      try {
        await pool.end();
        logger.info('데이터베이스 연결 풀 종료 완료');
      } catch (err) {
        logger.error(`연결 풀 종료 오류: ${err.message}`);
      }
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  return server;
}

const server = await startServer();

export default server;
