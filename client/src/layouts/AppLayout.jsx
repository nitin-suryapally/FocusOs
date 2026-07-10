import { Outlet } from "react-router-dom";
import { useAuthLogout, useAuthUser } from "../store/useAuthStore";
import { AppNavigation } from "../components/AppNavigation";

export const AppLayout = () => {
  const user = useAuthUser();
  const logout = useAuthLogout();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        <aside className="rounded-[30px] border border-white/60 bg-white/75 p-5 shadow-card backdrop-blur-xl lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
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
          </div>

          <div className="mt-5 rounded-2xl border border-outline-variant/60 bg-surface-container-low px-4 py-3">
            <p className="text-body-sm text-on-surface-variant">Signed in as</p>
            <p className="mt-1 text-label-md text-on-surface">{user?.name || user?.email || "Unknown user"}</p>
          </div>

          <div className="mt-5">
            <AppNavigation />
          </div>

          <button
            type="button"
            onClick={() => logout()}
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-outline-variant bg-white px-4 py-3 text-label-md text-on-surface transition hover:border-primary/30 hover:bg-surface-container-low"
          >
            Sign out
          </button>
        </aside>

        <main className="space-y-6 py-1">
          <header className="rounded-[28px] border border-white/60 bg-[linear-gradient(135deg,rgba(70,72,212,0.97),rgba(96,99,238,0.82))] p-6 text-on-primary shadow-elevated sm:p-8">
            <p className="text-label-sm uppercase tracking-[0.22em] text-white/80">App shell</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Structure the day without losing the bigger system.
            </h1>
            <p className="mt-4 max-w-3xl text-body-lg text-white/85">
              Navigation, protected routing, and the shared authenticated layout are now in place for the next modules.
            </p>
          </header>

          <Outlet />
        </main>
      </div>
    </div>
  );
};
