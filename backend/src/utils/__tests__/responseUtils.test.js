import { jest } from '@jest/globals';
import { sendSuccess, sendError } from '../responseUtils.js';

describe('responseUtils', () => {
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('sendSuccess', () => {
    it('기본 statusCode 200으로 { success: true, data }를 반환한다', () => {
      const data = { id: 1, title: '할일 제목' };
      sendSuccess(res, data);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data });
    });

    it('statusCode 201을 지정하면 201로 응답한다', () => {
      const data = { id: 2, title: '새 할일' };
      sendSuccess(res, data, 201);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ success: true, data });
    });

    it('data가 null이어도 정상적으로 응답한다', () => {
      sendSuccess(res, null);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: null });
    });

    it('data가 배열이어도 정상적으로 응답한다', () => {
      const data = [{ id: 1 }, { id: 2 }];
      sendSuccess(res, data);

      expect(res.json).toHaveBeenCalledWith({ success: true, data });
    });
  });

  describe('sendError', () => {
    it('기본 statusCode 500으로 { success: false, message }를 반환한다', () => {
      sendError(res, '서버 오류가 발생했습니다.');

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: '서버 오류가 발생했습니다.' });
    });

    it('statusCode 400을 지정하면 400으로 응답한다', () => {
      sendError(res, '잘못된 요청입니다.', 400);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: '잘못된 요청입니다.' });
    });

    it('statusCode 401을 지정하면 401로 응답한다', () => {
      sendError(res, '인증이 필요합니다.', 401);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: '인증이 필요합니다.' });
    });

    it('statusCode 404를 지정하면 404로 응답한다', () => {
      sendError(res, '리소스를 찾을 수 없습니다.', 404);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: '리소스를 찾을 수 없습니다.' });
    });
  });
});
