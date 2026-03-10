# 프로젝트 가이드라인

## 코드 스타일

- TypeScript 공통 설정은 `tsconfig.base.json`의 strict 기준을 따른다.
- ESLint는 `eslint.config.mjs`의 flat config를 따른다.
- Prettier는 `prettier.config.mjs`를 따른다: `singleQuote: true`, `semi: true`, `trailingComma: all`, `printWidth: 100`, `tabWidth: 2`.
- 공용 코드는 ESM 호환을 유지한다.
- 파일명은 kebab-case (`app-shell.tsx`, `mock-boards.ts`), 컴포넌트·타입 export는 PascalCase.
- `apps/web`에서 `@/*` 경로 별칭을 사용한다 (루트 기준).
- 상수는 SCREAMING_SNAKE_CASE (`LEFT_MIN`, `DEFAULT_BOARD_ID`).
- Props 타입은 `{ComponentName}Props` 패턴으로 명명한다 (`AppShellProps`, `SidebarProps`).

## 아키텍처

- 이 저장소는 부트스트랩 모노레포다. 사용자가 명시적으로 제품 기능 구현을 요청하지 않는 한, 기본 골격 작업 범위를 유지한다.
- 워크스페이스 경계:
  - `apps/web`: Next.js 15 App Router 프론트엔드 (React 19)
  - `packages/shared-types`: 프레임워크 비종속 공통 TypeScript 타입 — 빌드 산출물 없이 소스 직접 참조(`exports` → `./src/index.ts`)
- 웹 앱에서 shared types를 사용할 때는 `apps/web/next.config.ts`의 `transpilePackages`에 `@drafty/shared-types`가 포함되도록 유지한다.
- 현재 브랜치에서 **제외된 범위**: Supabase, Auth/DB, Tiptap 에디터, CLI, AI worker, 다크 모드. 자세한 scope는 `README.md` 참조.
- 타입 배치 원칙:
  - **도메인 공유 타입** (프레임워크 비종속): `packages/shared-types/src/index.ts` — `NoteNodeData`, `EntityId`, `TimestampISO` 등
  - **프레임워크 종속 타입** (React Flow 등): 사용하는 컴포넌트 파일 내 로컬 정의 — `type NoteNodeType = Node<NoteNodeData, 'note'>`
  - `shared-types`에서 `apps/web` 모듈을 import하지 않는다.

## UI 스택

- 순수 Tailwind CSS 유틸리티 클래스만 사용한다. 외부 컴포넌트 라이브러리(shadcn, Radix 등)는 현재 도입하지 않았다.
- `'use client'`는 이벤트 핸들러나 상태가 필요한 컴포넌트에만 최소한으로 붙인다. 부모가 Client Component이면 자식은 별도 선언 불필요.
- 아이콘은 인라인 SVG로 직접 작성한다.
- `tailwind.config.ts`의 content 경로(`./app/**`, `./components/**`)를 새 디렉터리 추가 시 함께 갱신한다.
- 상태 관리는 `useState` 기반 로컬 상태 + props 전파를 기본으로 한다 (전역 상태 라이브러리 미도입).
- flex 컨테이너의 자식 오버플로우 방지를 위해 `flex-1 min-w-0 min-h-0` 조합을 사용한다.

## 캔버스 (React Flow)

- `@xyflow/react` 12.x 사용. 캔버스 관련 컴포넌트는 `components/canvas/` 디렉터리에 배치한다.
- `nodeTypes` 객체는 **반드시 컴포넌트 외부 모듈 상수**로 선언한다. 렌더 함수 내부에 정의하면 매 렌더마다 새 객체가 생성되어 노드가 리마운트된다.
- `onPaneDoubleClick` 등 pane 이벤트 핸들러에서 `event.target`이 `.react-flow__pane` 클래스를 가지는지 확인한다. 노드 위 더블클릭이 버블링될 수 있다.
- `useReactFlow()`는 `<ReactFlowProvider>` 내부에서만 호출 가능하다. Provider 외부에서 인스턴스가 필요하면 `onInit` 콜백으로 캡처한다.
- React Flow 내부 컴포넌트(`NodeResizer` 등)는 Tailwind 클래스가 적용되지 않으므로 인라인 `style` prop을 예외적으로 허용한다.
- `globals.css`에서 `@import '@xyflow/react/dist/style.css'`를 Tailwind 지시어보다 앞에 선언한다.

## 빌드 및 검증

- 의존성 설치: `pnpm install`
- 개발 서버 실행: `pnpm dev`
- 린트: `pnpm lint`
- 타입 체크: `pnpm typecheck`
- 빌드: `pnpm build`
- 포맷: `pnpm format`
- 현재 전용 테스트 스위트는 없으므로, 변경 검증은 기본적으로 lint/typecheck/build 통과로 수행한다.

## 응답 언어

- 앞으로 생성하는 모든 응답은 한국어로 작성한다.
- 앞으로 생성하는 코드 주석은 한국어로 작성한다.
- 앞으로 생성하는 Markdown 문서는 한국어로 작성한다.
- 단, 코드 식별자, 라이브러리 이름, 명령어, 파일 경로, 설정 키는 원문 표기를 유지한다.

## 컨벤션

- 워크스페이스 작업은 `pnpm` 사용을 우선한다.
- 루트 스크립트는 `--if-present`로 재귀 실행되므로, 일부 패키지 스크립트가 없으면 해당 작업이 건너뛰어질 수 있음을 고려한다.
- `packages/shared-types`는 타입과 가벼운 export 중심으로 유지하고, 런타임 의존이 큰 로직은 피한다.
- 비밀 정보는 커밋하지 않는다. `.env.example` 및 `apps/web/.env.example`를 템플릿으로 사용한다.
- 현재 브랜치의 범위와 비목표는 `README.md`를 기준 문서로 사용한다.
- 플랜 문서(`plan-{camelCase}.prompt.md`)는 저장소 루트의 `plans/` 디렉터리에 생성하고 관리한다.
- 임시 `untitled:` 플랜 문서로 시작했더라도 확정본은 `plans/`로 이동해 반영한다.
- 제품 요구사항은 `PRD.md`를 참조한다.
