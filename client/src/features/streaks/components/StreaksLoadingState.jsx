export const StreaksLoadingState = () => (
  <section role="status" aria-live="polite" aria-label="Streaks loading state" className="grid gap-4 sm:grid-cols-2">
    {["current", "best"].map((item) => <div key={item} className="animate-pulse rounded-[28px] border border-outline-variant/70 bg-surface-container-low p-6 shadow-card"><div className="h-3 w-24 rounded-full bg-surface-container-high" /><div className="mt-5 h-12 w-20 rounded-full bg-surface-container-high" /></div>)}
  </section>
);