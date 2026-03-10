## 가정사항

- `page.tsx`가 `inboxNotes` 상태 허브 역할을 담당한다.
- `InboxNote`는 도메인 공유 타입(프레임워크 비종속)이므로 `shared-types`에 추가한다.
- external markdown 파싱 라이브러리(`react-markdown` 등)는 추가하지 않는다. 순수 정규식 helper로 구현한다.
- `right-panel.tsx` 파일명을 유지하고 내용만 전면 교체한다 (단순성 우선).
- `InboxNoteCard`는 `right-panel.tsx` 파일 내 로컬 컴포넌트로 정의한다.
- Add to canvas 후 노드 위치는 `rfInstance.screenToFlowPosition` 기반 뷰포트 중앙으로 배치한다.
- 카드 제거는 Add to canvas 클릭 즉시(optimistic) 처리한다.
- 보드 전환 시 기존 snapshot 초기화 동작을 유지한다.

## 미해결 질문

- Add to canvas 대상은 현재 선택된 보드의 캔버스로 고정한다.
- 제목 fallback 규칙: `#` 헤딩 첫 줄 → 텍스트 첫 줄 → `'(제목 없음)'` 순서로 적용한다.
- 연속 빠른 클릭에서 노드 유실 방지를 위해 단일 `pendingNote` 대신 배열 큐(`pendingInboxNotes: InboxNote[]`)를 사용한다.
- 보드 전환 시 `pendingInboxNotes` 큐가 소비되지 않은 채 남을 수 있으므로, 큐 항목이 남아 있으면 새 보드 캔버스에서도 소비된다. 이번 브랜치에서는 허용 범위로 둔다.

## 관련 파일 / 심볼

| 파일 | 변경 여부 | 주요 심볼 |
|------|-----------|-----------|
| `packages/shared-types/src/index.ts` | **수정** | `NoteNodeData` (content→markdown, title? 추가), `InboxNote` 신규 추가 |
| `apps/web/data/mock-board-canvas.ts` | **수정** | `productIdeasNodes` data 키 `content` → `markdown` |
| `apps/web/data/mock-inbox-notes.ts` | **신규** | `mockInboxNotes: InboxNote[]` |
| `apps/web/lib/markdown-preview.ts` | **신규** | `extractTitle`, `stripMarkdown` |
| `apps/web/components/canvas/note-node.tsx` | **수정** | `NoteNode` 렌더링 markdown preview 기반으로 전환 |
| `apps/web/components/canvas/board-canvas.tsx` | **수정** | `BoardCanvasProps` 확장, `pendingInboxNotes` useEffect 소비 |
| `apps/web/components/canvas/canvas-empty-state.tsx` | **수정** | Inbox 안내 문구로 교체 |
| `apps/web/components/layout/right-panel.tsx` | **수정 (전면 교체)** | `RightPanelProps`, `InboxNoteCard` 로컬 컴포넌트 |
| `apps/web/components/layout/app-shell.tsx` | **수정** | `AppShellProps`에 `inboxNotes`, `onAddToCanvas` 추가 |
| `apps/web/app/page.tsx` | **수정** | `inboxNotes`, `pendingInboxNotes` state, 콜백 핸들러 |
| `IMPLEMENTATION.md` | **수정** | 브랜치 완료 항목, 아키텍처 반영 |

## 구현 계획

### Phase 1 — 공유 타입 변경 (기반)

**`packages/shared-types/src/index.ts` 수정**

```typescript
// content → markdown 필드명 변경, title 선택적 추가
export type NoteNodeData = {
  markdown: string;  // raw markdown; source of truth
  title?: string;    // 명시적 제목; 없으면 markdown 첫 줄에서 fallback
  style?: {
    backgroundColor?: string;
  };
};

// CLI/inbox 임시 메모 — 프레임워크 비종속 도메인 타입
export type InboxNote = {
  id: EntityId;
  markdown: string;
  title?: string;
  createdAt: TimestampISO;
};
```

> **위험**: `content` → `markdown` 필드명 변경은 `mock-board-canvas.ts`, `note-node.tsx`, `board-canvas.tsx` 에 cascading 영향을 준다. Phase 1 완료 직후 Phase 2를 연속 진행해야 한다. 중간에 typecheck 실행 시 빌드 실패한다.

---

