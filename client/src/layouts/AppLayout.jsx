import { Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuthLogout, useAuthUser } from "../store/useAuthStore";
import { AppNavigation } from "../components/AppNavigation";

export const AppLayout = () => {
  const user = useAuthUser();
  const logout = useAuthLogout();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const closeMobileNav = () => setIsMobileNavOpen(false);

  return (
    <div className="min-h-screen bg-background text-on-background">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        <div
          className={[
            "fixed inset-0 z-30 bg-background/70 backdrop-blur-sm transition-opacity lg:hidden",
            isMobileNavOpen ? "opacity-100" : "pointer-events-none opacity-0"
          ].join(" ")}
          aria-hidden="true"
          onClick={closeMobileNav}
        />

        <aside
          id="workspace-navigation"
          className={[
            "fixed inset-y-0 left-0 z-40 flex w-[min(88vw,320px)] min-w-0 flex-col overflow-y-auto rounded-r-[30px] border border-outline-variant/80 bg-surface/95 p-5 shadow-elevated backdrop-blur-xl transition-transform duration-200 lg:sticky lg:top-6 lg:z-auto lg:h-[calc(100vh-3rem)] lg:w-auto lg:translate-x-0 lg:rounded-[30px] lg:bg-surface/90 lg:shadow-card",
            isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
          ].join(" ")}
          aria-label="Workspace navigation"
          data-state={isMobileNavOpen ? "open" : "closed"}
        >
          <div className="flex items-start justify-between gap-4 border-b border-outline-variant/50 pb-5">
            <div>
              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-label-sm uppercase tracking-[0.22em] text-primary">
                Focus AI
              </span>
              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-on-surface">Workspace</h2>
              <p className="mt-2 text-body-sm text-on-surface-variant">
                Shared shell for focused planning and long-range progress.
              </p>
            </div>
            <button
              type="button"
              onClick={closeMobileNav}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-low text-xl leading-none text-on-surface lg:hidden"
              aria-label="Close navigation menu"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="mt-5 rounded-2xl border border-outline-variant/70 bg-surface-container-low px-4 py-3">
            <p className="text-body-sm text-on-surface-variant">Signed in as</p>
            <p className="mt-1 text-label-md text-on-surface">{user?.name || user?.email || "Unknown user"}</p>
          </div>

          <div className="mt-5 min-h-0">
            <AppNavigation onNavigate={closeMobileNav} />
          </div>

          <button
            type="button"
            onClick={() => logout()}
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-label-md text-on-surface transition hover:border-primary/30 hover:bg-surface-container"
          >
            Sign out
          </button>
        </aside>

        <main className="space-y-6 py-1">
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(true)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-outline-variant bg-surface-container-low text-on-surface shadow-card lg:hidden"
            aria-label="Open navigation menu"
            aria-expanded={isMobileNavOpen}
            aria-controls="workspace-navigation"
          >
            <span className="space-y-1.5" aria-hidden="true">
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
            </span>
          </button>

          <header className="rounded-[28px] border border-primary/20 bg-[linear-gradient(135deg,rgba(37,52,109,0.96),rgba(104,124,255,0.88))] p-6 text-on-primary-container shadow-elevated sm:p-8">
            <p className="text-label-sm uppercase tracking-[0.22em] text-on-primary-container/75">App shell</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Structure the day without losing the bigger system.
            </h1>
            <p className="mt-4 max-w-3xl text-body-lg text-on-primary-container/85">
              Navigation, protected routing, and the shared authenticated layout are now in place for the next modules.
            </p>
          </header>

          <Outlet />
        </main>
      </div>
    </div>
  );
};
