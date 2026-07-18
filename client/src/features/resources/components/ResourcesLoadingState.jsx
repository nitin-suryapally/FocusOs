export const ResourcesLoadingState = () => (
  <section aria-label="Resources loading state" className="grid gap-4 lg:grid-cols-3">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className="animate-pulse rounded-[24px] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-card"
      >
        <div className="h-3 w-24 rounded-full bg-surface-container-high" />
        <div className="mt-4 h-8 w-28 rounded-full bg-surface-container-high" />
        <div className="mt-4 h-4 w-full rounded-full bg-surface-container-high" />
        <div className="mt-2 h-4 w-4/5 rounded-full bg-surface-container-high" />
      </div>
    ))}
  </section>
);
