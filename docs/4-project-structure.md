# 프로젝트 구조 설계 원칙 — TodoList 애플리케이션

> 참조: [PRD v0.1](./2-prd.md)

---

## 변경 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|---|---|---|---|
| v0.1 | 2026-04-28 | soominlee | 최초 작성 |
| v0.2 | 2026-04-28 | soominlee | 최상위 공통 원칙에 P-07 환경변수 분리 추가 |
| v0.3 | 2026-04-28 | soominlee | 저장소 루트 구조(Monorepo) 섹션 추가 |

---

## 1. 최상위 공통 원칙

| ID | 원칙 | 설명 |
|---|---|---|
| P-01 | **단일 책임** | 파일·모듈·함수는 하나의 역할만 담당한다. |
| P-02 | **명시적 의존** | 암묵적 전역 상태나 사이드이펙트 대신 인자·반환값으로 의존성을 표현한다. |
| P-03 | **TypeScript 미사용** | 프론트엔드·백엔드 모두 순수 JavaScript(ES2022+)로 작성한다. JSDoc으로 타입 의도를 표기한다. |
| P-04 | **Prisma 금지** | 백엔드 DB 접근은 `pg` 라이브러리로 원시 SQL을 직접 실행한다. ORM 도입을 금지한다. |
| P-05 | **확장 가능 구조** | Phase 2(다크모드·다국어)를 고려해 변경 범위가 최소화되는 구조를 유지한다. |
| P-06 | **일관성 우선** | 팀 내 컨벤션이 개인 선호보다 항상 우선한다. |
| P-07 | **환경변수 분리** | 환경별(개발·운영) 설정은 코드에 하드코딩하지 않고 `.env` 파일로 분리한다. `.env`는 `.gitignore`에 포함하고, `.env.example`만 레포에 커밋한다. |

---

## 2. 의존성 / 레이어 원칙

| ID | 원칙 | 설명 |
|---|---|---|
| P-07 | **레이어 단방향 흐름** | 의존 방향은 `UI → 상태/훅 → API 클라이언트` (프론트), `라우터 → 컨트롤러 → 서비스 → DB` (백엔드)로 고정한다. 역방향 참조를 금지한다. |
| P-08 | **순환 참조 금지** | 모듈 간 순환 참조(A → B → A)를 허용하지 않는다. |
| P-09 | **프론트-백 경계** | 프론트엔드는 백엔드 내부 구현(SQL, DB 스키마)을 알지 못한다. REST API 계약만 공유한다. |
| P-10 | **공유 코드 최소화** | 프론트엔드와 백엔드 간 코드 공유는 하지 않는다. 각자 독립적인 패키지로 관리한다. |

---

## 3. 코드 / 네이밍 원칙

| ID | 원칙 | 규칙 |
|---|---|---|
| P-11 | **파일명** | 컴포넌트·클래스: `PascalCase.jsx` / 유틸·훅·서비스 등 나머지: `camelCase.js` |
| P-12 | **폴더명** | 모두 `kebab-case` 소문자 사용 (예: `api-client`, `use-todos`) |
| P-13 | **변수·함수명** | `camelCase`. Boolean은 `is`, `has`, `can` 접두어 사용 (예: `isCompleted`) |
| P-14 | **상수** | `UPPER_SNAKE_CASE` (예: `JWT_SECRET`, `MAX_TITLE_LENGTH`) |
| P-15 | **React 컴포넌트** | `PascalCase` 함수형 컴포넌트만 허용. 클래스 컴포넌트 금지 |
| P-16 | **커스텀 훅** | `use` 접두어 필수 (예: `useTodos`, `useAuth`) |
| P-17 | **API 라우트** | REST 명사 복수형·소문자·하이픈 사용 (예: `/api/todos`, `/api/categories`) |
| P-18 | **함수 길이** | 함수 하나는 50줄 이내를 권장한다. 초과 시 분리를 검토한다. |

---

## 4. 테스트 / 품질 원칙

| ID | 원칙 | 설명 |
|---|---|---|
| P-19 | **테스트 레이어** | 백엔드: 서비스 단위 테스트 필수. 프론트엔드: 핵심 유틸·훅 단위 테스트 작성. |
| P-20 | **커버리지 기준** | Phase 1 MVP 기준 백엔드 서비스 레이어 70% 이상 커버리지 목표. |
| P-21 | **테스트 파일 위치** | 소스 파일과 동일 디렉토리에 `*.test.js` 형태로 배치한다. |
| P-22 | **린트** | ESLint(eslint:recommended) + Prettier 적용. 커밋 전 통과 필수. |
| P-23 | **입력 유효성 검사** | 백엔드는 컨트롤러 진입 시점에 요청 파라미터를 검증하고, 실패 시 즉시 400을 반환한다. |

---

## 5. 설정 / 보안 / 운영 원칙

| ID | 원칙 | 설명 |
|---|---|---|
| P-24 | **환경변수 관리** | 모든 비밀값(JWT 시크릿, DB 접속 정보 등)은 `.env` 파일로 관리하며 `.gitignore`에 포함한다. `.env.example`만 레포에 커밋한다. |
| P-25 | **JWT 보안** | 알고리즘은 `HS-512` 고정. 시크릿은 최소 64자 이상의 무작위 문자열을 사용한다. 토큰 만료 시간은 환경변수로 설정한다. |
| P-26 | **비밀값 하드코딩 금지** | 코드 내부에 패스워드·시크릿·API 키를 직접 작성하지 않는다. |
| P-27 | **데이터 격리** | 모든 DB 쿼리는 `user_id`를 WHERE 조건에 포함하여 타 사용자 데이터 접근을 차단한다. |
| P-28 | **비밀번호 해싱** | 비밀번호는 `bcrypt`(salt rounds ≥ 12)로 해싱하여 저장한다. 평문 저장을 금지한다. |
| P-29 | **CORS** | 백엔드는 허용 오리진을 환경변수로 명시하고, 와일드카드(`*`) 사용을 금지한다. |
| P-30 | **로깅** | 운영 환경에서 요청 로그(메서드·경로·응답코드·소요시간)를 기록한다. 민감 정보(비밀번호·토큰)는 로그에서 제외한다. |

