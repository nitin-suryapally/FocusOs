import { TaskCard } from "./TaskCard";

export const TaskGroupSection = ({ title, description, tasks, emptyMessage, togglingTaskIds, onToggleComplete }) => (
  <section className="rounded-[28px] border border-outline-variant/70 bg-surface/82 p-6 shadow-card backdrop-blur-sm sm:p-8">
    <div className="flex flex-col gap-3 border-b border-outline-variant/60 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-label-sm uppercase tracking-[0.18em] text-primary">Task group</p>
        <h2 className="mt-2 text-2xl font-semibold text-on-surface">{title}</h2>
      </div>
      <p className="text-body-sm text-on-surface-variant">{description}</p>
    </div>

    {tasks.length > 0 ? (
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isTogglePending={togglingTaskIds.has(task.id)}
            onToggleComplete={onToggleComplete}
          />
        ))}
      </div>
    ) : (
      <p className="mt-6 text-body-md text-on-surface-variant">{emptyMessage}</p>
    )}
  </section>
);
