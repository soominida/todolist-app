import { jest } from '@jest/globals';

jest.unstable_mockModule('../../db/queries/todoQueries.js', () => ({
  findTodosByUserId: jest.fn(),
  findTodoById: jest.fn(),
  createTodo: jest.fn(),
  updateTodo: jest.fn(),
  deleteTodo: jest.fn(),
  toggleComplete: jest.fn(),
}));

const {
  findTodosByUserId,
  findTodoById,
  createTodo: dbCreateTodo,
  updateTodo: dbUpdateTodo,
  deleteTodo: dbDeleteTodo,
  toggleComplete: dbToggleComplete,
} = await import('../../db/queries/todoQueries.js');

const {
  listTodos,
  createTodo,
  updateTodo,
  toggleComplete,
  deleteTodo,
} = await import('../todoService.js');

const makeTodo = (overrides = {}) => ({
  id: 1,
  user_id: 1,
  title: '테스트 할일',
  description: null,
  category_id: null,
  due_date: null,
  is_completed: false,
  created_at: new Date(),
  updated_at: new Date(),
  ...overrides,
});

describe('todoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listTodos', () => {
    it('할일 목록에 status 필드가 추가된다', async () => {
      const past = new Date(Date.now() - 86400000);
      const todos = [
        makeTodo({ is_completed: true }),
        makeTodo({ id: 2, is_completed: false, due_date: past }),
        makeTodo({ id: 3, is_completed: false, due_date: null }),
      ];
      findTodosByUserId.mockResolvedValue(todos);
      const result = await listTodos(1, {});
      expect(result[0].status).toBe('completed');
      expect(result[1].status).toBe('overdue');
      expect(result[2].status).toBe('pending');
    });
  });

  describe('createTodo', () => {
    it('정상 생성 시 status 포함 todo를 반환한다', async () => {
      const todo = makeTodo();
      dbCreateTodo.mockResolvedValue(todo);
      const result = await createTodo(1, { title: '테스트 할일' });
      expect(result.status).toBe('pending');
      expect(result.title).toBe('테스트 할일');
    });

    it('title이 100자 초과면 statusCode 400을 던진다', async () => {
      await expect(createTodo(1, { title: 'a'.repeat(101) })).rejects.toMatchObject({ statusCode: 400 });
    });

    it('title이 빈 문자열이면 statusCode 400을 던진다', async () => {
      await expect(createTodo(1, { title: '' })).rejects.toMatchObject({ statusCode: 400 });
    });

    it('title이 없으면 statusCode 400을 던진다', async () => {
      await expect(createTodo(1, {})).rejects.toMatchObject({ statusCode: 400 });
    });
  });

  describe('updateTodo', () => {
    it('정상 수정 시 status 포함 todo를 반환한다', async () => {
      const todo = makeTodo();
      findTodoById.mockResolvedValue(todo);
      dbUpdateTodo.mockResolvedValue({ ...todo, title: '수정됨' });
      const result = await updateTodo(1, 1, { title: '수정됨' });
      expect(result.title).toBe('수정됨');
      expect(result.status).toBe('pending');
    });

    it('존재하지 않는 todo면 statusCode 404를 던진다', async () => {
      findTodoById.mockResolvedValue(null);
      await expect(updateTodo(999, 1, { title: '수정' })).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('toggleComplete', () => {
    it('정상 토글 시 status 포함 todo를 반환한다', async () => {
      const todo = makeTodo();
      findTodoById.mockResolvedValue(todo);
      dbToggleComplete.mockResolvedValue({ ...todo, is_completed: true });
      const result = await toggleComplete(1, 1);
      expect(result.status).toBe('completed');
    });

    it('존재하지 않는 todo면 statusCode 404를 던진다', async () => {
      findTodoById.mockResolvedValue(null);
      await expect(toggleComplete(999, 1)).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('deleteTodo', () => {
    it('정상 삭제 시 에러 없이 완료된다', async () => {
      findTodoById.mockResolvedValue(makeTodo());
      dbDeleteTodo.mockResolvedValue(true);
      await expect(deleteTodo(1, 1)).resolves.toBeUndefined();
    });

    it('존재하지 않는 todo면 statusCode 404를 던진다', async () => {
      findTodoById.mockResolvedValue(null);
      await expect(deleteTodo(999, 1)).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
