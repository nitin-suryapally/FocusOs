# FocusOS Resume Context

## Current Snapshot

- Root: `D:\dev\projects\focusOs`
- Stack: React + JavaScript + Tailwind + Zustand; Node + Express + MongoDB/Mongoose + JWT
- Workflow source: `AGENT.md`
- Optional startup prompt: `prompts/bootstrap.md`
- `prompts/contextGaurd.md` currently has no meaningful content

## Implemented

Backend auth:
- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- JWT middleware, Mongoose `User`, bcrypt password hashing, validation helpers, error handlers

Frontend auth and shell:
- Login/register pages and shared auth card
- Zustand auth store with persisted token/session bootstrap
- Protected/public route guards
- Shared `/app` layout with module placeholder routes
- Sidebar navigation plus mobile hamburger drawer

## Current Dirty Worktree Notes

Keep these changes unless the user explicitly asks to revert them:
- `AGENT.md`: compact workflow guide with prompt-reading rule
- `RESUME_CONTEXT.md`: compact current handoff
- `client/src/features/auth/api/authApi.js`: auth API cleanup from register auth-state debugging
- `client/src/tests/auth/authApi.test.js`: regression test for registration response handling
- `client/src/components/AppNavigation.jsx`: full-width nav items plus optional `onNavigate`
- `client/src/layouts/AppLayout.jsx`: mobile navigation drawer
- `client/src/tests/app/AppLayout.test.jsx`: mobile drawer open/close coverage
- `server/src/app.js`: middleware/CORS ordering change was already dirty before this cleanup pass

## Latest Verification

Client:
- `cd client; npm.cmd test` passed: `12/12`
- `cd client; npm.cmd run build` passed

Backend:
- Earlier auth tests passed: `12/12`
- Backend tests were not rerun after the current dirty `server/src/app.js` middleware/CORS change

## Known Gaps

- Manually verify `/app` navigation at mobile and desktop widths in the browser.
- Manually verify register/login/session restore against the running backend.
- Resources, Tasks, Streaks, Project Ideas, Job Applications, and Dashboard are still placeholder modules.
- Decide whether the `server/src/app.js` CORS change is intentional, then run backend install/tests.

## Next Restart Point

1. Read `AGENT.md`, this file, and `prompts/bootstrap.md`.
2. Verify the dirty worktree with `git status --short` before editing.
3. Browser-check auth and mobile navigation if continuing shell/auth work.
4. Otherwise start the next feature slice: Resource model, validation, and auth-protected CRUD backend with tests

## Useful Commands

```powershell
cd D:\dev\projects\focusOs\client
npm.cmd test
npm.cmd run build

cd D:\dev\projects\focusOs\server
npm.cmd install
npm.cmd test
```

## last resume session 
019f55d1-8d51-7bc0-b8ce-b3ea7fc3838b