---

## 6. 저장소 루트 구조

프론트엔드와 백엔드를 **단일 저장소(Monorepo)** 로 관리한다.

```
todolist-app/                # 저장소 루트
├── frontend/                # React 앱
├── backend/                 # Express 앱
├── docs/                    # 설계 문서
├── .gitignore
└── README.md
```

- `frontend/`와 `backend/`는 각각 독립적인 `package.json`을 가진다.
- 루트에 공통 `package.json`은 두지 않는다.
- 공유 코드는 허용하지 않는다 (P-10).

---

## 7. 프론트엔드 디렉토리 구조

React 19 + TanStack Query + Zustand + Tailwind CSS 기준.

```
frontend/
├── public/                  # 정적 파일 (favicon 등)
├── src/
│   ├── assets/              # 이미지, 아이콘 등 정적 에셋
│   ├── components/          # 재사용 UI 컴포넌트
│   │   ├── common/          # 버튼, 모달, 입력 폼 등 범용 컴포넌트
│   │   ├── category/        # 카테고리 관련 컴포넌트
│   │   └── todo/            # 할일 관련 컴포넌트
│   ├── pages/               # 라우트 단위 페이지 컴포넌트
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── TodoPage.jsx
│   ├── hooks/               # 커스텀 훅 (use*.js)
│   │   ├── useAuth.js
│   │   ├── useTodos.js
│   │   └── useCategories.js
│   ├── store/               # Zustand 전역 상태 슬라이스
│   │   └── authStore.js
│   ├── api/                 # 백엔드 API 호출 함수 (TanStack Query queryFn)
│   │   ├── authApi.js
│   │   ├── todosApi.js
│   │   └── categoriesApi.js
│   ├── lib/                 # 서드파티 라이브러리 초기화 및 설정
│   │   └── queryClient.js   # TanStack Query QueryClient 인스턴스
│   ├── utils/               # 순수 유틸 함수 (날짜 포맷, 상태 계산 등)
│   │   └── dateUtils.js
│   ├── constants/           # 앱 전역 상수
│   │   └── index.js
│   ├── router/              # React Router 라우트 정의
│   │   └── index.jsx
│   ├── App.jsx
│   └── main.jsx             # 앱 진입점
├── .env
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
├── index.html
├── package.json
└── vite.config.js
```

### 핵심 규칙

- `pages/`는 레이아웃 조합 역할에 집중하고, 비즈니스 로직은 `hooks/`로 분리한다.
- `api/` 함수는 순수 fetch 호출만 담당하며, 상태 관리 코드를 포함하지 않는다.
- `components/common/`은 도메인 의존성 없이 재사용 가능하게 유지한다.

---

## 8. 백엔드 디렉토리 구조

Node.js 24 + Express + pg 기준.

```
backend/
├── src/
│   ├── routes/              # Express 라우터 (URL 경로 정의)
│   │   ├── authRoutes.js
│   │   ├── todoRoutes.js
│   │   └── categoryRoutes.js
│   ├── controllers/         # 요청 파싱, 유효성 검사, 응답 반환
│   │   ├── authController.js
│   │   ├── todoController.js
│   │   └── categoryController.js
│   ├── services/            # 비즈니스 로직 (순수 함수 지향)
│   │   ├── authService.js
│   │   ├── todoService.js
│   │   └── categoryService.js
│   ├── db/                  # DB 접근 레이어
│   │   ├── pool.js          # pg Pool 인스턴스 (싱글턴)
│   │   ├── queries/         # 도메인별 SQL 쿼리 함수
│   │   │   ├── userQueries.js
│   │   │   ├── todoQueries.js
│   │   │   └── categoryQueries.js
│   │   └── migrations/      # SQL 마이그레이션 파일 (날짜_설명.sql)
│   ├── middlewares/         # Express 미들웨어
│   │   ├── authMiddleware.js  # JWT 검증
│   │   └── errorMiddleware.js # 전역 에러 핸들러
│   ├── utils/               # 공통 유틸 함수 (토큰 생성, 응답 포맷 등)
│   │   ├── jwtUtils.js
│   │   └── responseUtils.js
│   ├── constants/           # 서버 전역 상수
│   │   └── index.js
│   └── app.js               # Express 앱 설정 (미들웨어 등록, 라우트 마운트)
├── server.js                # 서버 진입점 (포트 바인딩)
├── .env
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
└── package.json
```

### 핵심 규칙

- `controllers/`는 HTTP 관심사(req, res)만 처리하고, 비즈니스 로직을 `services/`에 위임한다.
- `services/`는 HTTP 객체(req, res)를 직접 참조하지 않아 단위 테스트가 용이하다.
- `db/queries/`는 SQL 실행 함수만 포함하며, 비즈니스 규칙을 포함하지 않는다.
- `pool.js`는 앱 전체에서 단일 인스턴스를 공유하여 커넥션을 효율적으로 관리한다.
