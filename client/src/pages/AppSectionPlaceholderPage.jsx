export const AppSectionPlaceholderPage = ({ eyebrow, title, description }) => {
  return (
    <div className="rounded-[28px] border border-outline-variant/70 bg-surface/82 p-6 shadow-card backdrop-blur-sm sm:p-8">
      <p className="text-label-sm uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-on-surface sm:text-4xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-body-lg text-on-surface-variant">{description}</p>
    </div>
  );
};
