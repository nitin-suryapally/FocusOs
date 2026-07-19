export const ResourceLibraryHeader = ({ submitSuccess, onCreateResource }) => (
  <section className="rounded-[28px] border border-outline-variant/70 bg-surface/82 p-6 shadow-card backdrop-blur-sm sm:p-8">
    <p className="text-label-sm uppercase tracking-[0.2em] text-primary">Resource library</p>
    <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-on-surface sm:text-4xl">
          Keep learning materials organized by skill.
        </h1>
        <p className="mt-4 text-body-lg text-on-surface-variant">
          Create a skill page, then save the links, courses, notes, and references you want to revisit.
        </p>
      </div>
      <div className="flex w-full flex-col gap-3 lg:max-w-xs lg:items-end">
        <button
          type="button"
          onClick={onCreateResource}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-label-md text-on-primary shadow-card transition hover:shadow-elevated"
        >
          Add resource
        </button>
        <p className="text-body-sm text-on-surface-variant lg:text-right">
          Save a useful resource to the right skill page.
        </p>
      </div>
    </div>

    {submitSuccess ? (
      <div className="mt-5 rounded-2xl border border-secondary-container/80 bg-secondary-container/35 px-4 py-3 text-body-sm text-on-secondary-container">
        {submitSuccess}
      </div>
    ) : null}
  </section>
);
