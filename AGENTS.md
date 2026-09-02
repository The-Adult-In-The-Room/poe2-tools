# Agent Guide

This file contains advice for AI agents working in the `poe2-tools` repository.

## Project Overview

- **Stack**: React 19, TypeScript 7, TanStack Router + TanStack Start, Tailwind CSS v4, Vite, Vitest, Biome.
- **Runtime**: Node.js >= 24.

## Before You Start

- Run `npm install` if `node_modules` is missing.
- Use the `#/` path alias for imports from `src/`.

## Verification

Always run the full verification pipeline before considering work complete:

```bash
npm run verify
```

This runs `tsc`, `biome ci`, and `vitest run`.

For coverage specifically:

```bash
npm test -- --run
```

The project enforces **100% coverage** thresholds for statements, branches, functions, and lines. The API layer (`src/api/**`) is included in coverage; do not add it to the exclude list.

## Formatting and Linting

- The project uses **Biome**, not ESLint/Prettier.
- Auto-fix formatting and import ordering with:

  ```bash
  npm run fix
  ```

  or

  ```bash
  npx biome check --write <paths...>
  ```

- Do not manually re-order imports; let Biome handle it.

## Type Checking

- Run `npx tsc --noEmit` to check types.
- Prefer `import type` when importing only types.

## Testing

- Tests live next to the files they test (e.g., `foo.ts` → `foo.test.ts`).
- Use **Vitest** with `happy-dom` and **React Testing Library** (`@testing-library/react`, `@testing-library/user-event`).
- Mock `fetch` with `vi.fn()` and `vi.stubGlobal('fetch', mockFetch)` for API tests. Reset the mock in `beforeEach` with `mockFetch.mockClear()`.
- Prefer `userEvent` over `fireEvent` for interaction tests.
- When testing caching, reset the cache between tests using the provided `clearCache()` helper.

## Code Organization

- **Constants**: Runtime constants belong in `src/constants/` (not `src/types/`).
- **Types**: Type definitions belong in `src/types/`.
- **API layer**: Group related server functions, handlers, schemas, and tests in a feature directory under `src/api/` (e.g., `src/api/currency/`).
- **Validation**: Use Zod for runtime validation. Keep Zod schemas in a dedicated schemas file (e.g., `currencySchemas.ts`) separate from the server-function logic.
- **Components**: Use PascalCase for component files and directories.

## Git

- Do not run `git commit`, `git push`, `git rebase`, or other git mutations unless explicitly asked.
- Do not create empty commits or amend failed commits.

## Common Pitfalls

- Avoid adding runtime values (consts/enums) to `.d.ts` files.
- Keep `index.ts` files as thin barrels when possible; they are excluded from coverage.
- Do not add new dependencies without updating `package.json` and running `npm install`.
- Do not add files or directories to the coverage exclude list to hide untested code.

## Useful Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run verify` | Run typecheck, lint, and tests |
| `npm test -- --run` | Run tests with coverage |
| `npm run fix` | Auto-fix Biome issues |
| `npx tsc --noEmit` | Type-check only |
