export const TaskCardActions = ({ task, isDeleting, onEdit, onDelete }) => (
  <>
    <button
      type="button"
      onClick={() => onEdit(task)}
      className="inline-flex items-center justify-center rounded-xl border border-outline-variant px-4 py-2 text-label-md text-on-surface transition hover:bg-surface-container"
    >
      Edit task
    </button>
    <button
      type="button"
      onClick={() => onDelete(task)}
      disabled={isDeleting}
      className="inline-flex items-center justify-center rounded-xl border border-error/35 px-4 py-2 text-label-md text-error transition hover:bg-error-container disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isDeleting ? "Deleting..." : "Delete task"}
    </button>
  </>
);
