# 실행 계획 — TodoList 개인 할일 관리 애플리케이션

> 작성일: 2026-04-28
> 참조: [도메인 정의서](./1-domain-definition.md) · [PRD](./2-prd.md) · [사용자 시나리오](./3-user-scenario.md) · [프로젝트 구조](./4-project-structure.md) · [아키텍처](./5-arch-diagram.md) · [ERD](./6-erd.md)

---

## 변경 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|---|---|---|---|
| v0.1 | 2026-04-28 | soominlee | 최초 작성 (DB / 백엔드 / 프론트엔드 병렬 분석) |

---

## Task 현황 요약

| 영역 | Task 범위 | Task 수 |
|---|---|---|
| 데이터베이스 (DB) | DB-01 ~ DB-08 | 8개 |
| 백엔드 (BE) | BE-01 ~ BE-09 | 9개 |
| 프론트엔드 (FE) | FE-01 ~ FE-18 | 18개 |
| **합계** | | **35개** |

---

## 전체 Task 목록

| 영역 | Task ID | 작업명 | 의존성 |
|---|---|---|---|
| DB | DB-01 | PostgreSQL 환경 준비 및 DB·유저 생성 | — |
| DB | DB-02 | 마이그레이션 디렉토리 구조 및 전략 수립 | DB-01 |
| DB | DB-03 | 테이블 생성 (schema.sql 적용) | DB-01, DB-02 |
| DB | DB-04 | 인덱스 생성 및 검증 | DB-03 |
| DB | DB-05 | pg Pool 연결 설정 | DB-01, DB-03 |
| DB | DB-06 | 도메인별 쿼리 함수 파일 뼈대 생성 | DB-03, DB-05 |
| DB | DB-07 | 시드 데이터 작성 (개발 환경용) | DB-03 |
| DB | DB-08 | 테스트 환경 DB 격리 설정 | DB-01, DB-05 |
| BE | BE-01 | 프로젝트 초기화 | — |
| BE | BE-02 | pg Pool 및 마이그레이션 파일 설정 | BE-01 |
| BE | BE-03 | 공통 유틸리티 및 상수 설정 | BE-01 |
| BE | BE-04 | Express 앱 및 서버 진입점 설정 | BE-01, BE-02, BE-03 |
| BE | BE-05 | 공통 미들웨어 (authMiddleware, errorMiddleware) | BE-03, BE-04 |
| BE | BE-06 | 인증 도메인 구현 (회원가입 / 로그인) | BE-02, BE-03, BE-05 |
| BE | BE-07 | 카테고리 도메인 구현 (CRUD) | BE-02, BE-03, BE-05 |
| BE | BE-08 | 할일 도메인 구현 (CRUD + 필터) | BE-02, BE-03, BE-05, BE-07 |
| BE | BE-09 | 서비스 레이어 단위 테스트 | BE-06, BE-07, BE-08 |
| FE | FE-01 | 프로젝트 초기화 및 빌드 환경 구성 | — |
| FE | FE-02 | 공통 인프라 설정 (QueryClient, 라우터, API 클라이언트) | FE-01 |
| FE | FE-03 | 전역 인증 상태 관리 (authStore) | FE-01 |
| FE | FE-04 | 인증 API 연동 (authApi) | FE-02, FE-03 |
| FE | FE-05 | 인증 커스텀 훅 (useAuth) | FE-03, FE-04 |
| FE | FE-06 | 로그인 페이지 구현 | FE-05 |
| FE | FE-07 | 회원가입 페이지 구현 | FE-05, FE-06 |
| FE | FE-08 | 카테고리 API 연동 (categoriesApi) | FE-02 |
| FE | FE-09 | 카테고리 커스텀 훅 (useCategories) | FE-08 |
| FE | FE-10 | 카테고리 관리 UI 컴포넌트 | FE-09 |
| FE | FE-11 | 할일 API 연동 (todosApi) | FE-02 |
| FE | FE-12 | 할일 커스텀 훅 (useTodos) | FE-11 |
| FE | FE-13 | 날짜·상태 계산 유틸 (dateUtils) | FE-01 |
| FE | FE-14 | 필터링 상태 관리 및 필터 UI | FE-09, FE-12 |
| FE | FE-15 | 할일 목록 UI 컴포넌트 | FE-12, FE-13 |
| FE | FE-16 | 할일 생성/수정 폼 컴포넌트 | FE-09, FE-12 |
| FE | FE-17 | 할일 삭제 확인 다이얼로그 | FE-12 |
| FE | FE-18 | 메인 TodoPage 조합 및 레이아웃 | FE-14, FE-15, FE-16, FE-17 |

