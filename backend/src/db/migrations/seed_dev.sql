-- 개발 환경 전용 시드 데이터. 운영 환경에서 절대 실행 금지.
-- 실행: psql -U todolist_user -d todolist_db -f seed_dev.sql

INSERT INTO "user" (email, password_hash)
VALUES ('dev@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/Y9Z.LZYou');

INSERT INTO category (user_id, name)
VALUES
  (1, '업무'),
  (1, '개인');

INSERT INTO todo (user_id, category_id, title, description, due_date, is_completed)
VALUES
  (1, 1, '보고서 제출', '월간 업무 보고서 작성 및 제출', '2026-05-10 09:00:00+00', TRUE),
  (1, 2, '운동하기', '헬스장 방문 및 유산소 30분', '2026-06-01 07:00:00+00', FALSE),
  (1, 1, '프로젝트 마감', '클라이언트 납품 기한 초과된 작업', '2026-03-01 09:00:00+00', FALSE),
  (1, NULL, '아이디어 메모', '다음 프로젝트 아이디어 정리', NULL, FALSE),
  (1, 2, '책 읽기', '이번 달 목표 도서 완독', NULL, FALSE);
