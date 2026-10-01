# Project rules — Learn Loop (backend)

Express + Prisma + Socket.io API, running as TypeScript directly via Node's native type-stripping — no `tsc` build step, no nodemon.

## Package manager

npm — `package-lock.json` is the committed lockfile.

## Running it

- `npm run dev` → `node --watch src/server.ts`. `npm run start` is the same without `--watch` (used in production).
- The package is `"type": "module"` (ESM). Every relative import needs an explicit `.ts` extension, and every type-only import needs an explicit `import type` / `type X` marker — Node's type-stripper can't infer these without full type information the way `tsc` can. If you add a new file and get a cryptic runtime import error, check both of these first.
- `tsconfig.json` is for type-checking only (`npm run typecheck` → `tsc --noEmit`) — it never emits.

## Database (Prisma 7)

- Uses the driver-adapter pattern (`@prisma/adapter-pg`) with `prisma.config.ts` at the repo root, not an inline `datasource.url`. `DATABASE_URL` is read via `env()` in that config file.
- `src/config/db.ts` throws synchronously if `DATABASE_URL` is unset — don't add a fallback there, the fail-fast is intentional.

## Linting — Biome

- `npm run lint` / `npm run lint:fix` → `biome check src` / `biome check --write src`.
- Style was set from the user's explicit preferences, not defaults: single quotes, semicolons `asNeeded`, trailing commas `all`, 4-space indent, 120 col width. Don't "fix" these toward Prettier defaults.
- `noExplicitAny` is `warn`, not `error` — this codebase doesn't ban `any` outright, just discourages it.

## Testing — Vitest

- `npm run test` → `vitest run`. Tests live beside the code (`foo.service.ts` → `foo.service.test.ts` or similar) under `src/**/*.test.ts`.
- Mock Prisma with `vi.hoisted` + `vi.mock('../../config/db.ts', ...)` (see `src/modules/auth/auth.route.test.ts` for the pattern) — never hit a real database in a unit test.
- Route tests use `supertest` against the exported `httpServer` from `src/app.ts`.
- Writing a test for existing code is allowed to surface and fix real bugs in that code in the same change (this happened twice during initial test setup: a missing `return` in `topic.service.ts` and a wrong status code in `topic.controller.ts`) — that's expected, not scope creep.

## Deployment (Render)

- `render.yaml` only takes effect once the Blueprint is manually linked via the Render dashboard — pushing the file alone does nothing for an already-existing service.
- Render injects its own `PORT` env var; `server.ts` must read `process.env.PORT` (with a local-dev fallback), never hardcode a port.
- `.node-version` at the repo root pins the Node version independently of the dashboard's `NODE_VERSION` env var — keep both in sync, but `.node-version` is the one that works even if the Blueprint was never linked.
- Free plan spins down after 15 minutes of inactivity — a slow first response after idle is expected, not a bug.

## CI

`.github/workflows/ci.yml` order: install → lint → generate Prisma client → typecheck → test → boot smoke test (starts the server, curls it, kills it). Keep Prisma generation before typecheck/test — both depend on the generated client's types.