---

## 데이터베이스 (DB)

---

### DB-01. PostgreSQL 환경 준비 및 DB·유저 생성

**의존성:** 없음

**상세 작업 내용**
- 전용 Role 생성: `CREATE ROLE todolist_user WITH LOGIN PASSWORD '...'`
- DB 생성: `todolist_db` (UTF-8, 소유자: todolist_user)
- 최소 권한 부여 (CONNECT, USAGE, CREATE on public schema)
- `.env` 파일에 접속 정보 기록 (`.gitignore` 포함, `.env.example`만 커밋)
- 테스트용 `todolist_test_db` 별도 생성

**완료 조건**
- [x] `todolist_user` Role이 생성되어 로그인 가능하다
- [x] `todolist_db`가 UTF-8 인코딩으로 존재한다
- [x] `todolist_user`는 superuser가 아니며 최소 권한만 부여되어 있다
- [x] `todolist_test_db`가 별도로 생성되어 있다
- [x] `.env`가 `.gitignore`에 포함되고 `.env.example`만 레포에 존재한다
- [x] `psql -U todolist_user -d todolist_db` 접속이 성공한다

---

### DB-02. 마이그레이션 디렉토리 구조 및 전략 수립

**의존성:** DB-01

**상세 작업 내용**
- 파일 명명 규칙: `YYYYMMDDHHMMSS_<설명>.sql`
- `backend/src/db/migrations/` 디렉토리 생성
- `database/schema.sql` 내용을 `20260428120000_initial_schema.sql`로 복사 (UP/DOWN 섹션 포함)
- 수동 실행 방식 채택 (Phase 1 MVP 기준)

**완료 조건**
- [x] `backend/src/db/migrations/` 디렉토리가 존재한다
- [x] `20260428120000_initial_schema.sql`이 UP/DOWN 섹션을 포함하여 존재한다
- [x] 파일 명명 규칙이 디렉토리 내 README 또는 주석으로 기술되어 있다
- [x] 수동 실행 절차가 문서화되어 있다

---

### DB-03. 테이블 생성 (schema.sql 적용)

**의존성:** DB-01, DB-02

**상세 작업 내용**
- `todolist_db`에 마이그레이션 파일 실행
- 테이블 3개 (`"user"`, `category`, `todo`) 및 인덱스 4개 생성 확인
- 제약조건 동작 수동 검증 (UNIQUE, CASCADE, SET NULL)
- `todo.updated_at` 자동 갱신 방법 확정 (트리거 또는 쿼리 명시)
- `todolist_test_db`에도 동일 스키마 적용

**완료 조건**
- [x] `todolist_db`에 `"user"`, `category`, `todo` 테이블이 모두 존재한다
- [x] PK, NOT NULL, UNIQUE, FK 제약조건이 ERD 명세와 일치한다
- [x] CATEGORY 삭제 시 TODO의 `category_id`가 NULL로 변경된다
- [x] USER 삭제 시 CATEGORY, TODO가 CASCADE 삭제된다
- [x] `updated_at` 자동 갱신 방법이 팀 컨벤션으로 결정되어 있다 (UPDATE 쿼리에 updated_at=NOW() 명시)
- [x] `todolist_test_db`에도 동일 스키마가 적용되어 있다

---

### DB-04. 인덱스 생성 및 검증

**의존성:** DB-03

**상세 작업 내용**
- 4개 인덱스 생성 확인: `idx_todo_user_id`, `idx_todo_category_id`, `idx_todo_status`, `idx_category_user_id`
- `EXPLAIN ANALYZE`로 대표 쿼리의 Index Scan 사용 여부 확인

**완료 조건**
- [x] 4개 인덱스가 모두 생성되어 있다
- [x] `EXPLAIN ANALYZE` 결과에서 대표 쿼리가 Index Scan을 사용한다
- [x] 인덱스 명명 규칙이 `idx_<테이블>_<컬럼>` 패턴으로 일관된다

---

### DB-05. pg Pool 연결 설정 (`backend/src/db/pool.js`)

**의존성:** DB-01, DB-03

**상세 작업 내용**
- `pg` 패키지 설치
- `pool.js`에 `pg.Pool` 싱글턴 구현 (환경변수 기반, max:10, timeout 설정)
- 필수 환경변수 누락 시 즉시 에러 출력 후 프로세스 종료
- `pool.on('error', ...)` 핸들러 등록
- `testConnection()` 함수 작성 및 서버 기동 시 호출

