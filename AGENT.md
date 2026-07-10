# Focus AI Agent Guide

## Objective

Build `Focus AI` as a production-minded full-stack web application with a clean, maintainable architecture, strong automated test coverage, and an efficient low-context development workflow for Codex CLI sessions.

The product includes:

1. Resource management by skill/topic
2. Task management for normal tasks and learning tasks
3. Streak tracking based on consecutive days where all daily tasks are completed
4. Project ideas and progress tracking
5. Job application tracking
6. Secure user authentication

## Required Stack

### Frontend

- React.js
- JavaScript
- Tailwind CSS
- Zustand for client state management

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JWT-based authentication

## Core Development Rules

1. Always build feature-by-feature, end-to-end.
2. Always write tests for every feature developed.
3. Never leave a feature half-implemented across frontend, backend, and tests if it can be completed in the same work cycle.
4. Prefer simple, readable architecture over premature abstraction.
5. Keep components small and focused.
6. Keep business logic out of UI components whenever possible.
7. Validate all API inputs on the server.
8. Protect all authenticated routes with JWT middleware.
9. Use consistent naming across frontend state, API routes, controllers, models, and tests.
10. When adding a feature, also add loading, error, and empty states.
11. Keep token and context usage lean by default.
12. Update `RESUME_CONTEXT.md` after each meaningful change so future sessions do not need repeated project recap.

## Product Modules

### 1. Authentication

Support:

- User registration
- User login
- User logout
- Persistent authenticated session on refresh
- JWT access token flow

Requirements:

- Hash passwords securely
- Never store plain-text passwords
- Return minimal safe auth payloads
- Protect all user-specific data by authenticated user id

### 2. Resources

Each resource should support fields such as:

- title
- topic or skill
- type (`article`, `video`, `documentation`, `course`, etc.)
- url
- notes
- status (`saved`, `in_progress`, `completed`)
- optional tags

Requirements:

- List resources
- Create resource
- Edit resource
- Delete resource
- Filter/search by skill, type, status, tag

### 3. Tasks

Each task should support:

- title
- description
- type (`general`, `learning`)
- priority
- due date
- completion status
- optional linked resource
- optional linked skill/topic

Requirements:

- List tasks
- Create task
- Edit task
- Delete task
- Mark complete/incomplete
- Group by `Today`, `Upcoming`, `Completed`

### 4. Streaks

Business rule:

- A streak increments when all required tasks for a given day are completed.
- Define the exact daily-completion rule in code comments and tests before implementing.

Requirements:

- Current streak
- Best streak
- Daily completion tracking
- Recalculation logic with test coverage

### 5. Project Ideas

Each project idea should support:

- title
- summary
- current status
- progress notes
- possible improvements
- next steps
- timestamps

Requirements:

- List ideas
- Create idea
- Edit idea
- Delete idea
- View idea detail/history notes

### 6. Job Application Tracker

Each application should support:

- company
- role
- application link
- mode of application
- status
- location
- date applied
- follow-up date
- salary info
- notes

Requirements:

- List applications
- Create application
- Edit application
- Delete application
- Filter by status
- Sort by follow-up date or date applied

## Recommended Project Structure

Use a clear split between `client` and `server`.

```text
focus-ai/
  client/
    src/
      api/
      app/
      components/
      features/
      hooks/
      layouts/
      lib/
      pages/
      store/
      styles/
      tests/
  server/
    src/
      config/
      controllers/
      db/
      middleware/
      models/
      routes/
      services/
      utils/
      app.js
      server.js
    tests/
```

## Frontend Guidelines

1. Use React function components only.
2. Use Zustand for app state that must be shared across pages or features.
3. Keep local UI-only state inside components unless multiple screens need it.
4. Centralize API calls in a dedicated `api/` layer.
5. Organize by feature when practical.
6. Use Tailwind utility classes consistently and extract reusable UI primitives when repetition becomes obvious.
7. Build responsive layouts for desktop first, then ensure mobile usability is fully supported.
8. Include these screens at minimum:
   - Auth
   - Dashboard
   - Resources
   - Tasks
   - Streaks or streak section
   - Project Ideas
   - Job Applications

## Backend Guidelines

1. Use Express routers by domain feature.
2. Keep controllers thin.
3. Put reusable business logic in services or utilities.
4. Use Mongoose schemas with validation.
5. Add centralized error handling middleware.
6. Add auth middleware for protected routes.
7. Keep environment variable usage centralized and documented.
8. Return predictable JSON response shapes.

