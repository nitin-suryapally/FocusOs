const cards = (summary) => [
  { label: "Open tasks", value: summary.tasks.openCount, note: `${summary.tasks.dueTodayCount} due today · ${summary.tasks.overdueCount} overdue` },
  { label: "Resources", value: summary.resources.totalCount, note: `${summary.resources.inProgressCount} in progress` },
  { label: "Current streak", value: summary.streak.currentStreak, note: `Best streak: ${summary.streak.bestStreak} days` },
  { label: "Active ideas", value: summary.projectIdeas.activeCount, note: "Planned or in progress" },
  { label: "Applications", value: summary.jobApplications.activeCount, note: `${summary.jobApplications.followUpDueCount} follow-up${summary.jobApplications.followUpDueCount === 1 ? "" : "s"} due` }
];

export const DashboardSummaryCards = ({ summary }) => (
  <section aria-label="Dashboard summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
    {cards(summary).map((card) => <article key={card.label} className="rounded-[24px] border border-outline-variant/70 bg-surface-container-low p-5 shadow-card"><p className="text-label-sm uppercase tracking-[0.16em] text-on-surface-variant">{card.label}</p><p className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-on-surface">{card.value}</p><p className="mt-3 text-body-sm text-on-surface-variant">{card.note}</p></article>)}
  </section>
);