**완료 조건**
- [x] `pool.js`가 `pg.Pool` 싱글턴을 export한다
- [x] 환경변수 누락 시 명확한 에러 메시지와 함께 프로세스가 종료된다
- [x] `pool.on('error', ...)` 핸들러가 등록되어 있다
- [x] `testConnection()` 실행이 성공한다

---

### DB-06. 도메인별 쿼리 함수 파일 뼈대 생성

**의존성:** DB-03, DB-05

**상세 작업 내용**
- `userQueries.js`: `findUserByEmail`, `createUser`
- `categoryQueries.js`: `findCategoriesByUserId`, `findCategoryById`, `createCategory`, `updateCategory`, `deleteCategory`
- `todoQueries.js`: `findTodosByUserId`, `findTodoById`, `createTodo`, `updateTodo`, `deleteTodo`, `toggleComplete`
- 모든 쿼리에 `user_id` WHERE 조건 포함 (P-27)
- Parameterized Query (`$1`, `$2`) 사용

**완료 조건**
- [x] 3개 쿼리 파일이 존재하고 SQL 실행 함수만 포함한다
- [x] 모든 SELECT/UPDATE/DELETE에 `user_id` WHERE 조건이 포함되어 있다
- [x] 모든 쿼리가 Parameterized Query를 사용한다
- [x] UPDATE 함수에 `updated_at = NOW()`가 포함되어 있다

---

### DB-07. 시드 데이터 작성 (개발 환경용)

**의존성:** DB-03

**상세 작업 내용**
- `backend/src/db/migrations/seed_dev.sql` 작성
- 3가지 상태(완료/미완료/기한초과) 대표 할일 포함
- 비밀번호는 bcrypt hash로 저장
- 미분류(`category_id = NULL`) 할일 최소 1개 포함

**완료 조건**
- [x] `seed_dev.sql`이 3가지 상태의 대표 TODO를 포함한다
- [x] 비밀번호가 bcrypt hash로 저장되어 있다
- [x] 미분류 할일이 최소 1개 포함되어 있다
- [x] 시드 실행 방법이 문서화되어 있다
- [x] 운영 환경 실행 방지 주석이 파일 상단에 명시되어 있다

---

### DB-08. 테스트 환경 DB 격리 설정

**의존성:** DB-01, DB-05

**상세 작업 내용**
- `backend/.env.test` 작성 (`todolist_test_db` 연결)
- `NODE_ENV=test` 시 `.env.test` 로드
- `clearDatabase()` 유틸 함수 작성 (TRUNCATE + RESTART IDENTITY CASCADE)

**완료 조건**
- [x] `backend/.env.test`가 `todolist_test_db`를 바라보도록 설정되어 있다
- [x] `NODE_ENV=test` 시 테스트 DB에 연결된다
- [x] `clearDatabase()` 함수가 존재하고 테스트 전 데이터를 초기화한다
- [x] `.env.test`가 `.gitignore`에 포함되어 있다

---

## 백엔드 (BE)

---

### BE-01. 프로젝트 초기화

**의존성:** 없음

**상세 작업 내용**
- `backend/package.json` 생성: `"type": "module"`, `"engines": { "node": ">=24" }`
- 의존성 설치: `express@5`, `pg`, `jsonwebtoken`, `bcrypt`, `cors`, `dotenv`
- 개발 의존성: `eslint`, `prettier`, `nodemon`, `jest`
- `.eslintrc.cjs`, `.prettierrc`, `.env.example`, `.gitignore` 작성
- npm scripts: `start`, `dev`, `lint`, `format`, `test`

**완료 조건**
- [ ] `npm install` 후 의존성 오류가 없다
- [ ] `npm run lint` 실행 시 설정 파일 파싱 오류가 없다
- [ ] `.env`가 `.gitignore`에 포함되어 있다
- [ ] `.env.example`에 필요한 환경변수 키가 모두 정의되어 있다

---

### BE-02. pg Pool 및 마이그레이션 파일 설정

**의존성:** BE-01

**상세 작업 내용**
- `backend/src/db/pool.js`: `pg.Pool` 싱글턴 구현
- `backend/src/db/migrations/20260428_init.sql`: DDL 전체 (테이블 3개 + 인덱스)
- `DATABASE_URL` 환경변수 미설정 시 명시적 에러 출력

**완료 조건**
- [ ] 마이그레이션 SQL 실행 시 테이블 3개 및 인덱스 4개가 생성된다
- [ ] `pool.js` import 시 Pool 인스턴스가 단일 참조로 반환된다
- [ ] 환경변수 미설정 시 에러 메시지가 출력된다

---

### BE-03. 공통 유틸리티 및 상수 설정

