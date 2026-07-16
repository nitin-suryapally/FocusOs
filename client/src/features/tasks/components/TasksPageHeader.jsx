export const TasksPageHeader = ({ submitSuccess, taskActionError, onCreateTask }) => (
  <section className="rounded-[28px] border border-outline-variant/70 bg-surface/82 p-6 shadow-card backdrop-blur-sm sm:p-8">
    <p className="text-label-sm uppercase tracking-[0.2em] text-primary">Tasks</p>
    <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-on-surface sm:text-4xl">
          Keep work visible with clear groups for today, next, and done.
        </h1>
        <p className="mt-4 text-body-lg text-on-surface-variant">
          The connected task feed is now split into Today, Upcoming, and Completed so the next slice can focus on
          task actions instead of page structure.
        </p>
      </div>
      <div className="flex w-full flex-col gap-3 lg:max-w-xs lg:items-end">
        <button
          type="button"
          onClick={onCreateTask}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-label-md text-on-primary shadow-card transition hover:shadow-elevated"
        >
          Add task
        </button>
        <p className="text-body-sm text-on-surface-variant lg:text-right">
          Capture a new item without leaving the grouped task workspace.
        </p>
      </div>
    </div>

    {submitSuccess ? (
      <div className="mt-5 rounded-2xl border border-success/20 bg-success-container px-4 py-3 text-body-sm text-on-success-container">
        {submitSuccess}
      </div>
    ) : null}

    {taskActionError ? (
      <div className="mt-5 rounded-2xl border border-error/20 bg-error-container px-4 py-3 text-body-sm text-on-error-container">
        {taskActionError}
      </div>
    ) : null}
  </section>
);
