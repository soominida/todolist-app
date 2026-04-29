/**
 * 성공 응답 전송
 * @param {import('express').Response} res - Express 응답 객체
 * @param {*} data - 응답 데이터
 * @param {number} [statusCode=200] - HTTP 상태 코드
 */
export function sendSuccess(res, data, statusCode = 200) {
  res.status(statusCode).json({ success: true, data });
}

/**
 * 에러 응답 전송
 * @param {import('express').Response} res - Express 응답 객체
 * @param {string} message - 에러 메시지
 * @param {number} [statusCode=500] - HTTP 상태 코드
 */
export function sendError(res, message, statusCode = 500) {
  res.status(statusCode).json({ success: false, message });
}
