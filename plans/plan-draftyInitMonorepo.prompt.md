## Plan: Drafty Init Monorepo Skeleton

Drafty 초기 브랜치에서는 기능 구현 없이, `pnpm install` 후 `pnpm dev`로 바로 실행 가능한 최소 모노레포 골격을 구성한다. 핵심은 `apps/web`를 중심으로 Next.js(App Router)+TypeScript+Tailwind 개발환경을 잡고, `packages/shared-types`를 만들어 이후 웹/CLI/API 확장 기반을 확보하는 것이다. `packages/config-*`는 현재 시점에 과도하므로 분리하지 않고 루트 공통 설정으로 유지한다.

**Steps**

1. Phase 1 - Workspace Foundation: 루트 워크스페이스/도구 설정 생성 (_선행 단계, 다른 단계의 기반_)
2. 루트에 `package.json`, `pnpm-workspace.yaml`, `.npmrc`, `.gitignore`, `tsconfig.base.json`(또는 `tsconfig.json`)을 작성해 workspace 경계와 공통 TypeScript 기준을 고정한다.
3. 루트 스크립트는 최소로 구성한다: `dev`는 `@drafty/web`만 실행, `build/lint/typecheck`는 workspace 전체를 `--if-present`로 실행해 초기 패키지 증감에 유연하게 대응한다.
4. 루트 ESLint/Prettier 설정을 flat/minimal로 만든다. 현재는 루트 1세트만 두고, app/package에서 필요 시 extends만 하도록 설계한다.
5. Phase 2 - Web App Skeleton: `apps/web` 최소 Next.js 앱 구성 (_depends on 1_)
6. `apps/web`에 App Router 기준 파일(`app/layout.tsx`, `app/page.tsx`, `app/globals.css`)과 Next 설정(`next.config.ts`, `tsconfig.json`, `postcss.config.js`, `tailwind.config.ts`, `package.json`)을 만든다.
7. 홈 화면은 제품 기능 없이 최소 안내 UI만 포함한다: 제목 `Drafty`와 "초기 골격 단계" 안내 문구 2~3줄.
8. `apps/web/.env.example`에 현재 비어 있어도 되는 키와 향후 확장 예정 키(Supabase/AI/CLI API)를 주석 포함 형태로 정의한다. 실제 값은 비워둔다.
9. Phase 3 - Shared Package Skeleton: `packages/shared-types` 생성 (_parallel with 6-8 가능_)
10. `packages/shared-types`에 `package.json`, `tsconfig.json`, `src/index.ts`를 만들고, 정말 최소 공통 타입만 선언한다: `EntityId`, `TimestampISO`, `NodeType` 정도의 placeholder 타입.
11. `apps/web`에서 `@drafty/shared-types`를 dependency로 연결하고, 한 번 import해 경로/빌드 파이프가 정상인지 확인한다.
12. Phase 4 - Docs & Scripts Hardening: 실행/검증 문서화 (_depends on 1-11_)
13. 루트 `.env.example`를 작성한다. 공통 런타임 변수명만 선언하고 실제 기능용 비밀값은 채우지 않는다.
14. 루트 `README.md`를 작성한다: 프로젝트 목적(초기 골격), 폴더 구조, 설치/실행 명령, 스크립트 설명, 이번 브랜치 비범위(Supabase/Auth/Canvas/CLI/AI 미구현).
15. 루트/웹/패키지 스크립트를 최종 정리한다: `dev`, `build`, `lint`, `typecheck`, `format`.
16. Verification 단계에서 `pnpm install`, `pnpm dev`, `pnpm lint`, `pnpm typecheck`, `pnpm build`를 순서대로 실행해 통과 상태를 확인한다.

**Relevant files**