## Testing Requirements

Testing is mandatory for every feature.

### Frontend tests

Write tests for:

- Rendering critical screens/components
- Form behavior
- User interactions
- Loading/error/empty states
- Zustand store behavior when relevant

Preferred tools:

- Vitest or Jest
- React Testing Library

### Backend tests

Write tests for:

- Auth flows
- Route handlers
- Validation behavior
- Business logic
- Streak calculations
- Permission boundaries between users

Preferred tools:

- Jest or Vitest
- Supertest for API tests

### Test policy

1. Every new API route must have route-level tests.
2. Every new business rule must have unit tests.
3. Every non-trivial UI flow must have component/integration tests.
4. Fixing a bug should include a regression test whenever practical.
5. Do not mark a feature complete until code and tests both pass.

## Implementation Order

Build in this order unless a later dependency forces adjustment:

1. Project scaffolding
2. Auth backend and auth frontend
3. Shared layout, navigation, and app shell
4. Resources module
5. Tasks module
6. Streak logic
7. Project ideas module
8. Job applications module
9. Dashboard aggregation layer
10. Final polish, accessibility, and test hardening

## Definition of Done

A feature is only done when all of the following are true:

1. Backend model, route, controller, and validation exist where needed
2. Frontend UI for the feature exists
3. Frontend is connected to real backend APIs
4. Error/loading/empty states are implemented
5. Automated tests are added
6. Relevant tests pass
7. Basic responsive behavior is handled
8. Code is readable and consistent with the rest of the project
9. `RESUME_CONTEXT.md` is updated with what changed, verification status, and the next recommended restart point

## Codex CLI Token-Optimized Workflow

Use this workflow to keep context small and development efficient.

### General strategy

1. Work on one module at a time.
2. Keep each session focused on a narrow outcome.
3. Read only files directly related to the current task.
4. Avoid reloading large files unless they changed or are directly relevant.
5. Summarize progress in the repo itself through concise documentation when helpful.
6. Prefer `RESUME_CONTEXT.md` as the single source of durable session state.

### Recommended task slicing

Use small prompts such as:

- "Scaffold backend auth with tests"
- "Build login/register UI and connect to auth API"
- "Add resource CRUD backend with tests"
- "Add resource list and create form frontend with tests"
- "Implement streak calculation service with tests"

Avoid broad prompts like:

- "Build the whole app"

### Context management rules

1. Before coding, identify only the files needed for the current feature.
2. Prefer targeted reads over scanning entire directories repeatedly.
3. Reuse prior architectural patterns instead of asking for fresh rewrites.
4. Store durable conventions in this `AGENT.md` so they do not need to be re-explained every session.
5. If a feature is large, split it into backend, frontend, and tests across separate steps.
6. Do not restate context that already exists in `RESUME_CONTEXT.md` unless it has changed.
7. When resuming work, read `AGENT.md` and `RESUME_CONTEXT.md` first, then continue from the next recommended step.

### Session prompt template

Use prompts in this shape:

```text
Read `AGENT.md` and `RESUME_CONTEXT.md`. Continue from the next recommended step.

Current goal:
- <small feature>

Constraints:
- Be concise.
- Minimize token usage.
- Only inspect files relevant to this task.
- Do not restate context already captured in `RESUME_CONTEXT.md`.
- Add or update tests.
- Update `RESUME_CONTEXT.md` after each meaningful change.

Deliver:
1. Implementation
2. Verification
3. Updated `RESUME_CONTEXT.md`
```

### Efficient review loop

For each feature:

1. Inspect current related files
2. Implement backend
3. Implement frontend
4. Add tests
5. Run targeted tests first
6. Run broader related test suite second
7. Record results in `RESUME_CONTEXT.md`

### Token-saving coding preferences

1. Prefer extending existing patterns over inventing new structures.
2. Keep helper functions small and colocated unless reuse is proven.
3. Avoid generating large placeholder content.
4. Ask for exact next task when switching modules.
5. Use concise commit-sized units of work.
6. Batch related tasks into one prompt when possible.
7. Reference exact files when they are known.

## Quality Bar

The app should feel:

- clean
- simple
- responsive
- maintainable
- testable
- production-oriented

When tradeoffs appear, prefer long-term readability and correctness over cleverness.
