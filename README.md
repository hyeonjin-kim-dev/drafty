# Drafty

Drafty monorepo bootstrap for the `chore/init-monorepo` branch.

This branch intentionally focuses on a runnable foundation only:

- pnpm workspace monorepo
- Next.js (App Router) web app
- TypeScript + Tailwind CSS
- ESLint + Prettier
- Shared type package for future expansion

## Scope In This Branch

Included:

- monorepo workspace structure
- `apps/web` runnable starter app
- `packages/shared-types` starter package
- common tooling/configuration
- `lint`, `typecheck`, `build`, `dev` scripts

Excluded:

- Supabase integration
- Auth/DB schema
- Canvas features
- React Flow / Tiptap
- CLI app
- AI worker/features

## Repository Structure

```text
.
|-- apps/
|   `-- web/
|       |-- app/
|       |   |-- globals.css
|       |   |-- layout.tsx
|       |   `-- page.tsx
|       |-- .env.example
|       |-- next-env.d.ts
|       |-- next.config.ts
|       |-- package.json
|       |-- postcss.config.js
|       |-- tailwind.config.ts
|       `-- tsconfig.json
|-- packages/
|   `-- shared-types/
|       |-- src/
|       |   `-- index.ts
|       |-- package.json
|       `-- tsconfig.json
|-- .env.example
|-- .gitignore
|-- .npmrc
|-- .prettierignore
|-- eslint.config.mjs
|-- package.json
|-- pnpm-workspace.yaml
|-- prettier.config.mjs
`-- tsconfig.base.json
```

## Requirements

- Node.js 20+
- pnpm 9+

## Quick Start

```bash
pnpm install
pnpm dev
```

Then open `http://localhost:3000`.

## Scripts

From repository root:

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
pnpm format
```

## Environment Files

- Root template: `.env.example`
- Web template: `apps/web/.env.example`

Copy into local env files only when needed in later branches.
