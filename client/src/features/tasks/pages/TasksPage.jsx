import { useEffect, useState } from "react";
import { useAuthToken } from "../../../store/useAuthStore";
import { fetchTasksRequest } from "../api/tasksApi";

const formatDueDate = (dueDate) => {
  if (!dueDate) {
    return "No due date";
  }

  const parsedDate = new Date(dueDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return "No due date";
  }

  return parsedDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
};

export const TasksPage = () => {
  const token = useAuthToken();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTasks = async () => {
    if (!token) {
      setTasks([]);
      setIsLoading(false);
      setError("Authentication required.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchTasksRequest(token);
      setTasks(result.tasks || []);
    } catch (requestError) {
      setError(requestError.message || "Unable to load tasks.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [token]);

  const completedCount = tasks.filter((task) => task.completed).length;
  const openCount = tasks.length - completedCount;

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-card backdrop-blur-sm sm:p-8">
        <p className="text-label-sm uppercase tracking-[0.2em] text-primary">Tasks</p>
        <div className="mt-3 max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-on-surface sm:text-4xl">
            Keep work visible before we layer in grouping and editing.
          </h1>
          <p className="mt-4 text-body-lg text-on-surface-variant">
            This first tasks shell connects the protected task feed and covers loading, error, and empty states so the
            next slice can focus on Today, Upcoming, and Completed views instead of basic page plumbing.
          </p>
        </div>
      </section>

      {isLoading ? (
        <section aria-label="Tasks loading state" className="grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-[24px] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-card"
            >
              <div className="h-3 w-24 rounded-full bg-surface-container-high" />
              <div className="mt-4 h-8 w-32 rounded-full bg-surface-container-high" />
              <div className="mt-4 h-4 w-full rounded-full bg-surface-container-high" />
              <div className="mt-2 h-4 w-4/5 rounded-full bg-surface-container-high" />
            </div>
          ))}
        </section>
      ) : null}

      {!isLoading && error ? (
        <section className="rounded-[28px] border border-rose-200 bg-white/85 p-6 shadow-card backdrop-blur-sm sm:p-8">
          <p className="text-label-sm uppercase tracking-[0.18em] text-rose-600">Could not load tasks</p>
          <h2 className="mt-3 text-2xl font-semibold text-on-surface">The tasks workspace is unavailable right now.</h2>
          <p className="mt-3 max-w-2xl text-body-md text-on-surface-variant">{error}</p>
          <button
            type="button"
            onClick={loadTasks}
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-label-md text-on-primary transition hover:opacity-90"
          >
            Retry
          </button>
        </section>
      ) : null}

      {!isLoading && !error && tasks.length === 0 ? (
        <section className="rounded-[28px] border border-dashed border-outline-variant bg-white/75 p-6 shadow-card backdrop-blur-sm sm:p-8">
          <p className="text-label-sm uppercase tracking-[0.18em] text-primary">Empty state</p>
          <h2 className="mt-3 text-2xl font-semibold text-on-surface">No tasks added yet.</h2>
          <p className="mt-3 max-w-2xl text-body-md text-on-surface-variant">
            General and learning tasks will show up here as soon as the first item is saved.
          </p>
        </section>
      ) : null}

      {!isLoading && !error && tasks.length > 0 ? (
        <>
          <section className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-[24px] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-card">
              <p className="text-label-sm uppercase tracking-[0.18em] text-on-surface-variant">Total tasks</p>
              <p className="mt-3 text-4xl font-semibold text-on-surface">{tasks.length}</p>
              <p className="mt-3 text-body-sm text-on-surface-variant">Everything currently pulled from the protected task feed.</p>
            </div>
            <div className="rounded-[24px] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-card">
              <p className="text-label-sm uppercase tracking-[0.18em] text-on-surface-variant">Open tasks</p>
              <p className="mt-3 text-4xl font-semibold text-on-surface">{openCount}</p>
              <p className="mt-3 text-body-sm text-on-surface-variant">Tasks that still need attention before completion.</p>
            </div>
            <div className="rounded-[24px] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-card">
              <p className="text-label-sm uppercase tracking-[0.18em] text-on-surface-variant">Completed</p>
              <p className="mt-3 text-4xl font-semibold text-on-surface">{completedCount}</p>
              <p className="mt-3 text-body-sm text-on-surface-variant">Tasks already marked done in the current list.</p>
            </div>
          </section>

          <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-card backdrop-blur-sm sm:p-8">
            <div className="flex flex-col gap-3 border-b border-outline-variant/60 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-label-sm uppercase tracking-[0.18em] text-primary">Task feed</p>
                <h2 className="mt-2 text-2xl font-semibold text-on-surface">Current tasks</h2>
              </div>
              <p className="text-body-sm text-on-surface-variant">
                Grouping and create/edit actions can build on this connected shell in the next slices.
              </p>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {tasks.map((task) => (
                <article
                  key={task.id}
                  className="rounded-[24px] border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-card"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-label-sm uppercase tracking-[0.14em] text-primary">
                      {task.type}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-label-sm uppercase tracking-[0.14em] text-on-surface-variant">
                      {task.priority} priority
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-label-sm uppercase tracking-[0.14em] text-on-surface-variant">
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
                </article>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
};
