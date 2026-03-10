# Drafty 구현 현황

**최종 갱신:** 2026-03-11
**현재 브랜치:** `feat/inbox-panel-markdown-notes`
**단계:** Inbox 패널 + Markdown 미리보기

---

## 1. 프로젝트 구조

```
Drafty/
├── apps/
│   └── web/                         # Next.js 15 App Router (React 19)
│       ├── app/                     # 라우트 및 전역 스타일
│       │   ├── layout.tsx           # 루트 레이아웃 (메타데이터, lang="ko")
│       │   ├── page.tsx             # 홈 — AppShell + BoardCanvas 진입점
│       │   └── globals.css          # Tailwind 지시문 + React Flow 오버라이드
│       ├── components/
│       │   ├── layout/              # 앱 셸 레이아웃
│       │   │   ├── app-shell.tsx    # 3패널 리사이즈 레이아웃
│       │   │   ├── sidebar.tsx      # 좌측 보드 네비게이션
│       │   │   ├── topbar.tsx       # 상단 바 (제목, 검색, AI, 사용자)
│       │   │   └── right-panel.tsx  # 우측 선택 항목 패널 (플레이스홀더)
│       │   └── canvas/              # 캔버스 컴포넌트
│       │       ├── board-canvas.tsx  # React Flow 캔버스 (노드/엣지 관리)
│       │       ├── note-node.tsx     # NoteNode 커스텀 노드
│       │       └── canvas-empty-state.tsx  # 빈 캔버스 안내 오버레이
│       └── data/                    # 목 데이터
│           ├── mock-boards.ts       # 보드 목록 (4개)
│           ├── mock-board-canvas.ts # 보드별 캔버스 스냅샷 (노드/엣지)
│           └── mock-inbox-notes.ts  # Inbox 메모 목 데이터 (5개)
├── packages/
│   └── shared-types/                # 프레임워크 비종속 공통 TypeScript 타입
│       └── src/index.ts             # EntityId, NodeType, NoteNodeData 등
├── plans/                           # 구현 계획 문서
├── PRD.md                           # 제품 요구사항 정의서
├── README.md                        # 프로젝트 개요 및 범위
├── package.json                     # 모노레포 루트 스크립트
├── pnpm-workspace.yaml              # 워크스페이스 설정
├── tsconfig.base.json               # 공유 TypeScript 설정 (strict)
├── eslint.config.mjs                # ESLint flat config
└── prettier.config.mjs              # Prettier 설정
```

---

## 2. 기술 스택

| 영역          | 기술                       | 버전   |
| ------------- | -------------------------- | ------ |
| 패키지 매니저 | pnpm (워크스페이스)        | —      |
| 프레임워크    | Next.js (App Router)       | 15.x   |
| UI 라이브러리 | React                      | 19.x   |
| 언어          | TypeScript (strict)        | 5.x    |
| 스타일링      | Tailwind CSS               | 3.4.x  |
| 캔버스        | @xyflow/react (React Flow) | 12.6.x |
| 린트          | ESLint (flat config)       | 9.x    |
| 포맷          | Prettier                   | 3.x    |

---

## 3. 주요 스크립트

```bash
pnpm dev         # 개발 서버 실행 (apps/web)
pnpm build       # 전체 빌드
pnpm lint        # ESLint 검사
pnpm typecheck   # TypeScript 타입 체크
pnpm format      # Prettier 포맷 적용
```

---

## 4. 구현 완료 항목

### 4.1 모노레포 인프라

- [x] pnpm 워크스페이스 구성 (`apps/*`, `packages/*`)
- [x] 공유 `tsconfig.base.json` (ES2022, strict, Bundler 모듈 해석)
- [x] ESLint flat config (TypeScript 확장, `no-explicit-any: off`)
- [x] Prettier 설정 (`singleQuote`, `trailingComma: all`, `printWidth: 100`)
- [x] 루트 스크립트 (`dev`, `build`, `lint`, `typecheck`, `format`)

### 4.2 공유 타입 패키지 (`@drafty/shared-types`)

- [x] ESM 패키지 (`type: "module"`)
- [x] 빌드 없이 소스 직접 참조 (`exports → ./src/index.ts`)
- [x] 기본 타입 정의:
  - `EntityId` — 엔티티 식별자 (`string`)
  - `TimestampISO` — ISO 타임스탬프 (`string`)
  - `NodeType` — 노드 타입 유니온 (`note | image | file | board_link | document | calendar | ai_summary`)
  - `NoteNodeData` — 메모 노드 데이터 (`markdown`, 선택적 `title`, `style.backgroundColor`)
  - `InboxNote` — Inbox 메모 도메인 타입 (`id`, `markdown`, `title?`, `createdAt`)

