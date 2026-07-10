import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(96,99,238,0.16),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(218,226,253,0.7),_transparent_28%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-10 sm:px-6 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:px-10">
        <section className="hidden rounded-[28px] border border-white/60 bg-white/55 p-10 shadow-card backdrop-blur-md lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-6">
            <span className="inline-flex w-fit rounded-full bg-primary/10 px-4 py-2 text-label-sm uppercase tracking-[0.24em] text-primary">
              Focus AI
            </span>
            <div className="space-y-4">
              <h1 className="max-w-xl text-5xl font-bold leading-tight tracking-[-0.03em] text-on-surface">
                Quiet structure for work that actually compounds.
              </h1>
              <p className="max-w-lg text-body-lg text-on-surface-variant">
                Track learning, execution, streaks, projects, and applications in one calm system built for
                sustained deep work.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-5 shadow-card">
              <p className="text-3xl font-bold text-primary">5</p>
              <p className="mt-2 text-body-sm text-on-surface-variant">Tasks lined up for today.</p>
            </div>
            <div className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-5 shadow-card">
              <p className="text-3xl font-bold text-tertiary">12</p>
              <p className="mt-2 text-body-sm text-on-surface-variant">Current completion streak.</p>
            </div>
            <div className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-5 shadow-card">
              <p className="text-3xl font-bold text-secondary">3</p>
              <p className="mt-2 text-body-sm text-on-surface-variant">Projects with active next steps.</p>
            </div>
          </div>
        </section>
        <section className="mx-auto flex w-full max-w-xl items-center justify-center lg:max-w-none">
          <Outlet />
        </section>
      </div>
    </div>
  );
};
