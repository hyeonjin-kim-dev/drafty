---
description: 'Use when creating new directories under apps/web that contain TSX/JSX components. Ensures Tailwind CSS content paths stay in sync.'
applyTo: 'apps/web/tailwind.config.ts'
---
# Tailwind content 경로 유지

`apps/web/tailwind.config.ts`의 `content` 배열에는 Tailwind 클래스를 스캔할 경로가 나열되어 있다.

## 현재 등록된 경로

```ts
content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}']
```

## 규칙

- `apps/web/` 하위에 TSX/JSX를 포함하는 **새 디렉터리**를 생성할 때, 해당 경로를 `content` 배열에 추가한다.
- 예시: `hooks/`, `lib/`, `features/` 등에 TSX 파일이 들어가면 `'./{디렉터리}/**/*.{js,ts,jsx,tsx,mdx}'`를 추가한다.
- 순수 타입 파일이나 유틸리티만 있는 디렉터리는 추가하지 않아도 된다.
- 경로 추가 후 `pnpm build`로 Tailwind 클래스 누락이 없는지 확인한다.
