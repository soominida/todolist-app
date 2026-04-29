# 스타일 가이드 — TodoList 애플리케이션

> 참조 디자인: Google Calendar UI
> 작성일: 2026-04-29

---

## 1. 디자인 원칙

- **간결함**: 불필요한 장식 제거, 콘텐츠 중심 레이아웃
- **명확한 계층**: 타이포그래피와 색상으로 정보 우선순위 표현
- **일관성**: 동일한 컴포넌트는 동일한 스타일 적용
- **여백**: 충분한 padding/margin으로 가독성 확보

---

## 2. 색상 (Color Palette)

### 2.1 Primary

| 역할 | 색상명 | Hex | 용도 |
|------|--------|-----|------|
| Primary | Blue | `#1a73e8` | 주요 액션 버튼, 활성 상태, 강조 |
| Primary Dark | Blue Dark | `#1557b0` | Hover 상태 |
| Primary Light | Blue Light | `#e8f0fe` | 배경 강조, 선택된 항목 |

### 2.2 Semantic

| 역할 | 색상명 | Hex | 용도 |
|------|--------|-----|------|
| Success | Green | `#1e8e3e` | 완료 상태 (completed) |
| Success Light | Green Light | `#e6f4ea` | 완료 항목 배경 |
| Danger | Red | `#d93025` | 기한 초과 (overdue), 삭제 |
| Danger Light | Red Light | `#fce8e6` | 기한 초과 항목 배경 |
| Warning | Orange | `#f29900` | 주의 상태 |

### 2.3 Neutral

| 역할 | 색상명 | Hex | 용도 |
|------|--------|-----|------|
| Text Primary | Gray 900 | `#202124` | 제목, 주요 텍스트 |
| Text Secondary | Gray 600 | `#5f6368` | 부가 정보, 설명 |
| Text Disabled | Gray 400 | `#9aa0a6` | 비활성, placeholder |
| Border | Gray 200 | `#dadce0` | 구분선, 테두리 |
| Background | Gray 50 | `#f8f9fa` | 사이드바, 카드 배경 |
| Surface | White | `#ffffff` | 메인 콘텐츠 영역 |

### 2.4 카테고리 색상 (할일 분류용)

| 색상 | Hex | 
|------|-----|
| Blue | `#1a73e8` |
| Green | `#33b679` |
| Teal | `#039be5` |
| Purple | `#7986cb` |
| Red | `#e67c73` |
| Yellow | `#f6bf26` |

---

## 3. 타이포그래피 (Typography)

### 3.1 Font Family

```css
font-family: 'Google Sans', 'Noto Sans KR', Roboto, Arial, sans-serif;
```

### 3.2 Scale

| 역할 | Size | Weight | Line Height | 용도 |
|------|------|--------|-------------|------|
| Display | 28px | 400 | 1.3 | 페이지 타이틀 |
| Heading 1 | 22px | 500 | 1.4 | 섹션 제목 |
| Heading 2 | 16px | 500 | 1.4 | 카드 제목, 항목 제목 |
| Body | 14px | 400 | 1.5 | 본문, 설명 |
| Caption | 12px | 400 | 1.4 | 날짜, 메타 정보 |
| Label | 11px | 500 | 1.3 | 배지, 태그, 버튼 소 |

---

## 4. 간격 (Spacing)

8px 기반 스케일 사용.

| 토큰 | 값 | 용도 |
|------|----|------|
| `space-1` | 4px | 아이콘-텍스트 간격 |
| `space-2` | 8px | 컴포넌트 내부 소간격 |
| `space-3` | 12px | 카드 내부 패딩 |
| `space-4` | 16px | 섹션 간격, 기본 패딩 |
| `space-5` | 24px | 카드 간격 |
| `space-6` | 32px | 섹션 구분 |
| `space-8` | 48px | 페이지 여백 |

---

## 5. 레이아웃 (Layout)

### 5.1 전체 구조

```
┌─────────────────────────────────────────────┐
│                   Header (64px)              │
├──────────────┬──────────────────────────────┤
│              │                              │
│   Sidebar    │       Main Content           │
│   (280px)    │                              │
│              │                              │
└──────────────┴──────────────────────────────┘
```

### 5.2 사이드바
- 너비: `280px` (고정)
- 배경: `#f8f9fa`
- 경계선: `1px solid #dadce0` (우측)
- 패딩: `16px`

### 5.3 메인 콘텐츠
- 배경: `#ffffff`
- 패딩: `24px 32px`
- 최대 너비: `900px` (중앙 정렬)

