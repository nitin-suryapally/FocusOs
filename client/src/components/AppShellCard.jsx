export const AppShellCard = ({ eyebrow, title, body, accentClassName = "text-primary" }) => {
  return (
    <article className="rounded-[24px] border border-outline-variant/70 bg-surface-container-low p-6 shadow-card">
      <p className={`text-label-sm uppercase tracking-[0.2em] ${accentClassName}`}>{eyebrow}</p>
      <h3 className="mt-3 text-xl font-semibold text-on-surface">{title}</h3>
      <p className="mt-2 text-body-md text-on-surface-variant">{body}</p>
    </article>
  );
};
