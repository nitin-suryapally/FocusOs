import { AppShellCard } from "../components/AppShellCard";

const summaryStats = [
  { label: "Today", value: "5", note: "Tasks blocked into deep and shallow work." },
  { label: "Streak", value: "12", note: "Consecutive days with all required work done." },
  { label: "Pipeline", value: "4", note: "Projects or applications needing the next move." }
];

export const AppOverviewPage = () => {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-card backdrop-blur-sm sm:p-8">
        <p className="text-label-sm uppercase tracking-[0.2em] text-primary">Overview</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-on-surface sm:text-4xl">
          One shell for planning, learning, and consistent execution.
        </h1>
        <p className="mt-4 max-w-3xl text-body-lg text-on-surface-variant">
          The authenticated workspace is in place. Module screens are scaffolded so the next feature can plug into a
          shared navigation, responsive shell, and protected route structure.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {summaryStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[24px] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-card"
          >
            <p className="text-label-sm uppercase tracking-[0.18em] text-on-surface-variant">{stat.label}</p>
            <p className="mt-3 text-4xl font-semibold text-on-surface">{stat.value}</p>
            <p className="mt-3 text-body-sm text-on-surface-variant">{stat.note}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <AppShellCard
          eyebrow="Resources"
          title="Keep source material close to action."
          body="Saved references, courses, and documentation will live in a dedicated module without breaking the shell."
        />
        <AppShellCard
          eyebrow="Tasks"
          title="Daily execution stays visible."
          body="Task planning, completion state, and upcoming work can drop into the center panel without changing navigation."
          accentClassName="text-secondary"
        />
        <AppShellCard
          eyebrow="Projects"
          title="Ideas move with less friction."
          body="Projects and applications already have reserved routes so future CRUD work stays isolated by feature."
          accentClassName="text-tertiary"
        />
      </section>
    </div>
  );
};
