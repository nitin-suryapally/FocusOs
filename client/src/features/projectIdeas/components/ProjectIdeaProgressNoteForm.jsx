import { formTextAreaClassName } from "../../../components/FormField";

export const ProjectIdeaProgressNoteForm = ({ value, error, isSubmitting, onChange, onSubmit }) => (
  <section className="rounded-[28px] border border-outline-variant/70 bg-surface-container-low p-6 shadow-card">
    <p className="text-label-sm uppercase tracking-[0.18em] text-primary">Progress note</p>
    <h2 className="mt-3 text-2xl font-semibold text-on-surface">Record an improvement.</h2>
    <form className="mt-5 space-y-4" onSubmit={onSubmit} noValidate>
      <label className="block space-y-2" htmlFor="progress-note">
        <span className="text-label-md text-on-surface">What changed?</span>
        <textarea id="progress-note" value={value} onChange={onChange} rows={4} className={formTextAreaClassName} aria-invalid={Boolean(error)} aria-describedby={error ? "progress-note-error" : undefined} />
      </label>
      {error ? <p id="progress-note-error" className="text-body-sm text-error">{error}</p> : null}
      <button type="submit" disabled={isSubmitting} className="rounded-xl bg-primary px-4 py-3 text-label-md text-on-primary disabled:opacity-70">{isSubmitting ? "Adding..." : "Add progress note"}</button>
    </form>
  </section>
);