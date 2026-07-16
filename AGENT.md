# Focus AI Agent Guide

## Mission

Build Focus AI as a production-minded full-stack productivity app with secure auth, useful feature modules, clean UI, and automated tests.

## Stack

- Frontend: React, JavaScript, Tailwind CSS, Zustand, React Router
- Backend: Node.js, Express, MongoDB/Mongoose, JWT auth
- Tests: Vitest/Jest-style frontend tests, backend route/service tests with Supertest where useful

## Core Rules

1. Work feature-by-feature in small, commit-sized slices.
2. Reuse existing patterns before adding abstractions.
3. Keep changes scoped to the current task and avoid unrelated cleanup.
4. Add or update tests for bug fixes and non-trivial behavior.
5. Validate server inputs and protect user-specific routes with JWT middleware.
6. Keep UI components focused; keep business logic out of components when practical.
7. keep the components modular and reusable split out only the piece that meaningfully reduces page weight.
8. Include loading, error, empty, and responsive states for user-facing features.
9. Use `npm.cmd` on Windows.
10. Update `RESUME_CONTEXT.md` after meaningful changes.
11. For frontend pages, keep page files focused on orchestration only: data loading, page-level state, action handlers, and section composition.
12. Extract JSX into focused components when the block is reusable, visually distinct, or owns isolated UI state; keep logic local when extraction would only create pass-through wrappers.

## Startup Workflow

1. Read `AGENT.md` and `RESUME_CONTEXT.md` first.
2. Read `prompts/bootstrap.md` if it exists.
3. Read `prompts/contextGaurd.md` if it exists and has meaningful content.
4. Read only task-relevant prompt files from `prompts/`; do not scan the whole folder by default.
5. Inspect only files needed for the current task.
6. Implement, verify with targeted tests first, then broader relevant tests/build when useful.
7. Record current state and next restart point in `RESUME_CONTEXT.md`.

## Frontend Slice Rules

1. Start from shared tokens and primitives before introducing page-level color or control styles.
2. Keep page containers thin and move repeatable section UI into feature-local components.
3. Extract section cards, summaries, and action-specific controls into focused feature components.
4. Prefer shared form and shell primitives before inventing new wrappers or one-off styles.
5. Update `RESUME_CONTEXT.md` with the new recommended restart state after each meaningful frontend slice.

## Current Product Modules

- Authentication: register, login, logout, `/me`, token persistence, protected routes
- Resources: saved learning resources by skill/topic with CRUD, filters, tags
- Tasks: general and learning tasks with due dates, priority, completion, grouping
- Streaks: current/best streak based on a documented daily completion rule
- Project ideas: idea tracking, progress notes, next steps
- Job applications: pipeline tracking, status, follow-up dates, filters
- Dashboard: cross-module summaries and upcoming work

## Recommended Small-Feature Path

When planning work, prefer these small slices instead of broad module prompts.

### Authentication

1. Backend register/login/logout/me routes with tests
2. Frontend login/register forms
3. Auth store and token persistence
4. Protected/public route guards
5. Browser auth smoke test and regression fixes

### Resources

1. Resource model, validation, and auth-protected CRUD backend with tests
2. Resources page shell with loading, error, and empty states
3. Resource list wired to backend
4. Create resource form wired to backend
5. create resource form should be a modal window not a separate page. when it opens a semi transparent overlay should cover the rest of the page.
6. Edit and delete resource actions
7. Search and filter by status, type, topic, and tags

### Tasks

1. Task model, validation, and auth-protected CRUD backend with tests
2. Tasks page shell with loading, error, and empty states
3. Task list grouped by Today, Upcoming, and Completed
4. Create task form wired to backend
5. Edit, delete, and complete or incomplete actions
6. Priority, due date, and linked resource or topic handling

### Streaks

1. Define streak business rule in code comments and unit tests
2. Daily completion calculation service
3. Streak persistence or summary backend endpoints with tests
4. Streak summary UI with current streak and best streak
5. Recalculation edge-case fixes and regression coverage

### Project Ideas

1. Project idea model, validation, and auth-protected CRUD backend with tests
2. Project ideas page shell with loading, error, and empty states
3. Ideas list wired to backend
4. Create and edit project idea flow
5. Detail view for progress notes, improvements, and next steps
6. Delete flow and history or notes polish

### Job Applications

1. Job application model, validation, and auth-protected CRUD backend with tests
2. Applications page shell with loading, error, and empty states
3. Applications list wired to backend
4. Create and edit application flow
5. Status updates, follow-up date sorting, and filters
6. Delete flow and table or list polish

### Dashboard

1. Define dashboard data contract across modules
2. Backend aggregation endpoints with tests
3. Dashboard overview cards and summary layout
4. Recent activity and upcoming items sections
5. Empty-state and partial-data handling

### Final Polish

1. Responsive cleanup across auth and app shell
2. Accessibility pass on forms, navigation, and states
3. Cross-module loading, error, and empty-state consistency
4. Test hardening for regressions and shared workflows

## Small Slice Examples

- `Fix register auth state persistence with regression test`
- `Add Resources backend CRUD with route tests only`
- `Build Resources list page with loading/error/empty states`
- `Add Tasks backend CRUD with tests only`
- `Add mobile navigation drawer to app shell`
- `Define streak rule and implement calculation service tests`

## Definition of Done

A slice is done when:

1. The requested behavior is implemented end-to-end for its intended scope.
2. Relevant tests pass.
3. Build passes when frontend production behavior is affected.
4. No unrelated modules are changed.
5. `RESUME_CONTEXT.md` has current status, verification, dirty-file notes, and the next restart point.

## Project Structure

```text
client/
  src/app
  src/components
  src/features
  src/layouts
  src/pages
  src/store
  src/styles
  src/tests
server/
  src/config
  src/controllers
  src/db
  src/middleware
  src/models
  src/routes
  src/services
  src/utils
  tests
```