### 4.3 앱 셸 레이아웃

- [x] **3패널 구조**: 좌측 사이드바 · 중앙 캔버스 · 우측 디테일 패널
- [x] **드래그 리사이즈**: 좌측(180–720px, 기본 224px) / 우측(220–840px, 기본 288px)
  - `PointerEvent` 기반 드래그 핸들
  - 호버 시 파란색 하이라이트
- [x] **반응형 대응**: 좌측 `md:flex`, 우측 `lg:flex` (모바일에서 숨김)
- [x] **밝은 테마**: 흰색 배경, `color-scheme: light`

### 4.4 사이드바 (`Sidebar`)

- [x] "Drafty beta" 로고 영역 (h-12)
- [x] 보드 목록 표시 (이모지 + 이름)
- [x] 보드 선택 상태 (파란색 배경 하이라이트)
- [x] "New Board" 버튼 (비활성 상태)

### 4.5 상단 바 (`Topbar`)

- [x] 현재 보드 제목 표시 (좌측, truncate)
- [x] 검색 입력 필드 (비활성 플레이스홀더)
- [x] "AI Organize" 버튼 (비활성)
- [x] 사용자 아바타 (비활성, "U" 텍스트)

### 4.6 우측 패널 (`RightPanel`)

- [x] **Inbox 패널**: CLI/임시 메모 카드 목록 표시
  - 카드: 제목(fallback 적용), markdown preview 2줄, 캡처 시간
  - "캔버스에 추가" 버튼 — optimistic 제거 + 캔버스 노드 생성
  - 빈 상태 안내 메시지
  - 메모 개수 배지

### 4.7 캔버스 (`BoardCanvas`)

- [x] React Flow 초기화 (`@xyflow/react`)
  - pan / zoom: 트랙패드, 마우스 휠
  - 최소 줌 0.1, 최대 줌 4
  - 점 격자 배경 (`BackgroundVariant.Dots`, gap 24)
- [x] 보드 전환 시 캔버스 상태 초기화 (`useEffect`)
- [x] 선택 상태 추적 (`nodeIds[]`, `edgeIds[]`)
- [x] 빈 캔버스 안내 오버레이 (`CanvasEmptyState`)
- [x] **Inbox→캔버스 노드 생성**: `pendingInboxNotes` 큐 기반 순차 소비
  - `screenToFlowPosition` 기반 뷰포트 중앙 배치
  - 여러 메모 동시 추가 시 20px 오프셋으로 겹침 방지

### 4.8 메모 노드 (`NoteNode`)

- [x] 커스텀 노드 컴포넌트 등록 (`nodeTypes`)
- [x] 흰색 배경, 미니멀 그림자 (`shadow-[0_1px_4px_rgba(0,0,0,0.07)]`)
- [x] 선택 시 파란색 테두리 링
- [x] `NodeResizer` — 선택 시에만 표시, 최소 120×80px
- [x] **더블클릭 생성**: 캔버스 빈 영역 더블클릭 → 새 NoteNode 추가
  - `screenToFlowPosition` 좌표 변환
  - 기본 크기 180×130px
- [x] **Markdown preview 렌더링**: 제목(heading fallback) + 본문 preview (`line-clamp-3`)

### 4.9 목 데이터

- [x] **보드 4개**: Inbox(📥), Product Ideas(💡), Research(🔬), Writing(✍️)
- [x] **기본 선택 보드**: `product-ideas`
- [x] **초기 노드 3개** (Product Ideas 보드) — markdown 형식
- [x] 나머지 보드: 빈 캔버스
- [x] **Inbox 메모 5개** (`mock-inbox-notes.ts`) — 짧은 캡처형 2개 + 구조화된 메모 3개

### 4.10 Markdown 유틸리티 (`lib/markdown-preview.ts`)

- [x] `extractTitle(markdown, explicitTitle?)` — heading fallback 제목 추출
- [x] `stripMarkdown(markdown, maxLength?)` — 미리보기용 순수 텍스트 변환 (정규식, 외부 의존 없음)

### 4.11 데이터 흐름 (Inbox → 캔버스)

```
RightPanel.onAddToCanvas(id)
  → AppShell.onAddToCanvas(id)
    → page.handleAddToCanvas(id)
      → setInboxNotes 제거(optimistic) + setPendingInboxNotes 추가
        → BoardCanvas pendingInboxNotes useEffect
          → setNodes 추가 + onInboxNoteAdded(id)
            → page.handleInboxNoteAdded(id)
              → setPendingInboxNotes 제거
```