### Phase 2 — Mock 데이터 정비

**`apps/web/data/mock-board-canvas.ts` 수정**

`data.content` → `data.markdown` 필드명 교체. 기존 문자열 값은 markdown 형식으로 자연스럽게 업데이트한다.

**`apps/web/data/mock-inbox-notes.ts` 신규 생성**

```typescript
import type { InboxNote } from '@drafty/shared-types';

export const mockInboxNotes: InboxNote[] = [
  // CLI에서 온 짧은 캡처형 메모 (2개)
  // markdown 구조가 있는 긴 메모 (3개)
  // 총 5개; 짧은 것과 긴 것의 혼합
];
```

---

### Phase 3 — Markdown 유틸리티 신규 생성

**`apps/web/lib/markdown-preview.ts` 신규 생성**

```typescript
/**
 * markdown 본문에서 표시용 제목 추출.
 * 명시적 제목이 있으면 반환.
 * 없으면 첫 줄에서 '#' heading 기호 제거 후 반환.
 * 없으면 '(제목 없음)' 반환.
 */
export function extractTitle(markdown: string, explicitTitle?: string): string;

/**
 * markdown 문법 기호를 제거한 순수 텍스트 반환 (카드/노드 미리보기용).
 * heading, bold, italic, inline code, link, list marker 제거.
 * maxLength 이후는 잘라낸다 (기본 80자).
 */
export function stripMarkdown(markdown: string, maxLength?: number): string;
```

의존성 없이 정규식으로만 구현한다.

---

### Phase 4 — 캔버스 컴포넌트 수정

**`apps/web/components/canvas/note-node.tsx` 수정**

- `data.content` → `data.markdown`
- title: `extractTitle(data.markdown, data.title)` — bold, truncate
- preview: `stripMarkdown(data.markdown, 80)` — gray, `line-clamp-3`
- import 추가: `extractTitle`, `stripMarkdown` from `@/lib/markdown-preview`

**`apps/web/components/canvas/board-canvas.tsx` 수정**

```typescript
type BoardCanvasProps = {
  board: MockBoard;
  pendingInboxNotes: InboxNote[];        // 추가: inbox → canvas 대기 큐
  onInboxNoteAdded: (id: string) => void; // 추가: 소비 완료 콜백
};
```

`useEffect`로 큐 순차 소비:

```typescript
useEffect(() => {
  if (pendingInboxNotes.length === 0 || !rfInstance) return;

  const note = pendingInboxNotes[0];
  const center = rfInstance.screenToFlowPosition({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const offset = (pendingInboxNotes.length - 1) * 20;

  const newNode: Node<NoteNodeData, 'note'> = {
    id: `note-${Date.now()}`,
    type: 'note',
    position: { x: center.x + offset, y: center.y + offset },
    data: { markdown: note.markdown, title: note.title },
    style: { width: 200, height: 140 },
  };

  setNodes((prev) => [...prev, newNode]);
  onInboxNoteAdded(note.id);
}, [pendingInboxNotes, rfInstance, setNodes, onInboxNoteAdded]);
```

더블클릭 생성 시 `data: { markdown: '' }` 로 필드명 갱신.

**`apps/web/components/canvas/canvas-empty-state.tsx` 수정**

- 안내 문구: "Inbox 패널에서 메모를 추가하거나 캔버스를 더블클릭해 시작하세요"

---

### Phase 5 — 우측 패널 전면 교체

**`apps/web/components/layout/right-panel.tsx` 전면 교체**

```typescript
'use client';

import type { InboxNote } from '@drafty/shared-types';
import { extractTitle, stripMarkdown } from '@/lib/markdown-preview';

type RightPanelProps = {
  inboxNotes: InboxNote[];
  onAddToCanvas: (id: string) => void;
};

export function RightPanel({ inboxNotes, onAddToCanvas }: RightPanelProps) { ... }

// 파일 내 로컬 컴포넌트
function InboxNoteCard({ note, onAddToCanvas }: {
  note: InboxNote;
  onAddToCanvas: (id: string) => void;
}) { ... }

// 파일 내 로컬 헬퍼
function formatCapturedAt(iso: string): string { ... }
```

카드 구성:
- 제목 (fallback 적용, font-semibold, truncate)
- markdown preview 2줄 (`line-clamp-2`, gray)
- 캡처 시간 + "캔버스에 추가" 버튼 (인라인 SVG + 아이콘)

