# Dashboard Data Contract

## Scope

This document defines the response for the future authenticated `GET /api/dashboard` endpoint. It is a contract only: this slice adds no route, aggregation service, persistence, or UI.

## Authentication and ownership

- The endpoint will use the existing `requireAuth` middleware.
- Every source query must filter by the authenticated `req.userId`; no item, count, or streak result may cross users.
- An unauthenticated request returns the existing `401` auth response.

## Response

```json
{
  "summary": {
    "tasks": { "openCount": 0, "dueTodayCount": 0, "overdueCount": 0 },
    "resources": { "totalCount": 0, "inProgressCount": 0 },
    "streak": { "currentStreak": 0, "bestStreak": 0 },
    "projectIdeas": { "activeCount": 0 },
    "jobApplications": { "activeCount": 0, "followUpDueCount": 0 }
  },
  "upcoming": [],
  "recentActivity": []
}
```

All counts are numbers. `upcoming` and `recentActivity` are arrays and are empty when no qualifying records exist; a partial lack of data in one module does not suppress the other sections.

### Summary rules

| Section | Source | Rule |
| --- | --- | --- |
| `tasks.openCount` | `Task.completed` | Count tasks where `completed` is `false`. |
| `tasks.dueTodayCount` | `Task.dueDate`, `Task.completed` | Count incomplete tasks whose `dueDate` is on the request-time UTC calendar day. |
| `tasks.overdueCount` | `Task.dueDate`, `Task.completed` | Count incomplete tasks with a non-null `dueDate` before the request-time UTC calendar day. |
| `resources.totalCount` | `Resource` | Count all user resources. |
| `resources.inProgressCount` | `Resource.status` | Count resources whose status is `in_progress`. |
| `streak` | completed `Task.completedAt` | Reuse `getUserStreakSummary(userId, now)` and its documented UTC rule unchanged. |
| `projectIdeas.activeCount` | `ProjectIdea.status` | Count ideas excluding `completed` and `archived`. |
| `jobApplications.activeCount` | `JobApplication.status` | Count applications excluding `rejected` and `withdrawn`. |
| `jobApplications.followUpDueCount` | `JobApplication.followUpDate`, `status` | Count active applications with a non-null `followUpDate` on or before the request-time UTC calendar day. |

The aggregation service will calculate UTC day boundaries once from its injected `now` value. This keeps Dashboard task and follow-up dates deterministic in tests and does not change the existing UTC streak rule.

### Upcoming items

`upcoming` is a merged, ascending list of at most 10 dated items after the request-time UTC calendar day. It includes incomplete tasks with a `dueDate` and active job applications with a `followUpDate`. Same-time items sort by `kind`, then `id`, for deterministic results.

```json
{
  "kind": "task",
  "id": "task-id",
  "title": "Finish portfolio",
  "date": "2026-07-20T00:00:00.000Z",
  "priority": "high"
}
```

```json
{
  "kind": "jobApplicationFollowUp",
  "id": "application-id",
  "title": "Acme - Frontend Engineer",
  "date": "2026-07-20T00:00:00.000Z",
  "status": "interviewing"
}
```

Overdue and same-day dates are deliberately excluded from `upcoming`; their urgency is represented by summary counts. Undated records are excluded.

### Recent activity

`recentActivity` is a merged, descending list of at most 10 current-record updates. It is not an audit log. It includes user-owned Tasks, Resources, Project Ideas, and Job Applications, ordered by each record's `updatedAt`; ties sort by `kind`, then `id`.

```json
{
  "kind": "projectIdea",
  "id": "idea-id",
  "title": "FocusOS mobile companion",
  "updatedAt": "2026-07-19T09:30:00.000Z"
}
```

- `kind` is one of `task`, `resource`, `projectIdea`, or `jobApplication`.
- `title` maps to `Task.title`, `Resource.title`, `ProjectIdea.title`, or `JobApplication.company + " - " + role`.
- Progress-note additions appear through their parent idea's updated record; individual note history is outside this contract.
- Streaks are derived from task completion history and have no independent activity record.

## Existing source support

| Module | Existing safe fields used |
| --- | --- |
| Tasks | `id`, `title`, `priority`, `dueDate`, `completed`, `completedAt`, `updatedAt` |
| Resources | `id`, `title`, `status`, `updatedAt` |
| Streaks | `currentStreak`, `bestStreak` from completed task timestamps |
| Project Ideas | `id`, `title`, `status`, `updatedAt` |
| Job Applications | `id`, `company`, `role`, `status`, `followUpDate`, `updatedAt` |

## Deferred decisions

- The endpoint route, controller, and aggregation service belong to the next Dashboard slice.
- Dashboard UI, its loading/error/empty states, and presentation-specific labels remain separate client slices.
- The current model set cannot provide historical create/update events or individual progress-note activity; adding an audit trail is explicitly out of scope.