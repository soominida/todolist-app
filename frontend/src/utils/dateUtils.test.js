import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getTodoStatus, formatDate, isOverdue } from './dateUtils';

const FIXED_NOW = new Date('2024-06-15T12:00:00.000Z');
const PAST_DATE = '2024-01-01T00:00:00.000Z';
const FUTURE_DATE = '2025-12-31T00:00:00.000Z';

describe('dateUtils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getTodoStatus', () => {
    it('isCompleted가 true이면 completed를 반환한다', () => {
      expect(getTodoStatus({ isCompleted: true, dueDate: null })).toBe('completed');
    });

    it('isCompleted가 true이면 과거 dueDate여도 completed를 반환한다', () => {
      expect(getTodoStatus({ isCompleted: true, dueDate: PAST_DATE })).toBe('completed');
    });

    it('dueDate가 없으면 pending을 반환한다', () => {
      expect(getTodoStatus({ isCompleted: false, dueDate: null })).toBe('pending');
    });

    it('dueDate가 과거이면 overdue를 반환한다', () => {
      expect(getTodoStatus({ isCompleted: false, dueDate: PAST_DATE })).toBe('overdue');
    });

    it('dueDate가 미래이면 pending을 반환한다', () => {
      expect(getTodoStatus({ isCompleted: false, dueDate: FUTURE_DATE })).toBe('pending');
    });
  });

  describe('formatDate', () => {
    it('날짜 문자열을 한국어 형식으로 반환한다', () => {
      const result = formatDate('2024-01-15');
      expect(result).toBe('2024년 1월 15일');
    });

    it('null이면 빈 문자열을 반환한다', () => {
      expect(formatDate(null)).toBe('');
    });

    it('undefined이면 빈 문자열을 반환한다', () => {
      expect(formatDate(undefined)).toBe('');
    });
  });

  describe('isOverdue', () => {
    it('과거 날짜이면 true를 반환한다', () => {
      expect(isOverdue(PAST_DATE)).toBe(true);
    });

    it('미래 날짜이면 false를 반환한다', () => {
      expect(isOverdue(FUTURE_DATE)).toBe(false);
    });

    it('null이면 false를 반환한다', () => {
      expect(isOverdue(null)).toBe(false);
    });
  });
});