- `c:/Users/wlszl/hyeonjin-kim-dev/drafty/package.json` — 루트 workspace 메타데이터와 전체 스크립트 진입점 정의
- `c:/Users/wlszl/hyeonjin-kim-dev/drafty/pnpm-workspace.yaml` — `apps/*`, `packages/*` workspace 등록
- `c:/Users/wlszl/hyeonjin-kim-dev/drafty/.npmrc` — pnpm 기본 정책(초기 설치/호환성)
- `c:/Users/wlszl/hyeonjin-kim-dev/drafty/.gitignore` — Node/Next 산출물과 env 파일 제외
- `c:/Users/wlszl/hyeonjin-kim-dev/drafty/tsconfig.base.json` — 공통 TS strict 설정 기준
- `c:/Users/wlszl/hyeonjin-kim-dev/drafty/eslint.config.mjs` — 루트 ESLint flat config 최소 설정
- `c:/Users/wlszl/hyeonjin-kim-dev/drafty/prettier.config.mjs` — 포맷 규칙 최소 설정
- `c:/Users/wlszl/hyeonjin-kim-dev/drafty/.env.example` — 루트 공통 환경변수 템플릿
- `c:/Users/wlszl/hyeonjin-kim-dev/drafty/README.md` — 실행 방법, 구조, 범위 문서
- `c:/Users/wlszl/hyeonjin-kim-dev/drafty/apps/web/package.json` — Next 앱 스크립트/의존성
- `c:/Users/wlszl/hyeonjin-kim-dev/drafty/apps/web/next.config.ts` — Next 최소 설정
- `c:/Users/wlszl/hyeonjin-kim-dev/drafty/apps/web/tsconfig.json` — 루트 TS 설정 상속
- `c:/Users/wlszl/hyeonjin-kim-dev/drafty/apps/web/postcss.config.js` — Tailwind/PostCSS 연결
- `c:/Users/wlszl/hyeonjin-kim-dev/drafty/apps/web/tailwind.config.ts` — Tailwind content/theme 최소 설정
- `c:/Users/wlszl/hyeonjin-kim-dev/drafty/apps/web/app/layout.tsx` — App Router 루트 레이아웃
- `c:/Users/wlszl/hyeonjin-kim-dev/drafty/apps/web/app/page.tsx` — "Drafty" 초기 상태 페이지
- `c:/Users/wlszl/hyeonjin-kim-dev/drafty/apps/web/app/globals.css` — Tailwind base/components/utilities 로드
- `c:/Users/wlszl/hyeonjin-kim-dev/drafty/apps/web/.env.example` — 웹 앱 전용 env 템플릿
- `c:/Users/wlszl/hyeonjin-kim-dev/drafty/packages/shared-types/package.json` — shared types 패키지 메타/스크립트
- `c:/Users/wlszl/hyeonjin-kim-dev/drafty/packages/shared-types/tsconfig.json` — 패키지 TS 컴파일 기준
- `c:/Users/wlszl/hyeonjin-kim-dev/drafty/packages/shared-types/src/index.ts` — 최소 공통 타입 export

**Verification**

1. `pnpm install` 실행 후 workspace 인식 확인 (`apps/web`, `packages/shared-types` 링크 여부)
2. `pnpm dev` 실행 후 웹 서버 부팅 확인 및 `http://localhost:3000`에서 `Drafty` 제목/안내 문구 렌더링 확인
3. `pnpm lint` 통과 확인 (root + web + shared-types)
4. `pnpm typecheck` 통과 확인 (workspace 타입 경로 문제 없음)
5. `pnpm build` 통과 확인 (Next production build 성공)
6. 수동 점검: `.env.example` 파일들이 실제 비밀값 없이도 실행에 영향 없는지 확인

**Decisions**

- 이번 브랜치에서는 `packages/config-*`를 만들지 않는다.
- 이유: 앱 1개 + shared package 1개 단계에서 설정 패키지 분리는 과도한 추상화이며 유지보수 포인트만 증가시킨다.
- 공통 설정은 루트(`eslint`, `prettier`, `tsconfig`)로 두고, 2번째 앱(예: `apps/api`, `apps/worker`)이 생길 때 config package 분리를 재평가한다.
- 포함 범위: 모노레포 골격, 실행 가능한 웹앱, 최소 공통 타입 패키지, 기본 개발 도구.
- 제외 범위: Supabase/Auth/DB schema/React Flow/Tiptap/CLI app/AI worker 등 실제 제품 기능 구현.

**Further Considerations**

1. Next 초기화 방식: 직접 수동 파일 구성 권장. 이유: 불필요 샘플 코드와 설정을 줄여 PR 노이즈를 최소화.
2. 루트 스크립트 정책: `dev`는 웹 단일 타깃, 검증 스크립트만 전체 workspace 대상으로 유지 권장.
3. shared-types 빌드 전략: 지금은 타입체크 중심(`tsc --noEmit`)으로 충분, 실제 배포 패키징은 후속 브랜치에서 추가 권장.