**의존성:** BE-01

**상세 작업 내용**
- `src/utils/jwtUtils.js`: `signToken(payload)`, `verifyToken(token)` (HS-512, 환경변수 기반)
- `src/utils/responseUtils.js`: `sendSuccess(res, data, statusCode)`, `sendError(res, message, statusCode)`
- `src/constants/index.js`: `MAX_TITLE_LENGTH`, `MAX_DESC_LENGTH`, `MAX_CATEGORY_NAME_LENGTH`, `TODO_STATUS`, `HTTP_STATUS`

**완료 조건**
- [ ] `signToken` / `verifyToken` 단위 테스트가 통과한다 (정상 발급, 만료, 잘못된 시크릿)
- [ ] `sendSuccess` / `sendError`가 지정된 JSON 구조로 응답한다
- [ ] 상수 파일의 모든 값이 `UPPER_SNAKE_CASE`로 선언되어 있다

---

### BE-04. Express 앱 및 서버 진입점 설정

**의존성:** BE-01, BE-02, BE-03

**상세 작업 내용**
- `src/app.js`: `express.json()`, CORS (와일드카드 금지), 요청 로거, 라우트 마운트, 404 핸들러, 전역 에러 핸들러
- `server.js`: `app.listen()`, graceful shutdown (`SIGTERM` / `SIGINT`)

**완료 조건**
- [ ] `npm run dev` 실행 시 서버가 정상 기동된다
- [ ] `GET /api/nonexistent` 요청 시 404 JSON 응답이 반환된다
- [ ] CORS 오리진 미설정 시 서버가 경고를 출력하거나 기동을 중단한다

---

### BE-05. 공통 미들웨어 구현

**의존성:** BE-03, BE-04

**상세 작업 내용**
- `src/middlewares/authMiddleware.js`: `Authorization: Bearer <token>` 파싱 → `verifyToken()` → `req.user = { id }` 주입
- `src/middlewares/errorMiddleware.js`: 4인수 에러 핸들러, `statusCode` 기반 응답, 운영 환경 스택 트레이스 미노출

**완료 조건**
- [ ] 토큰 없는 요청 → 401 응답
- [ ] 만료된 토큰 요청 → 401 응답
- [ ] 유효한 토큰 요청 → `req.user.id`에 사용자 ID가 주입된다
- [ ] 서비스 레이어에서 throw된 에러가 JSON으로 응답된다

---

### BE-06. 인증 도메인 구현 (회원가입 / 로그인)

**의존성:** BE-02, BE-03, BE-05

**상세 작업 내용**
- `db/queries/userQueries.js`: `findUserByEmail`, `createUser`
- `services/authService.js`: `register(email, password)`, `login(email, password)` (bcrypt 해싱, JWT 발급)
- `controllers/authController.js`: `register`, `login`, `getMe`
- `routes/authRoutes.js`: `POST /register`, `POST /login`, `GET /me`, `POST /logout`

**완료 조건**
- [ ] `POST /api/auth/register` 성공 시 201 반환
- [ ] 중복 이메일 가입 시 409 반환
- [ ] `POST /api/auth/login` 성공 시 JWT 토큰 반환
- [ ] 잘못된 비밀번호 로그인 시 401 반환
- [ ] `GET /api/auth/me` 성공 시 사용자 이메일 반환
- [ ] 비밀번호가 DB에 bcrypt hash로 저장된다

---

### BE-07. 카테고리 도메인 구현 (CRUD)

**의존성:** BE-02, BE-03, BE-05

**상세 작업 내용**
- `db/queries/categoryQueries.js`: `findCategoriesByUserId`, `findCategoryById`, `createCategory`, `updateCategory`, `deleteCategory`
- `services/categoryService.js`: `listCategories`, `createCategory` (이름 유효성, 중복 409), `updateCategory`, `deleteCategory`
- `controllers/categoryController.js`: `list`, `create`, `update`, `remove`
- `routes/categoryRoutes.js`: 전체 라우트에 `authMiddleware` 적용

**완료 조건**
- [ ] `GET /api/categories` 시 본인 카테고리 목록만 반환된다
- [ ] 이름 20자 초과 시 400 반환
- [ ] 동일 사용자 내 중복 이름 생성 시 409 반환
- [ ] 타인 카테고리 수정/삭제 시 404 반환
- [ ] 카테고리 삭제 후 소속 할일의 `category_id`가 NULL로 변경된다

---

### BE-08. 할일 도메인 구현 (CRUD + 필터)

**의존성:** BE-02, BE-03, BE-05, BE-07

