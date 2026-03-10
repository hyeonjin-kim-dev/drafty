현재 캔버스는 `snapshotMap`이 빈 객체이고 `nodeTypes`도 빈 객체라 어떤 실제 노드도 렌더링되지 않는다. 이 두 축을 동시에 해결하면서, 더블클릭 생성 흐름과 선택 시각화(resize 핸들 포함)를 붙이는 것이 이번 브랜치의 실질적 근본 과제다. `NoteNodeData` 타입은 React Flow 비종속적으로 `shared-types`에 정의하여 다음 브랜치의 CRUD 확장 기반을 만든다.

---

## 파일 구조

```
packages/shared-types/src/
└── index.ts                     # [수정] NoteNodeData 타입 추가

apps/web/
├── components/canvas/
│   ├── note-node.tsx            # [신규] NoteNode 커스텀 노드 컴포넌트
│   ├── board-canvas.tsx         # [수정] nodeTypes 등록 + onInit + 더블클릭 핸들러
│   └── canvas-empty-state.tsx   # [변경 없음]
├── data/~
│   └── mock-board-canvas.ts     # [수정] product-ideas 보드에 NoteNode 3개 seed
└── app/
    └── globals.css              # [수정] React Flow 기본 선택 outline 소량 오버라이드
```

신규 파일 1개(`note-node.tsx`), 수정 파일 4개

---

## 구현 순서

### 1단계 — `packages/shared-types/src/index.ts`: `NoteNodeData` 타입 추가

React Flow 비종속 순수 도메인 타입. `@xyflow/react` import 없이 정의한다.

```ts
export type NoteNodeData = {
  content: string;
  style?: {
    backgroundColor?: string; // 다음 브랜치 색상 커스터마이즈 대비
  };
};
```

- 기존 `NodeType` union에 `'note'`가 이미 포함되어 있어 union 변경 불필요
- `packages/shared-types`는 프레임워크 비종속 유지 — `@xyflow/react` 타입을 여기로 올리지 않는다

### 2단계 — `apps/web/data/mock-board-canvas.ts`: mock NoteNode 3개 seed

`product-ideas` 보드에 `type: 'note'` 노드 3개를 추가한다.

- 각 노드에 `style: { width: 180, height: 130 }` 명시 — NodeResizer 초기화에 필수
- position을 서로 다르게 분산 배치: `{x: 80, y: 100}`, `{x: 320, y: 60}`, `{x: 190, y: 280}`
- 로컬 타입 별칭 `type NoteNode = Node<NoteNodeData, 'note'>` 사용

```ts
import type { Node } from '@xyflow/react';
import type { NoteNodeData } from '@drafty/shared-types';

type NoteNode = Node<NoteNodeData, 'note'>;

const productIdeasNodes: NoteNode[] = [
  {
    id: 'note-1',
    type: 'note',
    position: { x: 80, y: 100 },
    data: { content: '첫 번째 아이디어' },
    style: { width: 180, height: 130 },
  },
  {
    id: 'note-2',
    type: 'note',
    position: { x: 320, y: 60 },
    data: { content: '두 번째 아이디어' },
    style: { width: 180, height: 130 },
  },
  {
    id: 'note-3',
    type: 'note',
    position: { x: 190, y: 280 },
    data: { content: '세 번째 아이디어' },
    style: { width: 180, height: 130 },
  },
];
```

### 3단계 — `apps/web/components/canvas/note-node.tsx`: NoteNode 컴포넌트 신규 생성

`'use client'` 불필요 — 상위 `board-canvas.tsx`의 `'use client'`로 커버됨.

**UI 명세:**
- 루트: `w-full h-full` — React Flow가 `style.width/height`를 외부 컨테이너에 적용함
- 배경: `bg-white rounded-none` — 메모장 직각 모서리
- 그림자: `shadow-[0_1px_4px_rgba(0,0,0,0.07)]` — 절제된 메모장 질감
- 내부: `p-3 text-sm text-gray-800 whitespace-pre-wrap break-words`
- 선택 테두리: `selected` prop 기반 조건부 `ring-1 ring-inset ring-blue-500/50`
- `NodeResizer`: `isVisible={selected}`, `minWidth={120}`, `minHeight={80}`
  - `lineStyle`: `{ border: '1px solid rgba(59,130,246,0.4)' }`
  - `handleStyle`: `{ width: 6, height: 6, borderRadius: 1, backgroundColor: '#3b82f6', border: '1px solid #fff' }` — Tailwind로 React Flow 내부 컴포넌트 제어 불가하므로 인라인 예외 허용

`NoteNodeType = Node<NoteNodeData, 'note'>` export — React Flow 의존 타입은 이 파일 내부에서만 정의

### 4단계 — `apps/web/components/canvas/board-canvas.tsx`: nodeTypes 등록 + 더블클릭 생성

**4-A. `nodeTypes` 등록** — 컴포넌트 외부 모듈 상수로 선언해 렌더마다 새 객체 생성을 방지한다.

```ts
const nodeTypes: NodeTypes = {
  note: NoteNode,
};
```

**4-B. `onInit` 콜백으로 ReactFlow 인스턴스 캡처** — `useReactFlow()`는 `ReactFlowProvider` 컨텍스트 내부에서만 호출 가능하므로 `onInit` 패턴 사용. `ReactFlowProvider` 분리는 이번 브랜치에서 과한 추상화로 생략.

```ts
const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
```

