import bcrypt from 'bcrypt';
import { findUserByEmail, findUserById, createUser } from '../db/queries/userQueries.js';
import { signToken } from '../utils/jwtUtils.js';
import { logger } from '../utils/logger.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

function validateEmail(email) {
  if (!EMAIL_REGEX.test(email)) {
    const err = new Error('올바른 이메일 형식이 아닙니다.');
    err.statusCode = 400;
    throw err;
  }
}

function validatePassword(password) {
  if (!PASSWORD_REGEX.test(password)) {
    const err = new Error('비밀번호는 8자 이상이며 영문과 숫자를 포함해야 합니다.');
    err.statusCode = 400;
    throw err;
  }
}

export async function register(email, password) {
  validateEmail(email);
  validatePassword(password);

  const existing = await findUserByEmail(email);
  if (existing) {
    const err = new Error('이미 사용 중인 이메일입니다.');
    err.statusCode = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await createUser(email, passwordHash);
  const token = signToken({ id: user.id });

  logger.info(`AUTH 회원가입 - userId:${user.id} email:${email}`);
  return { token, user: { id: user.id, email: user.email, createdAt: user.created_at } };
}

export async function login(email, password) {
  const user = await findUserByEmail(email);
  if (!user) {
    const err = new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    err.statusCode = 401;
    throw err;
  }

  // findUserByEmail이 password_hash를 반환하지 않으므로 별도 쿼리 필요
  // pool을 직접 쓰지 않고 password_hash 포함 쿼리를 위해 내부 함수 사용
  const fullUser = await findUserWithHash(email);
  const match = await bcrypt.compare(password, fullUser.password_hash);
  if (!match) {
    const err = new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    err.statusCode = 401;
    throw err;
  }

  const token = signToken({ id: user.id });
  logger.info(`AUTH 로그인 - userId:${user.id} email:${email}`);
  return { token, user: { id: user.id, email: user.email, createdAt: user.created_at } };
}

export async function getMe(userId) {
  const user = await findUserById(userId);
  if (!user) {
    const err = new Error('사용자를 찾을 수 없습니다.');
    err.statusCode = 404;
    throw err;
  }
  return { user: { id: user.id, email: user.email, createdAt: user.created_at } };
}

// password_hash 포함 조회 (login 내부 전용)
async function findUserWithHash(email) {
  const { default: pool } = await import('../db/pool.js');
  const { rows } = await pool.query(
    'SELECT id, email, password_hash, created_at FROM "user" WHERE email = $1',
    [email]
  );
  return rows[0] ?? null;
}
