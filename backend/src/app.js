import express from 'express';
import cors from 'cors';
import { createRequire } from 'module';
import swaggerUi from 'swagger-ui-express';
import { sendError } from './utils/responseUtils.js';
import { logger } from './utils/logger.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import todoRoutes from './routes/todoRoutes.js';

const require = createRequire(import.meta.url);
const swaggerDocument = require('../../swagger/swagger.json');

if (!process.env.CORS_ORIGIN) {
  logger.warn('CORS_ORIGIN 환경변수가 설정되지 않았습니다. CORS가 비활성화됩니다.');
}

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN }));

// 요청/응답 로거
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} (${ms}ms)`);
  });
  next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/todos', todoRoutes);

// 404 핸들러
app.use((_req, res) => {
  sendError(res, '요청한 리소스를 찾을 수 없습니다.', 404);
});

// 전역 에러 핸들러
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  const statusCode = err.statusCode ?? 500;
  const message = err.message || '서버 내부 오류가 발생했습니다.';

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} ${statusCode} - ${message}`);
    if (process.env.NODE_ENV !== 'production') {
      console.error(err.stack);
    }
  }

  sendError(res, message, statusCode);
});

export default app;
