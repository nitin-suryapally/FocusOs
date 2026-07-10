


# Low-Token Prompt Template

Use this file as the default prompt pattern for future Codex sessions on this project.

## Resume Template

```text
Read `AGENT.md` and `RESUME_CONTEXT.md`. Continue from the next recommended step.

Current goal:
- [replace with the immediate task]

Constraints:
- Be concise.
- Minimize token usage.
- Only inspect files relevant to this task.
- Do not restate context already captured in `RESUME_CONTEXT.md`.
- Add or update tests when code changes.
- Update `RESUME_CONTEXT.md` after each meaningful change.

Deliver:
1. Implement the change.
2. Verify it.
3. Update `RESUME_CONTEXT.md` with what changed, test status, and the next restart point.
```

## Example Prompts

- `Read AGENT.md and RESUME_CONTEXT.md. Continue from the next recommended step. Current goal: wire client auth API to VITE_API_BASE_URL and verify login/register flow. Be concise and update RESUME_CONTEXT.md after changes.`
- `Read AGENT.md and RESUME_CONTEXT.md. Continue from the next recommended step. Current goal: add protected route handling for /app with tests. Minimize token usage.`
- `Read AGENT.md and RESUME_CONTEXT.md. Continue from the next recommended step. Current goal: scaffold resources CRUD backend with tests only.`

## Usage Notes

- Put the current goal in the first message.
- Batch related work into one request.
- Name exact files when you know them.
- Reuse `RESUME_CONTEXT.md` instead of re-explaining completed work.
- Ask for updates to `RESUME_CONTEXT.md` as part of the task, not as a separate follow-up.
