import { jest } from '@jest/globals';

const { errorMiddleware } = await import('../errorMiddleware.js');

const mockReq = () => ({});

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('errorMiddleware', () => {
  let mockNext;

  beforeEach(() => {
    mockNext = jest.fn();
  });

  test('statusCode 있는 에러 → 해당 statusCode 반환', () => {
    const err = new Error('찾을 수 없습니다.');
    err.statusCode = 404;

    const req = mockReq();
    const res = mockRes();

    errorMiddleware(err, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: '찾을 수 없습니다.',
      })
    );
  });

  test('statusCode 없는 에러 → 500 반환', () => {
    const err = new Error('예상치 못한 오류');

    const req = mockReq();
    const res = mockRes();

    errorMiddleware(err, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: '예상치 못한 오류',
      })
    );
  });

  test('message 없는 에러 → 기본 메시지 "서버 오류가 발생했습니다." 반환', () => {
    const err = {};

    const req = mockReq();
    const res = mockRes();

    errorMiddleware(err, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: '서버 오류가 발생했습니다.',
      })
    );
  });

  test('NODE_ENV=production 시 stack 미포함 → 정상 응답', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const err = new Error('운영 서버 에러');
    err.statusCode = 500;

    const req = mockReq();
    const res = mockRes();

    errorMiddleware(err, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
    // stack이 응답에 포함되지 않음
    const jsonArg = res.json.mock.calls[0][0];
    expect(jsonArg.stack).toBeUndefined();

    process.env.NODE_ENV = originalEnv;
  });

  test('NODE_ENV=development 시 정상 응답', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const err = new Error('개발 서버 에러');
    err.statusCode = 400;

    const req = mockReq();
    const res = mockRes();

    errorMiddleware(err, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: '개발 서버 에러',
      })
    );

    process.env.NODE_ENV = originalEnv;
  });
});
