export const TasksErrorState = ({ error, onRetry }) => (
  <section className="rounded-[28px] border border-error/20 bg-error-container/90 p-6 shadow-card backdrop-blur-sm sm:p-8">
    <p className="text-label-sm uppercase tracking-[0.18em] text-error">Could not load tasks</p>
    <h2 className="mt-3 text-2xl font-semibold text-on-surface">The tasks workspace is unavailable right now.</h2>
    <p className="mt-3 max-w-2xl text-body-md text-on-surface-variant">{error}</p>
    <button
      type="button"
      onClick={onRetry}
      className="mt-5 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-label-md text-on-primary transition hover:opacity-90"
    >
      Retry
    </button>
  </section>
);
