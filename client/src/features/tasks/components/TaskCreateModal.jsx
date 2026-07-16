import { FormField, formControlClassName } from "../../../components/FormField";

const TASK_TYPE_OPTIONS = ["general", "learning"];
const TASK_PRIORITY_OPTIONS = ["low", "medium", "high"];

const formatLabel = (value) => value.charAt(0).toUpperCase() + value.slice(1);

export const TaskCreateModal = ({
  isOpen,
  values,
  fieldErrors,
  submitError,
  isSubmitting,
  onChange,
  onClose,
  onSubmit,
  submitLabel = "Save task",
  overlayTestId = "task-create-overlay"
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6" data-testid={overlayTestId}>
      <button
        type="button"
        aria-label="Close task modal"
        onClick={onClose}
        className="absolute inset-0 bg-background/75 backdrop-blur-sm"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
        className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-outline-variant/70 bg-surface/95 p-6 shadow-card backdrop-blur-sm sm:p-8"
      >
        <div className="flex items-start justify-between gap-4 border-b border-outline-variant/60 pb-5">
          <div>
            <p className="text-label-sm uppercase tracking-[0.18em] text-primary">Add task</p>
            <h2 id="task-form-title" className="mt-2 text-2xl font-semibold text-on-surface">
              Capture the next task before it slips away
            </h2>
            <p className="mt-3 text-body-sm text-on-surface-variant">
              Required fields match the current backend validation rules.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-xl border border-outline-variant px-4 py-2 text-label-md text-on-surface transition hover:bg-surface-container-low"
          >
            Cancel
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={onSubmit} noValidate>
          <div className="grid gap-5 lg:grid-cols-2">
            <FormField
              id="title"
              label="Title"
              value={values.title}
              onChange={onChange}
              placeholder="Prepare weekly review"
              error={fieldErrors.title}
            />
            <FormField
              id="topic"
              label="Topic"
              value={values.topic}
              onChange={onChange}
              placeholder="Planning"
              error={fieldErrors.topic}
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <label className="block space-y-2" htmlFor="type">
              <span className="text-label-md text-on-surface">Type</span>
              <select id="type" name="type" value={values.type} onChange={onChange} className={formControlClassName}>
                {TASK_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {formatLabel(option)}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2" htmlFor="priority">
              <span className="text-label-md text-on-surface">Priority</span>
              <select
                id="priority"
                name="priority"
                value={values.priority}
                onChange={onChange}
                className={formControlClassName}
              >
                {TASK_PRIORITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {formatLabel(option)}
                  </option>
                ))}
              </select>
            </label>

            <FormField
              id="dueDate"
              label="Due date"
              type="date"
              value={values.dueDate}
              onChange={onChange}
              error={fieldErrors.dueDate}
            />
          </div>

          {submitError ? (
            <div className="rounded-2xl border border-error/20 bg-error-container px-4 py-3 text-body-sm text-on-error-container">
              {submitError}
            </div>
          ) : (
            <div className="rounded-2xl border border-secondary-container/80 bg-secondary-container/35 px-4 py-3 text-body-sm text-on-secondary-container">
              New tasks start open and appear in Today or Upcoming based on the due date.
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-xl border border-outline-variant px-4 py-3 text-label-md text-on-surface transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-70"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-label-md text-on-primary shadow-card transition hover:shadow-elevated disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : submitLabel}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
