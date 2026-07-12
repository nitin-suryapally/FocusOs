import { FormField } from "../../../components/FormField";

const RESOURCE_TYPE_OPTIONS = ["article", "video", "course", "book", "tool", "document", "other"];
const RESOURCE_STATUS_OPTIONS = ["saved", "in_progress", "completed", "archived"];

const formatLabel = (value) => value.replace(/_/g, " ");

export const ResourceCreateModal = ({
  isOpen,
  values,
  fieldErrors,
  submitError,
  isSubmitting,
  onChange,
  onClose,
  onSubmit
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6" data-testid="resource-create-overlay">
      <button
        type="button"
        aria-label="Close create resource modal"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-resource-title"
        className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-white/70 bg-white/95 p-6 shadow-card backdrop-blur-sm sm:p-8"
      >
        <div className="flex items-start justify-between gap-4 border-b border-outline-variant/60 pb-5">
          <div>
            <p className="text-label-sm uppercase tracking-[0.18em] text-primary">Add resource</p>
            <h2 id="create-resource-title" className="mt-2 text-2xl font-semibold text-on-surface">
              Save something worth returning to
            </h2>
            <p className="mt-3 text-body-sm text-on-surface-variant">Required fields match the backend validation rules.</p>
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
              placeholder="React Patterns"
              error={fieldErrors.title}
            />
            <FormField
              id="topic"
              label="Topic"
              value={values.topic}
              onChange={onChange}
              placeholder="React"
              error={fieldErrors.topic}
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <label className="block space-y-2" htmlFor="type">
              <span className="text-label-md text-on-surface">Type</span>
              <select
                id="type"
                name="type"
                value={values.type}
                onChange={onChange}
                className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
              >
                {RESOURCE_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {formatLabel(option)}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2" htmlFor="status">
              <span className="text-label-md text-on-surface">Status</span>
              <select
                id="status"
                name="status"
                value={values.status}
                onChange={onChange}
                className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
              >
                {RESOURCE_STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {formatLabel(option)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <FormField
            id="url"
            label="URL"
            type="url"
            value={values.url}
            onChange={onChange}
            placeholder="https://example.com/resource"
            autoComplete="url"
            error={fieldErrors.url}
          />

          <FormField
            id="tags"
            label="Tags"
            value={values.tags}
            onChange={onChange}
            placeholder="hooks, components"
          />

          <label className="block space-y-2" htmlFor="notes">
            <span className="text-label-md text-on-surface">Notes</span>
            <textarea
              id="notes"
              name="notes"
              value={values.notes}
              onChange={onChange}
              placeholder="Why this resource matters, what to revisit, or where it applies."
              rows={4}
              className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </label>

          {submitError ? (
            <div className="rounded-2xl border border-error/20 bg-error-container px-4 py-3 text-body-sm text-on-error-container">
              {submitError}
            </div>
          ) : (
            <div className="rounded-2xl border border-secondary-container bg-secondary-container/35 px-4 py-3 text-body-sm text-on-surface-variant">
              Tags are stored as a string array; use commas to separate them.
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
              {isSubmitting ? "Saving..." : "Save resource"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