**상세 작업 내용**
- `db/queries/todoQueries.js`: 동적 필터(`status`, `categoryId`) SQL 생성, 모든 쿼리에 `user_id` 조건 포함
- `services/todoService.js`: `listTodos`, `createTodo`, `updateTodo`, `toggleComplete`, `deleteTodo`
- `controllers/todoController.js`: `list`, `create`, `update`, `toggleComplete`, `remove`
- `routes/todoRoutes.js`: `GET /`, `POST /`, `PUT /:id`, `PATCH /:id/complete`, `DELETE /:id`

**완료 조건**
- [ ] `GET /api/todos` 시 본인 할일 목록만 반환된다
- [ ] `?status=overdue` 필터가 `is_completed=false AND due_date < NOW()` 조건으로 동작한다
- [ ] `?status=pending`, `?status=completed` 필터가 정상 동작한다
- [ ] `?categoryId=1` 필터가 정상 동작한다
- [ ] 두 필터 동시 적용이 정상 동작한다
- [ ] `POST /api/todos` title 100자 초과 시 400 반환
- [ ] `DELETE /api/todos/:id` 시 204 반환 및 DB에서 영구 삭제된다
- [ ] 타인 할일 수정/삭제 시 404 반환
- [ ] 모든 쿼리가 Parameterized Query로 SQL Injection을 방지한다

---

### BE-09. 서비스 레이어 단위 테스트

**의존성:** BE-06, BE-07, BE-08

**상세 작업 내용**
- `authService.test.js`: 정상 가입/로그인, 중복 이메일, 비밀번호 형식 오류, 잘못된 자격증명
- `categoryService.test.js`: 정상 CRUD, 이름 초과, 중복명, 소유권 없는 접근
- `todoService.test.js`: 정상 CRUD, 필터 유효성, title 초과, 타인 카테고리 사용, 소유권 없는 접근
- DB 쿼리 함수는 mock으로 대체 (실제 DB 불필요)

**완료 조건**
- [ ] `npm test` 실행 시 모든 테스트가 통과한다
- [ ] 서비스 레이어 코드 커버리지 70% 이상을 달성한다
- [ ] 테스트가 실제 DB 또는 네트워크에 의존하지 않는다
- [ ] 각 에러 케이스에서 올바른 HTTP 상태 코드에 해당하는 에러가 throw된다

---

## 프론트엔드 (FE)

---

### FE-01. 프로젝트 초기화 및 빌드 환경 구성

**의존성:** 없음

**상세 작업 내용**
- Vite + React 19 스캐폴딩
- 의존성: `react@19`, `@tanstack/react-query@5`, `zustand@5`, `react-router-dom@7`, `tailwindcss@4`
- `vite.config.js`: `@/` 경로 별칭, `/api` 프록시 설정
- ESLint, Prettier, `.env.example` (`VITE_API_BASE_URL`), `.gitignore` 설정
- `src/constants/index.js`: `MAX_TITLE_LENGTH`, `MAX_DESC_LENGTH`, `MAX_CATEGORY_NAME_LENGTH`

**완료 조건**
- [ ] `npm run dev` 실행 시 Vite 개발 서버가 정상 구동된다
- [ ] `npm run build` 실행 시 오류 없이 빌드된다
- [ ] ESLint/Prettier 기본 규칙이 통과된다
- [ ] `.env`가 `.gitignore`에 포함되어 있다
- [ ] Tailwind 유틸리티 클래스가 빌드 출력에 포함된다

---

### FE-02. 공통 인프라 설정 (QueryClient, 라우터, API 클라이언트)

**의존성:** FE-01

**상세 작업 내용**
- `src/lib/queryClient.js`: `QueryClient` 인스턴스 (retry: 1, staleTime: 60s)
- `src/lib/httpClient.js`: fetch 래퍼 (Authorization 헤더 자동 주입, 4xx/5xx 에러 throw)
- `src/router/index.jsx`: `createBrowserRouter`, `ProtectedRoute` (비인증 시 `/login` 리다이렉트)
- `src/App.jsx`: `QueryClientProvider` + `RouterProvider` 조합
- `src/main.jsx`: `ReactDOM.createRoot` + `StrictMode`

**완료 조건**
- [ ] `QueryClientProvider`가 앱 루트에서 정상 래핑된다
- [ ] 비인증 상태에서 `/` 접근 시 `/login`으로 리다이렉트된다
- [ ] API 호출 시 `Authorization` 헤더가 자동으로 포함된다
- [ ] 401 응답 수신 시 로그인 화면으로 리다이렉트된다

---

### FE-03. 전역 인증 상태 관리 (authStore)

