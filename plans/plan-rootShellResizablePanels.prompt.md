## Plan: Root Shell Consolidation + Resizable Panels

`/app` 라우트를 제거하고 루트(`/`)를 앱 셸 진입점으로 통합합니다. 기존 앱 셸 상태/구조를 `app-shell` 컴포넌트로 옮긴 뒤, 좌/우 패널 드래그 리사이즈와 Topbar 검색 우측 고정을 적용하는 방향입니다.

**Steps**

1. `/app` 구조 역할 정리: 현재 `apps/web/app/app/layout.tsx`, `apps/web/app/app/page.tsx`의 책임을 루트 진입으로 옮길 항목을 확정한다.
2. `app-shell` 추출: `apps/web/components/layout/app-shell.tsx`를 생성하고 보드 선택 상태(`selectedBoardId`)와 셸 조립 책임을 이관한다. `*depends on 1*`
3. 좌측 리사이즈 구현: `app-shell.tsx`에 좌측 폭 상태(초기 224px), 핸들 드래그, 최소/최대 폭 clamp(예: 180~360px), `md` 이상 동작 제한을 추가한다. `*depends on 2*`
4. 우측 리사이즈 구현: `app-shell.tsx`에 우측 폭 상태(초기 288px), 핸들 드래그, 최소/최대 폭 clamp(예: 220~420px), `lg` 이상 동작 제한을 추가한다. `*parallel with 3, depends on 2*`
5. Topbar 재배치: `apps/web/components/layout/topbar.tsx`에서 검색창을 중앙에서 제거하고 우측 액션 그룹(`검색 + AI Organize + 사용자`)으로 이동해 `ml-auto` 고정 정렬로 만든다. `*parallel with 3/4*`
6. 루트 페이지 전환: `apps/web/app/page.tsx`의 랜딩 문구/버튼을 제거하고, `AppShell` 안에서 캔버스 placeholder가 바로 렌더링되게 변경한다. `*depends on 2*`
7. `/app` 라우트 제거: `apps/web/app/app/layout.tsx`, `apps/web/app/app/page.tsx`를 삭제해 `/app` 접근을 제거(404 허용)한다. `*depends on 6*`
8. 패널 폭 책임 정리: `apps/web/components/layout/sidebar.tsx`, `apps/web/components/layout/right-panel.tsx`에서 고정 폭 클래스(`w-56`, `w-72`)를 제거하고 부모(`app-shell.tsx`)가 폭을 제어하도록 정리한다. `*depends on 3/4*`
9. 접근성 보강: 리사이즈 핸들에 `role="separator"`, `aria-orientation="vertical"`, `aria-label`을 추가하고 드래그 중 텍스트 선택 간섭을 줄인다. `*depends on 3/4*`
10. 검증: `pnpm lint`, `pnpm typecheck`, `pnpm build` + 수동 UI 검증을 수행한다. `*depends on 5~9*`

**Relevant files**

- `apps/web/components/layout/app-shell.tsx` — 신규, 앱 셸 조립/보드 상태/리사이즈 상태 관리
- `apps/web/app/page.tsx` — 루트 랜딩 제거, 앱 셸 직접 렌더링
- `apps/web/components/layout/topbar.tsx` — 검색 우측 고정 배치
- `apps/web/components/layout/sidebar.tsx` — 폭 제어를 부모 위임하도록 정리
- `apps/web/components/layout/right-panel.tsx` — 폭 제어를 부모 위임하도록 정리
- `apps/web/app/app/layout.tsx` — 삭제 대상
- `apps/web/app/app/page.tsx` — 삭제 대상

**Verification**

1. `pnpm lint` 통과
2. `pnpm typecheck` 통과
3. `pnpm build` 통과
4. `/` 접속 시 기존 랜딩 없이 앱 셸 즉시 노출
5. 보드 제목 변경 시 검색창의 가로 위치 고정 유지
6. 좌측 패널 드래그 리사이즈 정상 동작(최소/최대 폭 clamp)
7. 우측 패널 드래그 리사이즈 정상 동작(최소/최대 폭 clamp)
8. `md` 미만 좌측 숨김, `lg` 미만 우측 숨김 시 레이아웃 깨짐 없음
9. `/app` 경로 미제공(404) 확인

**Decisions**

- 포함: 루트 통합, 좌/우 리사이즈, 검색 우측 고정
- 제외: React Flow, 실제 검색/AI, 상태 영속화(localStorage), 인증/DB
- `/app` 처리: 리다이렉트 없이 제거(요청 기준 기본안)
