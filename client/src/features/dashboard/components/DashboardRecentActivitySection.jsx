import { dashboardItemLabel, formatDashboardDate } from "../dashboardUtils";

export const DashboardRecentActivitySection = ({ items }) => (
  <section className="rounded-[28px] border border-outline-variant/70 bg-surface-container-low p-6 shadow-card">
    <div><p className="text-label-sm uppercase tracking-[0.18em] text-secondary">Recent activity</p><h2 className="mt-2 text-2xl font-semibold text-on-surface">Latest workspace updates</h2></div>
    {items.length ? <ul className="mt-5 divide-y divide-outline-variant/60">{items.map((item) => <li key={`${item.kind}-${item.id}`} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"><div><p className="text-label-sm text-secondary">{dashboardItemLabel(item.kind)}</p><p className="mt-1 text-label-md text-on-surface">{item.title}</p></div><time dateTime={item.updatedAt} className="shrink-0 text-label-md text-on-surface-variant">{formatDashboardDate(item.updatedAt)}</time></li>)}</ul> : <p className="mt-5 text-body-md text-on-surface-variant">No recent activity yet.</p>}
  </section>
);