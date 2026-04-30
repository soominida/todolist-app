# E2E 통합 테스트 결과 보고서

**테스트 일시**: 2026-04-29  
**테스트 환경**: 프론트엔드 http://localhost:5173 / 백엔드 http://localhost:4000  
**테스트 도구**: Playwright MCP  
**참조 문서**: docs/3-user-scenario.md

---

## 테스트 결과 요약

| 시나리오 | 설명 | 결과 |
|---------|------|------|
| SCN-01 | 신규 사용자 회원가입 및 첫 로그인 | ✅ 통과 |
| SCN-02 | 카테고리 및 할일 생성 | ✅ 통과 |
| SCN-03 | 카테고리 필터 및 상태 필터 | ✅ 통과 |
| SCN-04 | 할일 완료 처리 | ✅ 통과 |
| SCN-05 | 기한초과 할일 수정 | ✅ 통과 |
| SCN-06 | 카테고리 삭제 시 미분류 처리 | ✅ 통과 |
| SCN-07 | 할일 삭제 | ✅ 통과 |
| SCN-08 | 로그아웃 및 비인증 접근 차단 | ✅ 통과 |

**전체 결과: 8/8 통과**

---

## 상세 결과

### SCN-01: 신규 사용자 회원가입 및 첫 로그인

- **테스트 계정**: `e2e_scn01@test.com` / `Test1234`
- `/register` 접속 → 이메일/비밀번호/비밀번호 확인 입력 → 가입 버튼 클릭
- **결과**: 회원가입 완료 화면("회원가입이 완료되었습니다.") 정상 표시
- "로그인하러 가기" 클릭 → `/login` 이동
- 로그인 후 `/` (할일 목록) 리다이렉트 확인
- 헤더에 이메일(`e2e_scn01@test.com`) 표시 확인
- **스크린샷**: `screenshots/scn01_01_register_success.png`, `scn01_02_login_success.png`

---

### SCN-02: 카테고리 및 할일 생성

- 카테고리 관리 → "업무" 카테고리 추가 → "개인" 카테고리 추가
- 할일 추가 → "프로젝트 기획서 작성" (카테고리: 업무, 종료일: 2026-05-10)
- 할일 추가 → "운동 계획 세우기" (카테고리: 개인, 종료일: 2026-04-01 → 기한초과)
- **결과**: 두 할일 모두 생성됨. "운동 계획 세우기"에 빨간색 "기한초과" 배지 정상 표시
- **스크린샷**: `screenshots/scn02_01_categories_created.png`, `scn02_02_todos_created.png`

---

### SCN-03: 카테고리 필터 및 상태 필터

- 카테고리 드롭다운 "업무" 선택 → "프로젝트 기획서 작성"만 표시 확인
- 카테고리 필터 해제 → "기한초과" 탭 클릭 → "운동 계획 세우기"만 표시 확인
- URL 파라미터 반영: `/?categoryId=27`, `/?status=overdue` 정상 동작
- **결과**: 카테고리 필터 및 상태 필터 모두 정상 동작
- **스크린샷**: `screenshots/scn03_01_category_filter_업무.png`, `scn03_02_status_filter_overdue.png`

---

### SCN-04: 할일 완료 처리

- "프로젝트 기획서 작성"의 완료 처리 버튼(라디오) 클릭
- **결과**: 상태가 "미완료" → "완료"로 변경, 녹색 체크 아이콘 표시, 텍스트에 취소선 표시
- 버튼도 "완료 취소"로 변경됨 확인
- **스크린샷**: `screenshots/scn04_01_todo_completed.png`

---

### SCN-05: 기한초과 할일 수정

- "운동 계획 세우기" 수정 버튼 클릭 → 종료일을 `2026-06-30`으로 변경
- **결과**: 상태가 "기한초과" → "미완료"로 변경, 파란색 테두리 및 "미완료" 배지 표시
- **스크린샷**: `screenshots/scn05_01_overdue_fixed.png`

---

### SCN-06: 카테고리 삭제 시 미분류 처리

- 카테고리 관리 → "개인" 카테고리 삭제 버튼 클릭
- 확인 모달: "삭제 시 해당 카테고리의 할일은 미분류로 이동됩니다." 메시지 표시
- 삭제 확인 클릭
- 할일 목록 확인 → "운동 계획 세우기"의 카테고리가 "개인" → "미분류"로 변경됨
- **결과**: 카테고리 삭제 후 소속 할일이 미분류로 정상 이동
- **스크린샷**: `screenshots/scn06_01_category_deleted_uncategorized.png`

---

### SCN-07: 할일 삭제

- "프로젝트 기획서 작성" 삭제 버튼 클릭
- 확인 모달: "이 할일을 영구 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다." 메시지 표시
- 삭제 확인 클릭
- **결과**: 할일 목록에서 "프로젝트 기획서 작성" 제거됨. "운동 계획 세우기"만 남음
- **스크린샷**: `screenshots/scn07_01_todo_deleted.png`

---

### SCN-08: 로그아웃 및 비인증 접근 차단

- 헤더 로그아웃 버튼 클릭 → `/login` 리다이렉트 확인
- 비인증 상태에서 `/` 직접 접근 → `/login` 리다이렉트 확인
- 비인증 상태에서 `/categories` 직접 접근 → `/login` 리다이렉트 확인
- **결과**: 모든 보호 경로에서 비인증 접근 차단 정상 동작
- **스크린샷**: `screenshots/scn08_01_logout_redirect_login.png`, `scn08_02_unauthenticated_redirect.png`

---

## 발견된 이슈

없음. 모든 시나리오가 정상 동작함.

---

## 추가 개선사항

### 1. 종료일 입력 UI 개선

- **현상**: 종료일 입력 필드가 `datetime-local` 타입으로, 날짜와 시간을 함께 입력해야 함 (`2026-05-10T00:00` 형식)
- **문제**: 사용자는 날짜만 입력하면 되는데 시간 선택기까지 함께 노출되어 UX가 어색함
- **개선안**: `date` 타입으로 변경하거나, 시간 부분은 기본값(`T00:00`)으로 고정하고 날짜 picker만 노출

---

## 스크린샷 목록

```
screenshots/
├── scn01_01_register_success.png
├── scn01_02_login_success.png
├── scn02_01_categories_created.png
├── scn02_02_todos_created.png
├── scn03_01_category_filter_업무.png
├── scn03_02_status_filter_overdue.png
├── scn04_01_todo_completed.png
├── scn05_01_overdue_fixed.png
├── scn06_01_category_deleted_uncategorized.png
├── scn07_01_todo_deleted.png
├── scn08_01_logout_redirect_login.png
└── scn08_02_unauthenticated_redirect.png
```
