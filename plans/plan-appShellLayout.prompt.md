# Plan: Drafty App Shell Layout

## TL;DR

`/app` 라우트에 앱 셸 레이아웃(좌측 사이드바 + 상단 툴바 + 중앙 캔버스 placeholder + 우측 패널)을 Tailwind만으로 구현한다. 밝은 테마 기준, 미니멀한 메모/화이트보드 앱 느낌. 상태관리 라이브러리 없이 React useState로 선택 보드 관리.

---

## 파일 구조

### 새 파일 (6개)

| 파일                                         | 역할                                                                           |
| -------------------------------------------- | ------------------------------------------------------------------------------ |
| `apps/web/app/app/layout.tsx`                | 앱 셸 레이아웃 — 사이드바/툴바/메인/우측패널 조립, `useState`로 선택 보드 관리 |
| `apps/web/app/app/page.tsx`                  | 보드 워크스페이스 — 캔버스 placeholder (도트 그리드 배경, 줌 컨트롤 mock)      |
| `apps/web/components/layout/sidebar.tsx`     | 좌측 사이드바 — 로고, 보드 목록, New Board 버튼                                |
| `apps/web/components/layout/topbar.tsx`      | 상단 툴바 — 보드 제목, 검색, AI Organize, 사용자 메뉴 placeholder              |
| `apps/web/components/layout/right-panel.tsx` | 우측 패널 — 선택 항목 상세 placeholder                                         |
| `apps/web/data/mock-boards.ts`               | 더미 보드 데이터 (4개 보드)                                                    |

### 수정 파일 (2개)

| 파일                       | 변경                                                  |
| -------------------------- | ----------------------------------------------------- |
| `apps/web/app/globals.css` | `color-scheme: dark` → `light`, 밝은 테마 body 스타일 |
| `apps/web/app/page.tsx`    | 밝은 테마로 전환 + `/app` 진입 링크 추가              |

---

## Steps

### Phase 1: 기반 설정 (선행)

**Step 1.** `apps/web/app/globals.css` 수정

- `color-scheme: dark` → `color-scheme: light` 로 변경
- 밝은 테마 기본 body 스타일 적용 (bg-white, text-gray-900)
- antialiased 폰트 렌더링 추가

**Step 2.** `apps/web/tailwind.config.ts` 확인

- 현재 `content`에 `./components/**` 이미 포함, 추가 변경 불필요

### Phase 2: 더미 데이터 (Phase 1 이후)

**Step 3.** `apps/web/data/mock-boards.ts` 생성

- `MockBoard` 타입 정의: `{ id: string; name: string; emoji: string }`
- 4개 더미 보드: Inbox(📥), Product Ideas(💡), Research(🔬), Writing(✍️)
- 기본 선택 보드 ID: `'product-ideas'`
- 런타임 의존 없는 순수 데이터 파일

### Phase 3: 레이아웃 컴포넌트 (Phase 2와 병렬)

**Step 4.** `apps/web/components/layout/sidebar.tsx` 생성

- Client Component (`'use client'`)
- Props: `boards`, `selectedBoardId`, `onSelectBoard` 콜백
- Drafty 텍스트 로고 상단
- "Boards" 섹션 제목 + 보드 목록 렌더링
- 선택된 보드: 배경색 하이라이트 (예: bg-blue-50 + text-blue-700)
- "New Board" 버튼 placeholder (비활성, 시각적으로만)
- 폭: `w-56` (224px), 전체 높이, 좌측 고정
- 좌측 경계선: `border-r border-gray-200`
- 반응형: `hidden md:flex`로 소형 화면에서 숨김

**Step 5.** `apps/web/components/layout/topbar.tsx` 생성

- Props: `boardName`
- 현재 보드 제목 표시 (좌측)
- 검색 입력창 placeholder (중앙, `<input disabled placeholder="검색...">`)
- "AI Organize" 버튼 placeholder (우측)
- 사용자 아바타/메뉴 placeholder (우측 끝)
- 높이: `h-12`, 하단 경계선
- 접근성: `aria-label` 적용

**Step 6.** `apps/web/components/layout/right-panel.tsx` 생성

