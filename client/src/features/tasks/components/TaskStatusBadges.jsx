export const TaskStatusBadges = ({ task }) => (
  <div className="flex flex-wrap items-center gap-2">
    <span className="rounded-full bg-primary-container px-3 py-1 text-label-sm uppercase tracking-[0.14em] text-on-primary-container">{task.type}</span>
    <span className="rounded-full bg-surface-container-high px-3 py-1 text-label-sm uppercase tracking-[0.14em] text-on-surface-variant">{task.priority} priority</span>
    <span className="rounded-full bg-surface-container-high px-3 py-1 text-label-sm uppercase tracking-[0.14em] text-on-surface-variant">{task.completed ? "Completed" : "Open"}</span>
  </div>
);