**의존성:** FE-01

**상세 작업 내용**
- `src/store/authStore.js`: `token`, `user`, `isAuthenticated` 상태
- 액션: `setAuth({ token, user })`, `clearAuth()`
- `persist` 미들웨어: `localStorage` 키 `auth-storage`에 영속화

**완료 조건**
- [ ] `setAuth` 호출 후 `localStorage`에 토큰이 저장된다
- [ ] `clearAuth` 호출 후 인증 정보가 제거된다
- [ ] 페이지 새로고침 후 토큰이 복원된다
- [ ] `isAuthenticated`가 token 존재 여부와 일치한다

---

### FE-04. 인증 API 연동 (authApi)

**의존성:** FE-02, FE-03

**상세 작업 내용**
- `src/api/authApi.js`: `register`, `login`, `getMe` (순수 fetch 호출만 담당)

**완료 조건**
- [ ] `register` 함수가 중복 이메일 시 Error를 throw한다
- [ ] `login` 함수가 성공 시 `{ token, user }` 객체를 반환한다
- [ ] `getMe` 함수가 JWT 헤더 포함 요청을 전송한다

---

### FE-05. 인증 커스텀 훅 (useAuth)

**의존성:** FE-03, FE-04

**상세 작업 내용**
- `src/hooks/useAuth.js`: `useLogin()`, `useRegister()`, `useLogout()`
- 로그인 성공 → `authStore.setAuth()` → `/` 이동
- 로그아웃 → `clearAuth()` + `queryClient.clear()` → `/login` 이동

**완료 조건**
- [ ] 로그인 성공 시 authStore에 token이 저장되고 TodoPage로 이동한다
- [ ] 로그인 실패 시 error 객체가 반환된다
- [ ] 로그아웃 시 authStore가 초기화되고 QueryClient 캐시가 제거된다
- [ ] 회원가입 성공 시 `/login`으로 이동한다

---

### FE-06. 로그인 페이지 구현

**의존성:** FE-05

**상세 작업 내용**
- `src/pages/LoginPage.jsx`: `useLogin` 훅, 이메일/비밀번호 폼, 클라이언트 유효성 검사
- 공통 컴포넌트 작성: `Input.jsx`, `Button.jsx`, `FormError.jsx`
- 서버 오류 메시지 렌더링, `/register` 링크, 반응형 레이아웃

**완료 조건**
- [ ] 이메일/비밀번호 입력 후 로그인 버튼 클릭 시 API가 호출된다
- [ ] 이메일 형식 오류 시 클라이언트 오류 메시지가 표시된다
- [ ] 서버 오류(401) 시 안내 메시지가 표시된다
- [ ] `isLoading` 중 버튼이 비활성화된다
- [ ] 모바일/데스크톱 레이아웃이 정상 렌더링된다

---

### FE-07. 회원가입 페이지 구현

**의존성:** FE-05, FE-06

**상세 작업 내용**
- `src/pages/RegisterPage.jsx`: `useRegister` 훅, 이메일/비밀번호 폼
- 클라이언트 유효성: 이메일 형식, 비밀번호 8자 이상 + 영문/숫자 혼합
- 공통 컴포넌트 재사용

**완료 조건**
- [ ] 비밀번호 8자 미만 입력 시 오류 메시지가 표시된다
- [ ] 영문/숫자 미혼합 시 형식 안내 메시지가 표시된다
- [ ] 중복 이메일 시 서버 오류 메시지가 표시된다
- [ ] 가입 성공 시 `/login`으로 이동한다
- [ ] 이미 인증된 상태에서 접근 시 `/`로 리다이렉트된다

---

### FE-08. 카테고리 API 연동 (categoriesApi)

**의존성:** FE-02

**상세 작업 내용**
- `src/api/categoriesApi.js`: `getCategories`, `createCategory`, `updateCategory`, `deleteCategory`

**완료 조건**
- [ ] 각 함수가 올바른 HTTP 메서드와 경로로 요청을 전송한다
- [ ] 오류 응답 시 Error를 throw한다

---

### FE-09. 카테고리 커스텀 훅 (useCategories)

**의존성:** FE-08

**상세 작업 내용**
- `src/hooks/useCategories.js`: `useCategories()`, `useCreateCategory()`, `useUpdateCategory()`, `useDeleteCategory()`
- 생성/수정/삭제 성공 시 `['categories']` 쿼리 invalidate

**완료 조건**
- [ ] `useCategories` 반환 데이터가 카테고리 배열이다
- [ ] 생성/수정/삭제 성공 시 목록이 자동으로 갱신된다
- [ ] `isLoading`, `isError` 상태가 올바르게 반환된다