- 정적 placeholder
- "선택된 항목" 제목
- 아이콘/텍스트로 "노드를 선택하면 상세 정보가 여기에 표시됩니다" 안내
- 추후 들어갈 속성 필드 placeholder (제목, 타입, 생성일 등 회색 라인)
- 폭: `w-72` (288px), 전체 높이
- 좌측 경계선: `border-l border-gray-200`
- 반응형: `hidden lg:flex`로 소형 화면에서 숨김

### Phase 4: 라우트 & 레이아웃 조립 (Phase 2, 3 완료 후)

**Step 7.** `apps/web/app/app/layout.tsx` 생성

- Client Component (`'use client'`) — useState로 선택 보드 관리
- 전체 뷰포트 `h-screen` flex 컨테이너
- 레이아웃 구조:
  ```
  <div class="flex h-screen bg-white">
    <Sidebar boards={mockBoards} selectedBoardId={...} onSelectBoard={...} />
    <div class="flex flex-1 flex-col min-w-0">
      <Topbar boardName={선택된 보드 이름} />
      <div class="flex flex-1 min-h-0">
        <main class="flex-1 min-w-0">{children}</main>
        <RightPanel />
      </div>
    </div>
  </div>
  ```
- `min-w-0`, `min-h-0`으로 flex 오버플로우 방지
- mock 데이터 import 및 useState로 selectedBoardId 관리

**Step 8.** `apps/web/app/app/page.tsx` 생성

- 캔버스 영역 placeholder
- 전체 영역 채우는 flex 컨테이너
- 중앙에 가이드 텍스트: "캔버스 영역" 안내
- CSS 도트 패턴 배경으로 화이트보드 느낌
- 빈 상태가 아닌 "작업 준비된 캔버스" 느낌
- 하단에 줌 컨트롤 placeholder (비활성)

### Phase 5: 기존 파일 수정 (Phase 4와 병렬)

**Step 9.** `apps/web/app/page.tsx` 수정

- `bg-slate-950 text-slate-100` → 밝은 테마로 변경
- `/app` 으로 이동하는 링크/버튼 추가
- 기존 콘텐츠 유지하되 테마 일관성 맞춤

---

## 검증

1. `pnpm lint` — ESLint 통과
2. `pnpm typecheck` — TypeScript 에러 없음
3. `pnpm build` — Next.js 빌드 성공
4. `http://localhost:3000` — 밝은 테마 홈페이지 + `/app` 진입 링크
5. `http://localhost:3000/app` — 앱 셸 레이아웃 확인:
   - 좌측 사이드바에 4개 보드 목록 표시
   - "Product Ideas" 보드 기본 선택 상태 강조
   - 보드 클릭 시 선택 상태 변경 + 툴바 제목 변경
   - 중앙 캔버스 placeholder 표시
   - 우측 패널 placeholder 표시
6. 브라우저 창 크기 축소 시 레이아웃 깨지지 않음 확인 (사이드바/우측패널 숨김 반응형)

---

## 결정사항

- **`src/` 미생성**: 현재 `app/`이 루트 레벨에 있고 tailwind가 `./components/**`를 이미 스캔하므로 동일 레벨에 `components/` 배치
- **`app-shell.tsx` 별도 파일 미생성**: `app/app/layout.tsx`가 앱 셸 역할 직접 수행 (불필요한 래퍼 제거)
- **상태관리**: `useState`만 사용 — Zustand/Context 미도입
- **테마**: 밝은 테마 단일 — 다크 모드 미구현
- **홈페이지(`/`)**: 밝은 테마로 변경 + `/app` 진입점 추가
- **scope out**: React Flow, URL 파라미터 기반 보드 전환, 인증, DB, AI 전부 제외

---

## 향후 확장 고려

- **`feat/canvas-reactflow-foundation`**: `app/app/page.tsx`의 캔버스 placeholder를 React Flow 컨테이너로 교체. `<main>` 영역이 `flex-1 min-w-0 min-h-0`으로 이미 유연한 크기 확보
- **`feat/note-node-basic`**: Sidebar의 `onSelectBoard` 콜백과 Topbar의 `boardName` prop을 통해 보드 전환 로직을 URL 파라미터/상태관리로 쉽게 업그레이드 가능. RightPanel은 선택 노드 정보를 받는 props 추가만으로 확장