---

## 5. 미구현 항목 (현재 범위 밖)

아래 항목은 PRD에 정의되어 있으나 현재 브랜치 범위에 포함되지 않은 기능이다.

### 인증 및 백엔드

- [ ] Supabase 연동 (Auth, DB, Storage, RLS)
- [ ] 이메일 기반 회원가입 / 로그인
- [ ] 세션 유지 및 계정별 데이터 분리
- [ ] 자동 저장 / 동기화

### 보드 관리

- [ ] 보드 생성 / 이름 변경 / 삭제 / 보관 (New Board 버튼 비활성 상태)
- [ ] Inbox 보드 특수 처리
- [ ] viewport 상태 서버 저장

### 노드 타입 확장

- [ ] 이미지 노드 (`image`)
- [ ] 파일 노드 (`file`)
- [ ] 문서 노드 (`document`)
- [ ] 캘린더 노드 (`calendar`)
- [ ] 보드 링크 노드 (`board_link`)
- [ ] AI 요약 노드 (`ai_summary`)

### 노드 기능

- [ ] 노드 텍스트 인라인 편집 (Tiptap rich text)
- [ ] 노드 삭제 (`deleteKeyCode` 현재 `null`)
- [ ] 노드 복제
- [ ] 멀티 선택 동작
- [ ] z-index 관리
- [ ] 태그 / 색상 / 스타일 설정

### 엣지 (화살표)

- [ ] 노드 간 화살표 연결 생성 (`connectOnClick` 현재 `false`)
- [ ] 엣지 라벨 / 색상 / 스타일
- [ ] 엣지 삭제

### 검색

- [ ] 키워드 검색 (검색 입력 현재 비활성)
- [ ] 의미 검색 (pgvector)

### AI 정리

- [ ] AI organize 제안 생성
- [ ] 제안 패널 UI
- [ ] 제안 검토 및 적용 흐름

### CLI

- [ ] CLI 도구 (`drafty` 명령)
- [ ] 토큰 기반 인증
- [ ] 터미널 메모 입력

### 기타

- [ ] 첨부파일 업로드 (드래그 앤 드롭)
- [ ] 히스토리 / revision 관리
- [ ] 다크 모드
- [ ] 키보드 단축키

---

## 6. 구현 계획 문서 이력

| 파일                                                                                     | 주제               | 상태    |
| ---------------------------------------------------------------------------------------- | ------------------ | ------- |
| [plan-draftyInitMonorepo.prompt.md](plans/plan-draftyInitMonorepo.prompt.md)             | 모노레포 초기화    | ✅ 완료 |
| [plan-appShellLayout.prompt.md](plans/plan-appShellLayout.prompt.md)                     | 앱 셸 레이아웃     | ✅ 완료 |
| [plan-rootShellResizablePanels.prompt.md](plans/plan-rootShellResizablePanels.prompt.md) | 패널 리사이즈 통합 | ✅ 완료 |
| [deepplan-noteNodeBasic.prompt.md](plans/deepplan-noteNodeBasic.prompt.md)               | NoteNode 기본 구현 | ✅ 완료 |

---

## 7. 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────┐
│                     page.tsx (클라이언트)                  │
│  state: selectedBoardId                                  │
│                                                          │
│  ┌─────────── AppShell ─────────────────────────────┐   │
│  │  ┌──────────┐  ┌─────────────────┐  ┌─────────┐ │   │
│  │  │ Sidebar  │⇔│     Topbar      │  │  Right  │ │   │
│  │  │          │  ├─────────────────┤  │  Panel  │ │   │
│  │  │ 보드 목록 │  │  BoardCanvas    │  │ 선택 항목│ │   │
│  │  │          │  │  ┌───────────┐  │  │ (미구현) │ │   │
│  │  │          │  │  │ NoteNode  │  │  │         │ │   │
│  │  │          │  │  │ NoteNode  │  │  │         │ │   │
│  │  │          │  │  │ NoteNode  │  │  │         │ │   │
│  │  │          │  │  └───────────┘  │  │         │ │   │
│  │  └──────────┘  └─────────────────┘  └─────────┘ │   │
│  │     ⇔ 드래그 리사이즈 핸들 ⇔                       │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 데이터 흐름

```
mock-boards.ts ──→ page.tsx ──→ Sidebar (보드 목록)
                      │    ──→ Topbar  (보드 제목)
                      ▼
mock-board-canvas.ts ──→ BoardCanvas ──→ React Flow
                                            │
                         NoteNode ←─────────┘
                         CanvasEmptyState ←──┘

shared-types/src/index.ts ──→ NoteNodeData 타입 참조
```
