const summaryCards = [
  {
    key: "total",
    label: "Total tasks",
    description: "Everything currently pulled from the protected task feed."
  },
  {
    key: "open",
    label: "Open tasks",
    description: "Tasks that still need attention before completion."
  },
  {
    key: "completed",
    label: "Completed",
    description: "Tasks already marked done in the current list."
  }
];

export const TaskSummaryCards = ({ totalCount, openCount, completedCount }) => {
  const summaryValues = {
    total: totalCount,
    open: openCount,
    completed: completedCount
  };

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {summaryCards.map((card) => (
        <div key={card.key} className="rounded-[24px] border border-outline-variant/70 bg-surface-container-low p-6 shadow-card">
          <p className="text-label-sm uppercase tracking-[0.18em] text-on-surface-variant">{card.label}</p>
          <p className="mt-3 text-4xl font-semibold text-on-surface">{summaryValues[card.key]}</p>
          <p className="mt-3 text-body-sm text-on-surface-variant">{card.description}</p>
        </div>
      ))}
    </section>
  );
};
