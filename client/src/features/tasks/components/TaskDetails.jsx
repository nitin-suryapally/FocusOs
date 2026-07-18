import { formatDueDate } from "../taskUtils";

export const TaskDetails = ({ task }) => (
  <dl className="mt-4 space-y-2 text-body-sm text-on-surface-variant">
    <div className="flex items-center justify-between gap-3"><dt>Topic</dt><dd>{task.topic || "Not set"}</dd></div>
    <div className="flex items-center justify-between gap-3"><dt>Due date</dt><dd>{formatDueDate(task.dueDate)}</dd></div>
    {task.resource ? <div className="flex items-center justify-between gap-3"><dt>Resource</dt><dd>{task.resource.title}</dd></div> : null}
  </dl>
);