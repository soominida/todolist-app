-- 명명규칙: YYYYMMDDHHMMSS_<설명>.sql

-- =============================================================
-- UP
-- =============================================================

CREATE TABLE "user" (
    id            SERIAL          PRIMARY KEY,
    email         VARCHAR(255)    NOT NULL UNIQUE,
    password_hash VARCHAR(255)    NOT NULL,
    created_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE TABLE category (
    id         SERIAL          PRIMARY KEY,
    user_id    INTEGER         NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    name       VARCHAR(20)     NOT NULL,
    created_at TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_category_user_name UNIQUE (user_id, name)
);

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

CREATE INDEX idx_todo_user_id     ON todo (user_id);
CREATE INDEX idx_todo_category_id ON todo (category_id);
CREATE INDEX idx_todo_status      ON todo (user_id, is_completed, due_date);
CREATE INDEX idx_category_user_id ON category (user_id);

-- =============================================================
-- DOWN
-- =============================================================

-- DROP TABLE IF EXISTS todo;
-- DROP TABLE IF EXISTS category;
-- DROP TABLE IF EXISTS "user";

-- 실행: psql -U todolist_user -d todolist_db -f 20260428120000_initial_schema.sql
