export const TaskCompletionButton = ({ task, isPending, onToggle }) => (
  <button type="button" onClick={() => onToggle(task)} disabled={isPending} className="inline-flex items-center justify-center rounded-xl border border-outline-variant/80 bg-surface-container px-4 py-2 text-label-md text-on-surface transition hover:border-primary/30 hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-60">
    {isPending ? "Saving..." : task.completed ? "Mark open" : "Mark complete"}
  </button>
);
