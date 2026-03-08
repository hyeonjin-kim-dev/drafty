# 프로젝트 가이드라인

## 코드 스타일

- TypeScript 공통 설정은 `tsconfig.base.json`의 strict 기준을 따른다.
- ESLint는 `eslint.config.mjs`의 flat config를 따른다.
- Prettier는 `prettier.config.mjs`를 따른다: `singleQuote: true`, `semi: true`, `trailingComma: all`, `printWidth: 100`, `tabWidth: 2`.
- 공용 코드는 ESM 호환을 유지한다.

## 아키텍처

- 이 저장소는 부트스트랩 모노레포다. 사용자가 명시적으로 제품 기능 구현을 요청하지 않는 한, 기본 골격 작업 범위를 유지한다.
- 워크스페이스 경계:
  - `apps/web`: Next.js App Router 프론트엔드
  - `packages/shared-types`: 프레임워크 비종속 공통 TypeScript 타입
- 웹 앱에서 shared types를 사용할 때는 `apps/web/next.config.ts`의 `transpilePackages`에 `@drafty/shared-types`가 포함되도록 유지한다.

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
- 플랜 문서(`plan-*.prompt.md`)는 저장소 루트의 `plans/` 디렉터리에 생성하고 관리한다.
- 임시 `untitled:` 플랜 문서로 시작했더라도 확정본은 `plans/`로 이동해 반영한다.