---

### FE-10. 카테고리 관리 UI 컴포넌트 구현

**의존성:** FE-09

**상세 작업 내용**
- `CategoryList.jsx`, `CategoryItem.jsx`, `CategoryForm.jsx` (최대 20자), `CategoryDeleteDialog.jsx`
- `Modal.jsx` 공통 컴포넌트 작성
- 삭제 확인 다이얼로그: "삭제 시 해당 카테고리의 할일은 미분류로 이동됩니다"

**완료 조건**
- [ ] 카테고리 목록이 정상 렌더링된다
- [ ] 이름 20자 초과 입력 시 오류 메시지가 표시되고 저장되지 않는다
- [ ] 삭제 버튼 클릭 시 확인 다이얼로그가 표시된다
- [ ] 다이얼로그에서 "취소" 클릭 시 삭제가 중단된다
- [ ] 목록이 빈 경우 빈 상태 메시지가 표시된다

---

### FE-11. 할일 API 연동 (todosApi)

**의존성:** FE-02

**상세 작업 내용**
- `src/api/todosApi.js`: `getTodos({ categoryId, status })`, `createTodo`, `updateTodo`, `deleteTodo`, `toggleTodoComplete`
- 필터 파라미터를 쿼리스트링으로 전달

**완료 조건**
- [ ] `getTodos`가 필터 파라미터를 쿼리스트링으로 올바르게 전달한다
- [ ] 각 함수가 올바른 HTTP 메서드와 경로로 요청을 전송한다

---

### FE-12. 할일 커스텀 훅 (useTodos)

**의존성:** FE-11

**상세 작업 내용**
- `src/hooks/useTodos.js`: `useTodos({ categoryId, status })`, `useCreateTodo`, `useUpdateTodo`, `useDeleteTodo`, `useToggleTodoComplete`
- 필터 파라미터 변경 시 쿼리 자동 재실행 (`queryKey: ['todos', { categoryId, status }]`)

**완료 조건**
- [ ] 필터 파라미터 변경 시 쿼리가 자동으로 재실행된다
- [ ] 생성/수정/삭제/완료 처리 후 목록이 자동 갱신된다
- [ ] `isPending` 상태가 뮤테이션 중 올바르게 반환된다

---

### FE-13. 날짜·상태 계산 유틸 (dateUtils)

**의존성:** FE-01

**상세 작업 내용**
- `src/utils/dateUtils.js`: `getTodoStatus(todo)`, `formatDate(dateString)`, `isOverdue(dueDate)`

**완료 조건**
- [ ] `getTodoStatus`가 `completed`, `overdue`, `pending` 3가지 상태를 올바르게 반환한다
- [ ] 종료일이 없는 할일은 `overdue`가 아닌 `pending`으로 판별된다
- [ ] 완료된 할일은 종료일이 과거여도 `completed`로 반환된다

---

### FE-14. 필터링 상태 관리 및 필터 UI 컴포넌트 구현

**의존성:** FE-09, FE-12

**상세 작업 내용**
- 필터 상태: `useSearchParams` (URL 쿼리스트링 방식)
- `src/components/todo/TodoFilter.jsx`: 카테고리 필터 + 상태 필터 ("전체", "미완료", "완료", "기한 초과")
- 모바일: 가로 스크롤 탭, 데스크톱: 사이드바 또는 상단 탭

**완료 조건**
- [ ] 카테고리 필터 선택 시 해당 카테고리 할일만 표시된다
- [ ] 상태 필터 선택 시 해당 상태 할일만 표시된다
- [ ] "전체" 선택 시 필터가 초기화된다
- [ ] 선택된 필터가 시각적으로 구분된다
- [ ] 모바일에서 필터 탭이 가로 스크롤된다

---

### FE-15. 할일 목록 UI 컴포넌트 구현

**의존성:** FE-12, FE-13

**상세 작업 내용**
- `TodoList.jsx`: 로딩/오류/빈 상태 처리
- `TodoItem.jsx`: 체크박스, 제목(완료 시 취소선), 상태 배지, 종료일, 카테고리명, 수정/삭제 버튼
- `EmptyState.jsx`: 빈 상태 메시지 재사용 컴포넌트

**완료 조건**
- [ ] 할일 목록이 정상 렌더링된다
- [ ] 체크박스 클릭 시 완료/미완료 상태가 즉시 반영된다
- [ ] `overdue` 상태 배지가 기한 초과 할일에 표시된다
- [ ] 완료된 할일 제목에 취소선이 적용된다
- [ ] 목록이 비었을 때 빈 상태 메시지가 표시된다
- [ ] 로딩 중 스피너 또는 스켈레톤이 표시된다

