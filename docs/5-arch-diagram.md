# 기술 아키텍처 다이어그램 — TodoList 애플리케이션

> 참조: [PRD v0.1](./2-prd.md) · [프로젝트 구조 v0.3](./4-project-structure.md)

---

## 변경 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|---|---|---|---|
| v0.1 | 2026-04-28 | soominlee | 최초 작성 |
| v0.2 | 2026-04-28 | soominlee | 프론트엔드 레이어 구조도·도메인 모델 추가 |
| v0.3 | 2026-04-28 | soominlee | 기술 스택 및 버전 다이어그램 추가 |
| v0.4 | 2026-04-28 | soominlee | 기술 스택 표 형식으로 변경 |

---

## 1. 기술 스택 및 버전

### Frontend

| 라이브러리 | 버전 | 용도 |
|---|---|---|
| React | 19 | UI 프레임워크 |
| TanStack Query | 5 | 서버 상태 관리 |
| Zustand | 5 | 전역 상태 관리 |
| Tailwind CSS | 4 | 스타일링 |

### Backend

| 라이브러리 | 버전 | 용도 |
|---|---|---|
| Node.js | 24 | 런타임 |
| Express | 5 | 웹 프레임워크 |
| pg (node-postgres) | 최신 | PostgreSQL 클라이언트 |

### Database

| 항목 | 버전 | 용도 |
|---|---|---|
| PostgreSQL | 16 | 관계형 데이터베이스 |

### 인증

| 항목 | 사양 | 용도 |
|---|---|---|
| JWT | HS-512 | 사용자 인증 토큰 |
| bcrypt | salt rounds ≥ 12 | 비밀번호 해싱 |

---

## 2. 시스템 구성도

전체 3-tier 구조와 JWT 인증 흐름을 나타낸다.

```mermaid
graph TD
    Browser["브라우저\n(반응형 웹)"]

    subgraph Frontend["Frontend — React 19"]
        Pages["페이지\n(LoginPage / RegisterPage / TodoPage)"]
        Hooks["커스텀 훅\n(useAuth / useTodos / useCategories)"]
        Store["전역 상태\n(Zustand — authStore)"]
        ApiClient["API 클라이언트\n(TanStack Query + fetch)"]
    end

    subgraph Backend["Backend — Node.js 24 / Express"]
        Router["라우터\n(/api/auth · /api/todos · /api/categories)"]
        AuthMW["JWT 인증 미들웨어\n(HS-512 검증)"]
        Controller["컨트롤러\n(요청 파싱 · 유효성 검사)"]
        Service["서비스\n(비즈니스 로직)"]
        DBLayer["DB 쿼리 레이어\n(pg · 원시 SQL)"]
    end

    DB[("PostgreSQL\n(users · todos · categories)")]

    Browser -->|"HTTP 요청"| Pages
    Pages --> Hooks
    Hooks --> Store
    Hooks --> ApiClient
    ApiClient -->|"REST API + JWT Bearer"| Router
    Router --> AuthMW
    AuthMW -->|"검증 통과"| Controller
    Controller --> Service
    Service --> DBLayer
    DBLayer -->|"SQL"| DB
    DB -->|"결과"| DBLayer
    DBLayer --> Service
    Service --> Controller
    Controller -->|"JSON 응답"| ApiClient
```

---

## 3. 백엔드 레이어 구조도

요청이 각 레이어를 단방향으로 통과하는 흐름을 나타낸다.

```mermaid
flowchart TD
    Client["클라이언트 요청\n(HTTP + JWT Bearer)"]

    subgraph MW["미들웨어"]
        AuthMW["authMiddleware\nJWT 검증 · user_id 추출"]
        ErrMW["errorMiddleware\n전역 에러 핸들러"]
    end

    subgraph Router["라우터 레이어"]
        R1["authRoutes.js"]
        R2["todoRoutes.js"]
        R3["categoryRoutes.js"]
    end

    subgraph Controller["컨트롤러 레이어"]
        C1["authController.js\n요청 파싱 · 유효성 검사 · 응답 반환"]
        C2["todoController.js"]
        C3["categoryController.js"]
    end

    subgraph Service["서비스 레이어"]
        S1["authService.js\n비즈니스 로직 (순수 함수)"]
        S2["todoService.js"]
        S3["categoryService.js"]
    end

    subgraph DB["DB 쿼리 레이어"]
        Q1["userQueries.js"]
        Q2["todoQueries.js"]
        Q3["categoryQueries.js"]
        Pool["pool.js\npg Pool 싱글턴"]
    end

    PG[("PostgreSQL")]

    Client --> AuthMW
    AuthMW --> Router
    R1 --> C1
    R2 --> C2
    R3 --> C3
    C1 --> S1
    C2 --> S2
    C3 --> S3
    S1 --> Q1
    S2 --> Q2
    S3 --> Q3
    Q1 & Q2 & Q3 --> Pool
    Pool -->|"SQL 실행"| PG
    PG -->|"결과 반환"| Pool
    Pool -.->|"에러 발생 시"| ErrMW
```

---

---

## 4. 프론트엔드 레이어 구조도

요청이 각 레이어를 단방향으로 통과하는 흐름을 나타낸다.

```mermaid
flowchart TD
    User["사용자 입력"]

    subgraph Pages["페이지 레이어"]
        P1["LoginPage.jsx"]
        P2["RegisterPage.jsx"]
        P3["TodoPage.jsx"]
    end

    subgraph Hooks["커스텀 훅 레이어\n(비즈니스 로직)"]
        H1["useAuth.js"]
        H2["useTodos.js"]
        H3["useCategories.js"]
    end

    subgraph State["전역 상태\n(Zustand)"]
        ST1["authStore.js\n(인증 토큰 · 사용자 정보)"]
    end

    subgraph API["API 클라이언트 레이어\n(TanStack Query)"]
        A1["authApi.js"]
        A2["todosApi.js"]
        A3["categoriesApi.js"]
    end

    Server["Backend REST API"]

    User --> Pages
    P1 --> H1
    P2 --> H1
    P3 --> H2
    P3 --> H3
    H1 --> ST1
    H1 --> A1
    H2 --> A2
    H3 --> A3
    A1 & A2 & A3 -->|"HTTP + JWT"| Server
```

---

## 5. 도메인 모델

핵심 엔티티 간 관계를 나타낸다.

```mermaid
erDiagram
    USER {
        int id PK
        string email
        string password_hash
        datetime created_at
    }

    CATEGORY {
        int id PK
        int user_id FK
        string name
        datetime created_at
    }

    TODO {
        int id PK
        int user_id FK
        int category_id FK
        string title
        string description
        datetime due_date
        boolean is_completed
        datetime created_at
        datetime updated_at
    }

    USER ||--o{ CATEGORY : "소유"
    USER ||--o{ TODO : "소유"
    CATEGORY ||--o{ TODO : "분류 (nullable)"
```

---

> 의존 방향은 항상 단방향이며, 역방향 참조는 금지한다. (P-07)
