import { Link } from "react-router-dom";

export const ResourceSkillUnavailableState = ({ error, onRetry }) => (
  <section className="rounded-[28px] border border-error/20 bg-error-container/35 p-6 shadow-card backdrop-blur-sm sm:p-8">
    <p className="text-label-sm uppercase tracking-[0.18em] text-on-error-container">Could not load skill resources</p>
    <h1 className="mt-3 text-2xl font-semibold text-on-surface">This skill page is unavailable right now.</h1>
    <p className="mt-3 max-w-2xl text-body-md text-on-surface-variant">{error}</p>
    <div className="mt-5 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-label-md text-on-primary transition hover:opacity-90"
      >
        Retry
      </button>
      <Link
        to="/app/resources"
        className="inline-flex items-center justify-center rounded-xl border border-outline-variant px-4 py-3 text-label-md text-on-surface transition hover:bg-surface-container-low"
      >
        Back to library
      </Link>
    </div>
  </section>
);
