import { TaskCompletionButton } from "./TaskCompletionButton";
import { TaskCardActions } from "./TaskCardActions";
import { TaskDetails } from "./TaskDetails";
import { TaskStatusBadges } from "./TaskStatusBadges";

export const TaskCard = ({ task, isTogglePending, isDeleting, onToggleComplete, onEdit, onDelete }) => (
  <article className="rounded-[24px] border border-outline-variant/70 bg-surface-container-low p-5 shadow-card">
    <TaskStatusBadges task={task} />
    <h3 className="mt-4 text-xl font-semibold text-on-surface">{task.title}</h3>
    <TaskDetails task={task} />
    <div className="mt-5 flex flex-wrap gap-3">
      <TaskCompletionButton task={task} isPending={isTogglePending} onToggle={onToggleComplete} />
      <TaskCardActions task={task} isDeleting={isDeleting} onEdit={onEdit} onDelete={onDelete} />
    </div>
  </article>
);
