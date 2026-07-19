import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(142,162,255,0.2),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(255,178,122,0.12),_transparent_24%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-10 sm:px-6 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:px-10">
        <section className="hidden rounded-[28px] border border-outline-variant/70 bg-surface/70 p-10 shadow-card backdrop-blur-md lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-6">
            <span className="inline-flex w-fit rounded-full bg-primary/10 px-4 py-2 text-label-sm uppercase tracking-[0.24em] text-primary">
              Focus AI
            </span>
            <div className="space-y-4">
              <h1 className="max-w-xl text-5xl font-bold leading-tight tracking-[-0.03em] text-on-surface">
                One place to plan, learn, and follow through.
              </h1>
              <p className="max-w-lg text-body-lg text-on-surface-variant">
                Keep tasks, learning resources, projects, and job applications organized so you can focus on what comes next.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-low p-5 shadow-card">
              <p className="text-3xl font-bold text-primary">Plan</p>
              <p className="mt-2 text-body-sm text-on-surface-variant">See what needs attention today.</p>
            </div>
            <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-low p-5 shadow-card">
              <p className="text-3xl font-bold text-tertiary">Build</p>
              <p className="mt-2 text-body-sm text-on-surface-variant">Turn completed tasks into daily momentum.</p>
            </div>
            <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-low p-5 shadow-card">
              <p className="text-3xl font-bold text-secondary">Move</p>
              <p className="mt-2 text-body-sm text-on-surface-variant">Keep projects and applications moving forward.</p>
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
