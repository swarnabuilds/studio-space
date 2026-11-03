<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# StudioSpace Client

Next.js 16 App Router frontend for a studio-rental marketplace. Auth is handled here; studio listing data comes from a separate backend at `NEXT_PUBLIC_SERVER_URI` (default `http://localhost:5000`).

## Commands

- `npm run dev` — Turbopack dev server on port 3000.
- `npm run lint` — ESLint 9 flat config. The script invokes `eslint` with no path, so it scans the repo; pass paths to lint only what you changed.
- `npx tsc --noEmit` — typecheck. There is no `typecheck` script.
- `next-env.d.ts` and `.next/types` are generated and gitignored; run `npm run dev` or `npm run build` once before `tsc` in a fresh clone. Don't edit either.
- `npm run build` — production build and the only full route/prerender validation.
- No test runner or test script exists.
- Use npm; the repo only has `package-lock.json`.

## App structure

- Routes are under `src/app`; route groups do not affect URLs:
  - `(root)` wraps `/` and `/explore-studio` with `Navbar`/`Footer`.
  - `(auth)` holds `/login` and `/register`.
  - `(dashboard)` wraps `/dashboard/*` with the client sidebar layout.
- `src/app/layout.tsx` is the root layout. Better Auth is mounted at `src/app/api/auth/[...all]/route.ts`.
- `@/*` maps to `src/*`; `cn` is re-exported from the `cn` package in `src/lib/utils.ts`.

## Auth and data

- `src/lib/auth.ts` configures Better Auth with the MongoDB adapter and Google OAuth; `src/lib/auth-client.ts` exports `signIn`, `signUp`, `signOut`, `useSession`.
- Required env (`.env` is gitignored): `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `MONGODB_URI`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_SERVER_URI`.
- `BETTER_AUTH_URL` must match the running origin (`http://localhost:3000`).
- There is no middleware/proxy or server-side auth guard. The dashboard layout only reads `useSession`; don't assume `/dashboard/*` is protected server-side.
- Studio flows call the separate backend directly: `fetch(`${NEXT_PUBLIC_SERVER_URI}/studio`)` (GET list, POST create). Start that backend before testing those pages.
- Toasts use the custom Base UI singleton: `toast.add({ title, description })` from `@/components/ui/toast`. Do not add `sonner`.

## UI conventions

- `src/components/ui/*` are shadcn `base-nova` primitives built on `@base-ui/react`, not Radix. Add more with `npx shadcn add <component>`; don't copy Radix-based shadcn examples.
- Tailwind 4 is CSS-first: no `tailwind.config.*`. `src/app/globals.css` only imports `tailwindcss`, `tw-animate-css`, and `shadcn/tailwind.css`; CSS is processed by `@tailwindcss/turbopack` in `next.config.ts`.
- Pages use inline Tailwind with a dark slate/purple palette; `src/components/ui/*` use shadcn tokens.

## Next 16 traps

- `cacheComponents`, `partialPrefetching`, and `reactCompiler` are enabled. Server components that read uncached data (`await fetch`) need `<Suspense>` or `"use cache"`; components that access request-time APIs (`cookies()`, `headers()`, dynamic `params`/`searchParams`) need a `<Suspense>` boundary. Otherwise prerendering/build fails.
- Cache Components is Node-only: don't add `export const runtime` (`edge` or `nodejs`) and don't use `experimental.ppr`.
- `params` and `searchParams` are Promises. Generated global helpers `PageProps<'/path'>` and `LayoutProps<'/path'>` are preferred; `LayoutProps<"/">` is already used in the root layout.
- `next dev` owns the `nextjs-agent-rules` block at the top of this file. Keep edits outside its markers.

## Routing gotchas

- The public listing page is `/explore-studio`; creation is `/dashboard/add-studio`. Many components and the login redirect still point to nonexistent `/studios`, `/studios/new`, and `/studios/:id`; use the implemented routes when adding navigation.
- `/dashboard` has a layout but no page; only its subroutes exist.
