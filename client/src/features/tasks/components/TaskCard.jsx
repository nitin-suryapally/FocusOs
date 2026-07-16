import { formatDueDate } from "../taskUtils";

export const TaskCard = ({ task, isTogglePending, onToggleComplete }) => (
  <article className="rounded-[24px] border border-outline-variant/70 bg-surface-container-low p-5 shadow-card">
    <div className="flex flex-wrap items-center gap-2">
      <span className="rounded-full bg-primary-container px-3 py-1 text-label-sm uppercase tracking-[0.14em] text-on-primary-container">
        {task.type}
      </span>
      <span className="rounded-full bg-surface-container-high px-3 py-1 text-label-sm uppercase tracking-[0.14em] text-on-surface-variant">
        {task.priority} priority
      </span>
      <span className="rounded-full bg-surface-container-high px-3 py-1 text-label-sm uppercase tracking-[0.14em] text-on-surface-variant">
        {task.completed ? "Completed" : "Open"}
      </span>
    </div>
    <h3 className="mt-4 text-xl font-semibold text-on-surface">{task.title}</h3>
    <dl className="mt-4 space-y-2 text-body-sm text-on-surface-variant">
      <div className="flex items-center justify-between gap-3">
        <dt>Topic</dt>
        <dd>{task.topic || "Not set"}</dd>
      </div>
      <div className="flex items-center justify-between gap-3">
        <dt>Due date</dt>
        <dd>{formatDueDate(task.dueDate)}</dd>
      </div>
    </dl>
    <div className="mt-5">
      <button
        type="button"
        onClick={() => onToggleComplete(task)}
        disabled={isTogglePending}
        className="inline-flex items-center justify-center rounded-xl border border-outline-variant/80 bg-surface-container px-4 py-2 text-label-md text-on-surface transition hover:border-primary/30 hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isTogglePending ? "Saving..." : task.completed ? "Mark open" : "Mark complete"}
      </button>
    </div>
  </article>
);