---

### FE-16. 할일 생성/수정 폼 컴포넌트 구현

**의존성:** FE-09, FE-12

**상세 작업 내용**
- `src/components/todo/TodoForm.jsx`: 제목(필수, 100자), 설명(500자), 카테고리(`<select>`), 종료일(`datetime-local`)
- `initialValues` prop으로 수정 모드 지원
- `Modal.jsx` 활용

**완료 조건**
- [ ] 제목 미입력 시 "제목은 필수 항목입니다" 오류 메시지가 표시된다
- [ ] 제목 100자 초과 시 오류 메시지가 표시된다
- [ ] 설명 500자 초과 시 오류 메시지가 표시된다
- [ ] 카테고리 드롭다운에 현재 카테고리 목록이 표시된다
- [ ] 수정 모드에서 기존 값이 폼에 채워진다

---

### FE-17. 할일 삭제 확인 다이얼로그 구현

**의존성:** FE-12

**상세 작업 내용**
- `src/components/todo/TodoDeleteDialog.jsx`: 삭제 확인 다이얼로그
- 메시지: "이 할일을 영구 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
- `useDeleteTodo` 연동, `isPending` 중 버튼 비활성화

**완료 조건**
- [ ] 삭제 버튼 클릭 시 확인 다이얼로그가 표시된다
- [ ] "취소" 클릭 시 다이얼로그가 닫히고 할일이 유지된다
- [ ] "삭제" 클릭 시 할일이 영구 삭제되고 목록에서 제거된다
- [ ] 삭제 처리 중 버튼이 비활성화된다

---

### FE-18. 메인 TodoPage 조합 및 레이아웃 구현

**의존성:** FE-14, FE-15, FE-16, FE-17

**상세 작업 내용**
- `src/pages/TodoPage.jsx`: 모든 할일 UI 컴포넌트 조합
- `src/components/common/Header.jsx`: 앱 제목, 사용자 이메일, 로그아웃 버튼, 카테고리 관리 링크
- "할일 추가" FAB 버튼 → `TodoForm` 모달 오픈
- 레이아웃: 모바일 단일 컬럼, 데스크톱 사이드바 + 메인 영역

**완료 조건**
- [ ] TodoPage에서 필터, 목록, 생성 버튼이 모두 렌더링된다
- [ ] 헤더에 사용자 이메일이 표시된다
- [ ] "로그아웃" 버튼이 동작한다
- [ ] "할일 추가" 버튼 클릭 시 생성 폼 모달이 열린다
- [ ] 모바일/데스크톱 반응형 레이아웃이 정상 동작한다

---

## 의존성 그래프 요약

```
[DB]
DB-01 → DB-02 → DB-03 → DB-04
                DB-03 → DB-05 → DB-06
                DB-03 → DB-07
         DB-01 → DB-05 → DB-08

[BE]
BE-01 → BE-02
BE-01 → BE-03
BE-01, BE-02, BE-03 → BE-04 → BE-05
BE-02, BE-03, BE-05 → BE-06
BE-02, BE-03, BE-05 → BE-07
BE-02, BE-03, BE-05, BE-07 → BE-08
BE-06, BE-07, BE-08 → BE-09

[FE]
FE-01 → FE-02 → FE-04 → FE-05 → FE-06
                                 FE-05 → FE-07
         FE-02 → FE-08 → FE-09 → FE-10
         FE-02 → FE-11 → FE-12 → FE-14 ← FE-09
FE-01 → FE-03                    FE-12 → FE-15 ← FE-13
FE-01 → FE-13                    FE-12 → FE-16 ← FE-09
                                  FE-12 → FE-17
                  FE-14, FE-15, FE-16, FE-17 → FE-18
```

---

## 권장 실행 순서 (Phase 1 MVP)

| 단계 | 병렬 실행 가능 Task |
|---|---|
| 1 | DB-01, BE-01, FE-01 |
| 2 | DB-02, DB-05 / BE-02, BE-03 / FE-02, FE-03, FE-13 |
| 3 | DB-03 / BE-04 / FE-04, FE-08, FE-11 |
| 4 | DB-04, DB-06, DB-07, DB-08 / BE-05 / FE-05, FE-09, FE-12 |
| 5 | BE-06, BE-07 / FE-06, FE-07, FE-10 |
| 6 | BE-08 / FE-14, FE-15, FE-16, FE-17 |
| 7 | BE-09 / FE-18 |