빈 상태:
- "아직 Inbox에 메모가 없습니다" 안내

---

### Phase 6 — 앱 배선

**`apps/web/components/layout/app-shell.tsx` 수정**

```typescript
import type { InboxNote } from '@drafty/shared-types';

type AppShellProps = {
  // 기존 props 유지
  inboxNotes: InboxNote[];
  onAddToCanvas: (id: string) => void;
};
```

`RightPanel`에 `inboxNotes`, `onAddToCanvas` 전달.

**`apps/web/app/page.tsx` 수정**

```typescript
// 추가 state
const [inboxNotes, setInboxNotes] = useState<InboxNote[]>(mockInboxNotes);
const [pendingInboxNotes, setPendingInboxNotes] = useState<InboxNote[]>([]);

// Add to canvas 클릭: 목록에서 제거 + 큐에 추가
const handleAddToCanvas = useCallback((id: string) => {
  setInboxNotes((prev) => prev.filter((n) => n.id !== id));
  setPendingInboxNotes((prev) => {
    const note = inboxNotes.find((n) => n.id === id);
    return note ? [...prev, note] : prev;
  });
}, [inboxNotes]);

// 캔버스 소비 완료: 큐에서 제거
const handleInboxNoteAdded = useCallback((id: string) => {
  setPendingInboxNotes((prev) => prev.filter((n) => n.id !== id));
}, []);
```

콜백 체인:
```
RightPanel.onAddToCanvas(id)
  → AppShell.onAddToCanvas(id)
    → page.handleAddToCanvas(id)
      → setInboxNotes 제거 + setPendingInboxNotes 추가
        → BoardCanvas pendingInboxNotes useEffect
          → setNodes 추가 + onInboxNoteAdded(id)
            → page.handleInboxNoteAdded(id)
              → setPendingInboxNotes 제거
```

---

### Phase 7 — IMPLEMENTATION.md 업데이트

브랜치명, 완료 기능 목록, 데이터 흐름 다이어그램 추가.

## 검증

**정적 검증 순서**

```bash
pnpm lint
pnpm typecheck
pnpm build
```

**타입 검증 포인트**

- `NoteNodeData.content` → `NoteNodeData.markdown` 변경에 따른 누락 참조 없어야 함
- `InboxNote` 타입이 `shared-types`에서 정상적으로 export/import되는지 확인
- `BoardCanvasProps` 새 props 누락 없이 `page.tsx`에서 전달되는지 확인

**수동 동작 확인 시나리오**

1. 우측 패널에 5개 Inbox 카드가 표시되고 제목 fallback이 정상 동작한다
2. "캔버스에 추가" 클릭 시: 카드가 목록에서 즉시 제거되고 캔버스에 새 NoteNode가 생성된다
3. 새로 추가된 노드와 기존 노드 모두 raw markdown이 아닌 strip된 preview 텍스트로 표시된다
4. 캔버스 더블클릭으로 생성된 노드도 타입 에러 없이 동작한다
5. 보드 전환 시 inbox/캔버스 상태가 일관되며 런타임 에러가 없다
6. 연속으로 여러 메모를 추가할 때 노드 유실 없이 모두 캔버스에 생성된다

**회귀 위험 점검**

- `pendingInboxNotes` 큐 소비 useEffect의 의존 배열 누락으로 인한 infinite loop 방지
- 보드 전환 후 이전 보드 snapshot 복원 동작과 새 노드 추가 충돌 없음
- 노드 위치 오프셋 누적으로 겹침 방지 (동시 여러 추가 시)

## 허용 범위 (이번 브랜치)

- local React state만 사용
- mock 데이터 기반 (서버 연결 없음)
- 간단한 helper 함수
- markdown preview 생성을 위한 작은 유틸 함수

## 다음 브랜치 준비 사항

이번 구현이 Supabase/CLI 연결을 쉽게 할 수 있도록 다음 인터페이스를 유지한다:

- `InboxNote` 타입은 백엔드 도메인 모델과 1:1 대응 가능한 구조
- `mockInboxNotes`를 API 응답으로 교체하면 나머지 코드가 그대로 동작
- `handleAddToCanvas` / `handleInboxNoteAdded` 콜백을 server action으로 교체 가능
