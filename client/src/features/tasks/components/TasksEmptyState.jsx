export const TasksEmptyState = () => (
  <section className="rounded-[28px] border border-dashed border-outline-variant bg-surface/78 p-6 shadow-card backdrop-blur-sm sm:p-8">
    <p className="text-label-sm uppercase tracking-[0.18em] text-primary">Empty state</p>
    <h2 className="mt-3 text-2xl font-semibold text-on-surface">No tasks added yet.</h2>
    <p className="mt-3 max-w-2xl text-body-md text-on-surface-variant">
      General and learning tasks will show up here as soon as the first item is saved.
    </p>
  </section>
);