### 5.4 헤더
- 높이: `64px`
- 배경: `#ffffff`
- 하단 경계선: `1px solid #dadce0`
- 패딩: `0 16px`

---

## 6. 컴포넌트 (Components)

### 6.1 Button

**Primary (주요 액션)**
```css
background: #1a73e8;
color: #ffffff;
border-radius: 24px;
padding: 8px 24px;
font-size: 14px;
font-weight: 500;
border: none;
```
- Hover: `background: #1557b0`
- Active: `background: #0d47a1`

**Outlined (보조 액션)**
```css
background: #ffffff;
color: #1a73e8;
border: 1px solid #dadce0;
border-radius: 24px;
padding: 8px 24px;
font-size: 14px;
font-weight: 500;
```
- Hover: `background: #e8f0fe`

**Text (최소 액션)**
```css
background: transparent;
color: #5f6368;
border: none;
padding: 8px 12px;
border-radius: 4px;
```
- Hover: `background: #f1f3f4`

**Danger (삭제)**
```css
background: #d93025;
color: #ffffff;
border-radius: 24px;
padding: 8px 24px;
```

### 6.2 Todo 카드

```css
background: #ffffff;
border: 1px solid #dadce0;
border-radius: 8px;
padding: 12px 16px;
margin-bottom: 8px;
```

**상태별 좌측 accent bar**
- pending: `border-left: 4px solid #1a73e8`
- completed: `border-left: 4px solid #1e8e3e`
- overdue: `border-left: 4px solid #d93025`

Hover:
```css
box-shadow: 0 1px 3px rgba(0,0,0,0.12);
```

### 6.3 Status Badge

```css
border-radius: 12px;
padding: 2px 10px;
font-size: 11px;
font-weight: 500;
display: inline-block;
```

| 상태 | 배경 | 텍스트 |
|------|------|--------|
| pending | `#e8f0fe` | `#1a73e8` |
| completed | `#e6f4ea` | `#1e8e3e` |
| overdue | `#fce8e6` | `#d93025` |

### 6.4 Input / Form

```css
border: 1px solid #dadce0;
border-radius: 4px;
padding: 10px 14px;
font-size: 14px;
color: #202124;
background: #ffffff;
width: 100%;
```

Focus:
```css
border-color: #1a73e8;
outline: none;
box-shadow: 0 0 0 2px rgba(26,115,232,0.2);
```

Error:
```css
border-color: #d93025;
```

### 6.5 Checkbox

```css
width: 18px;
height: 18px;
border-radius: 50%;          /* 원형 — Google Tasks 스타일 */
border: 2px solid #dadce0;
```

Checked:
```css
background: #1e8e3e;
border-color: #1e8e3e;
```

### 6.6 카테고리 칩 (Chip)

```css
background: #f1f3f4;
border-radius: 16px;
padding: 4px 12px;
font-size: 12px;
color: #5f6368;
display: inline-flex;
align-items: center;
gap: 4px;
```

선택됨:
```css
background: #e8f0fe;
color: #1a73e8;
```

### 6.7 Empty State

```css
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
padding: 64px 0;
color: #9aa0a6;
font-size: 14px;
gap: 12px;
```

---

## 7. 아이콘

- 라이브러리: **Material Icons** (Google 계열 UI와 일관성)
- 기본 크기: `20px`
- 색상: 텍스트와 동일 (`#5f6368`)
- 액션 아이콘: `#1a73e8`

---

## 8. 그림자 (Shadow)

| 레벨 | 값 | 용도 |
|------|----|------|
| Level 1 | `0 1px 2px rgba(0,0,0,0.08)` | 카드 기본 |
| Level 2 | `0 1px 3px rgba(0,0,0,0.12)` | 카드 hover |
| Level 3 | `0 4px 8px rgba(0,0,0,0.15)` | 드롭다운, 모달 |

---

## 9. 모션 (Motion)

```css
transition: all 0.15s ease;          /* 버튼, 인터랙션 */
transition: all 0.2s ease;           /* 카드, 레이아웃 */
transition: opacity 0.15s ease;      /* 페이드 */
```

---

## 10. 반응형 (Breakpoints)

| 이름 | 범위 | 레이아웃 |
|------|------|---------|
| Mobile | `< 768px` | 사이드바 숨김, 전체 너비 |
| Tablet | `768px ~ 1024px` | 사이드바 축소 (64px 아이콘만) |
| Desktop | `> 1024px` | 사이드바 전체 표시 (280px) |
