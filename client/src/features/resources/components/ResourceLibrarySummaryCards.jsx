const summaryCards = [
  { key: "skillPages", label: "Skill pages", description: "Distinct skill pages currently represented in the library." },
  { key: "resources", label: "Resources", description: "Items currently visible across the filtered skill pages." },
  { key: "topics", label: "Topics", description: "Distinct learning areas represented in the current library." }
];

export const ResourceLibrarySummaryCards = ({ skillPageCount, resourceCount, topicCount }) => {
  const values = { skillPages: skillPageCount, resources: resourceCount, topics: topicCount };

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {summaryCards.map((card) => (
        <div key={card.key} className="rounded-[24px] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-card">
          <p className="text-label-sm uppercase tracking-[0.18em] text-on-surface-variant">{card.label}</p>
          <p className="mt-3 text-4xl font-semibold text-on-surface">{values[card.key]}</p>
          <p className="mt-3 text-body-sm text-on-surface-variant">{card.description}</p>
        </div>
      ))}
    </section>
  );
};