**4-C. 더블클릭 핸들러** — `.react-flow__pane` target 필터링 필수. 노드 위 더블클릭 이벤트가 버블링되어 올라오므로 반드시 검사해야 한다.

```ts
const onPaneDoubleClick = useCallback(
  (e: React.MouseEvent) => {
    const target = e.target as Element;
    if (!target.classList.contains('react-flow__pane')) return;
    if (!rfInstance) return;

    const position = rfInstance.screenToFlowPosition({ x: e.clientX, y: e.clientY });
    const newNode: Node<NoteNodeData, 'note'> = {
      id: `note-${Date.now()}`,
      type: 'note',
      position,
      data: { content: '' },
      style: { width: 180, height: 130 },
    };
    setNodes((prev) => [...prev, newNode]);
  },
  [rfInstance, setNodes],
);
```

`<ReactFlow>` 컴포넌트에 `onDoubleClick={onPaneDoubleClick}`, `onInit={setRfInstance}` 추가.

### 5단계 — `apps/web/app/globals.css`: React Flow 기본 선택 outline 제거

```css
/* React Flow 기본 선택 box-shadow 제거 — NoteNode의 ring으로 대체 */
.react-flow__node.selected {
  box-shadow: none;
}
```

---

## 결정 사항

| 주제 | 결정 | 이유 |
|---|---|---|
| `NoteNodeData` 위치 | `packages/shared-types` | React Flow 비종속 순수 도메인 타입; CLI/AI worker 등 미래 패키지 공유 가능 |
| React Flow 의존 타입(`NoteNodeType`) | `note-node.tsx` 내부 export | `shared-types`를 프레임워크 비종속으로 유지 |
| `ReactFlowProvider` 분리 | 생략, `onInit` 패턴 사용 | 이번 브랜치는 단순성 우선; Provider 분리는 다음 브랜치에서 CRUD 복잡도 증가 시 고려 |
| content 인라인 편집 | 이번 브랜치에서 표시만 | Tiptap 도입은 `feat/rich-text-editor-tiptap`에서 |
| 임시 노드 보존 | 보드 전환 후 소실 허용 | `useEffect`의 `setNodes(next.initialNodes)` 재적용은 의도된 설계; mock/local state 수준 |
| NodeResizer 핸들 `handleStyle` | 인라인 style prop 예외 허용 | Tailwind로 React Flow 내부 컴포넌트 스타일링 불가 |
| `nodeTypes` 선언 위치 | 모듈 상수 | 컴포넌트 내부 선언 시 렌더마다 새 객체 생성 → React Flow 노드 리마운트 발생 |
| connection handle 노출 | 이번 브랜치에서 처리 생략 | `connectOnClick={false}` 이미 설정; 기능적 문제 없음 |

---

## 주요 위험 및 대응

| 위험 | 심각도 | 대응 |
|---|---|---|
| 더블클릭 이벤트 버블링 | 높음 | `target.classList.contains('react-flow__pane')` 검사 필수 |
| NodeResizer 초기 사이즈 미설정 | 중간 | mock 노드 및 신규 생성 노드 모두 `style: { width: 180, height: 130 }` 명시 |
| `nodeTypes` 컴포넌트 내부 선언 | 높음 | 반드시 컴포넌트 외부 모듈 상수로 선언 |
| `CanvasEmptyState` 조건 충돌 | 낮음 | `nodes.length === 0` 조건 정상 동작; mock 노드 3개 → `product-ideas` 보드에서 오버레이 숨김 |
| `crypto.randomUUID()` 서버 컨텍스트 | 낮음 | `board-canvas.tsx`가 이미 `'use client'` 선언됨 |

---

## 다음 브랜치 확장 지점

- `feat/node-crud-and-selection`: `NoteNodeData` 타입에 필드 추가, `board-canvas.tsx`의 핸들러 확장으로 선택/삭제/복제/다중선택 구현 가능
- `feat/rich-text-editor-tiptap`: `NoteNode` 내부 `<p>` 교체 → Tiptap 에디터; `NoteNodeData.content`를 JSON 구조로 마이그레이션

---

## 검증

```bash
pnpm typecheck   # TypeScript strict 오류 0건
pnpm lint        # ESLint 오류 0건
pnpm build       # Next.js 프로덕션 빌드 성공
```

**브라우저 수동 체크리스트:**

| # | 확인 항목 | 기대 결과 |
|---|---|---|
| 1 | `product-ideas` 보드 진입 | NoteNode 3개가 서로 다른 위치에 렌더링됨 |
| 2 | 노드 외관 | 직각 모서리, 흰 배경, 절제된 미세 그림자 |
| 3 | 노드 드래그 | 이동 후 위치 즉시 반영됨 |
| 4 | 노드 클릭 선택 | 얇은 파란 ring 테두리 + 4 모서리 핸들 표시 |
| 5 | 핸들 드래그 | 노드 resize 동작 |
| 6 | 선택 해제 | 테두리·핸들 사라짐 |
| 7 | 빈 캔버스 더블클릭 | 클릭 위치 근처에 새 NoteNode 생성 |
| 8 | 노드 위 더블클릭 | 새 노드 생성되지 않음 |
| 9 | `inbox` 등 다른 보드 | 빈 캔버스 + `CanvasEmptyState` 오버레이 표시 |
| 10 | pan/zoom 기존 동작 | 이상 없음, 콘솔 오류 없음 |
