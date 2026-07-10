# FocusOS Resume Context

## Project Root

- Root: `D:\dev\projects\focusOs`
- Instruction source: `AGENT.md`
- Frontend visual reference: `stitch_focusos_productivity_system/`
- Design-system reference: `stitch_focusos_productivity_system/focus_ai_design_system/DESIGN.md`

## Stack Constraints From AGENT.md

- Frontend: React, JavaScript, Tailwind CSS, Zustand
- Backend: Node.js, Express, MongoDB/Mongoose, JWT auth
- Delivery style: feature-by-feature, end-to-end, always with tests

## Current Implementation Status

### Backend

Backend auth scaffold exists in `server/`.

Implemented:
- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me` with bearer-token protection
- Mongoose `User` model
- JWT token issuing and auth middleware
- Password hashing with `bcryptjs`
- Validation utilities and centralized error handling
- Express app middleware includes `helmet()`, `express.json()`, and `morgan("dev")`
- Service-layer and route-level tests

Key files:
- `server/src/app.js`
- `server/src/server.js`
- `server/src/routes/authRoutes.js`
- `server/src/controllers/authController.js`
- `server/src/services/authService.js`
- `server/src/models/User.js`
- `server/src/middleware/authMiddleware.js`
- `server/src/middleware/errorHandler.js`
- `server/tests/auth.routes.test.js`
- `server/tests/auth.service.test.js`

Environment template:
- `server/.env.example`

### Frontend

Frontend auth scaffold exists in `client/`.

Implemented:
- Vite + React + Tailwind + Zustand + React Router setup
- Routes:
  - `/` redirects to `/login`
  - `/login`
  - `/register`
  - `/app` protected shared app shell with module placeholder routes
- Branded auth layout derived from Stitch/design-system direction
- Shared auth card used for register/login flows
- Centralized Zustand auth store in `client/src/store/useAuthStore.js` with feature re-export in `client/src/features/auth/store/useAuthStore.js`
- Auth API now supports `VITE_API_BASE_URL`, `GET /api/auth/me`, and `POST /api/auth/logout`
- Session bootstrap for persisted tokens through `/api/auth/me`
- Shared app layout, sidebar navigation, protected/public route guards, and overview shell scaffold
- Frontend tests for auth card, auth store, and route guards

Key files:
- `client/src/app/router.jsx`
- `client/src/app/routeGuards.jsx`
- `client/src/layouts/AppLayout.jsx`
- `client/src/layouts/AuthLayout.jsx`
- `client/src/components/AppNavigation.jsx`
- `client/src/features/auth/components/AuthCard.jsx`
- `client/src/features/auth/pages/LoginPage.jsx`
- `client/src/features/auth/pages/RegisterPage.jsx`
- `client/src/store/useAuthStore.js`
- `client/src/features/auth/store/useAuthStore.js`
- `client/src/features/auth/api/authApi.js`
- `client/src/pages/AppOverviewPage.jsx`
- `client/src/pages/AppSectionPlaceholderPage.jsx`
- `client/src/styles/index.css`
- `client/src/tests/auth/AuthCard.test.jsx`
- `client/src/tests/auth/useAuthStore.test.js`
- `client/src/tests/app/RouteGuards.test.jsx`

Environment template:
- `client/.env.example`

## Verification Already Completed

Backend:
- `cd server`
- `npm.cmd install`
- `npm.cmd test`
- Result: `12/12` tests passed

Frontend:`r`n- `cd client` `r`n- `npm.cmd install` `r`n- `npm.cmd test` `r`n- Result: `10/10` tests passed `r`n- `npm.cmd run build` `r`n- Result: build succeeded

## Pending Follow-Up

Backend middleware packages were added to `server/package.json`:
- `helmet`
- `morgan`

After this change, run:
- `cd server`
- `npm.cmd install`

Tests were not rerun after adding the middleware wiring.

## Known Gap

The app shell is currently a protected scaffold. Resources, tasks, streaks, projects, and applications still need their actual feature implementations and UI states inside the new shared layout.

## Recommended Restart Point

Resume from frontend-backend integration and first authenticated module work, not from scaffolding.

Immediate next task:
1. Run `cd client && npm.cmd test` and `npm.cmd run build` after the new shell/auth-store changes.
2. Run `cd server && npm.cmd install` to install `helmet` and `morgan`.
3. Verify register/login/session-restore flow against the running backend.
4. Start the first real feature module inside the shared shell, preferably Resources or Tasks.

## Practical Notes

- PowerShell execution policy may block `npm`; use `npm.cmd`
- The Windows sandbox helper intermittently failed with `codex-windows-sandbox-setup.exe` missing, so escalation may be required for some shell commands
- The repo may not be initialized as a clean git working tree; avoid assuming git-based workflows without checking first

## Useful Commands

```powershell
cd D:\dev\projects\focusOs\server
npm.cmd install
npm.cmd test

cd D:\dev\projects\focusOs\client
npm.cmd test
npm.cmd run build
```

## Low-Token Resume Prompt Template

Use this when resuming work with minimal context overhead:

```text
Read `AGENT.md` and `RESUME_CONTEXT.md`. Continue from the next recommended step.

Constraints:
- Be concise.
- Minimize token usage.
- Do not restate context already captured in `RESUME_CONTEXT.md`.
- Update `RESUME_CONTEXT.md` after each meaningful change.
- Run relevant tests after code changes and record the result in `RESUME_CONTEXT.md`.

Current goal:
- [replace with the immediate task]

Deliverables:
1. Implement the change.
2. Verify it.
3. Update `RESUME_CONTEXT.md` with what changed, test status, and the next restart point.
```

## Low-Token Prompting Notes

To keep token usage efficient:
- Batch related tasks into one request instead of sending many short follow-ups.
- Reference exact files when you know them.
- Put the current goal and constraints in the first message.
- Ask for `RESUME_CONTEXT.md` updates as part of the standing workflow.
- Resume from the restart point instead of re-explaining completed work.

run codex resume 019f47ed-0e48-7670-bd43-9a2553a1a351

