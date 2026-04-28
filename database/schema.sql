-- =============================================================
-- TodoList Application — Database Schema
-- 참조: docs/6-erd.md
-- =============================================================

-- -------------------------------------------------------------
-- 1. USER 테이블
-- -------------------------------------------------------------
CREATE TABLE "user" (
    id            SERIAL          PRIMARY KEY,
    email         VARCHAR(255)    NOT NULL UNIQUE,
    password_hash VARCHAR(255)    NOT NULL,
    created_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------
-- 2. CATEGORY 테이블
-- -------------------------------------------------------------
CREATE TABLE category (
    id         SERIAL          PRIMARY KEY,
    user_id    INTEGER         NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    name       VARCHAR(20)     NOT NULL,
    created_at TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_category_user_name UNIQUE (user_id, name)
);

-- -------------------------------------------------------------
-- 3. TODO 테이블
-- -------------------------------------------------------------
CREATE TABLE todo (
    id           SERIAL          PRIMARY KEY,
    user_id      INTEGER         NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    category_id  INTEGER         REFERENCES category(id) ON DELETE SET NULL,
    title        VARCHAR(100)    NOT NULL,
    description  VARCHAR(500),
    due_date     TIMESTAMPTZ,
    is_completed BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------
-- 4. 인덱스
-- -------------------------------------------------------------
-- 사용자별 할일 목록 조회 성능
CREATE INDEX idx_todo_user_id        ON todo (user_id);

-- 카테고리별 할일 필터링 성능 (FR-T06)
CREATE INDEX idx_todo_category_id    ON todo (category_id);

-- 상태 필터 및 기한 초과 판별 성능 (FR-T07, FR-T08)
CREATE INDEX idx_todo_status         ON todo (user_id, is_completed, due_date);

-- 카테고리 소유자별 조회 성능
CREATE INDEX idx_category_user_id    ON category (user_id);
