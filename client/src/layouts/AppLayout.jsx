import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthLogout, useAuthUser } from "../store/useAuthStore";
import { AppNavigation } from "../components/AppNavigation";
import { OnboardingDeck } from "../features/onboarding/components/OnboardingDeck";
import { dismissRegistrationOnboarding, hasPendingRegistrationOnboarding } from "../features/onboarding/onboardingStorage";

export const AppLayout = () => {
  const user = useAuthUser();
  const logout = useAuthLogout();
  const navigate = useNavigate();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const closeMobileNav = () => setIsMobileNavOpen(false);
  const dismissOnboarding = () => {
    dismissRegistrationOnboarding(user?.id);
    setIsOnboardingOpen(false);
  };

  useEffect(() => {
    setIsOnboardingOpen(hasPendingRegistrationOnboarding(user?.id));
  }, [user?.id]);

  useEffect(() => {
    if (!isMobileNavOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") closeMobileNav();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isMobileNavOpen]);

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
            "fixed inset-y-0 left-0 z-40 flex w-[min(88vw,320px)] min-w-0 flex-col overflow-hidden rounded-r-[30px] border border-outline-variant/80 bg-surface/95 p-5 shadow-elevated backdrop-blur-xl transition-transform duration-200 lg:sticky lg:top-6 lg:z-auto lg:h-[calc(100vh-3rem)] lg:w-auto lg:translate-x-0 lg:rounded-[30px] lg:bg-surface/90 lg:shadow-card",
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
                A focused home for your tasks, learning, projects, and applications.
              </p>
            </div>
            <button
              type="button"
              onClick={closeMobileNav}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-low text-xl leading-none text-on-surface focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 lg:hidden"
              aria-label="Close navigation menu"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="mt-5 rounded-2xl border border-outline-variant/70 bg-surface-container-low px-4 py-3">
            <p className="text-body-sm text-on-surface-variant">Signed in as</p>
            <p className="mt-1 text-label-md text-on-surface">{user?.name || user?.email || "Unknown user"}</p>
          </div>

          <div className="scrollbar-hidden mt-5 min-h-0 flex-1 overflow-y-auto pr-1">
            <AppNavigation onNavigate={closeMobileNav} />
          </div>

          <button
            type="button"
            onClick={() => logout()}
            className="mt-5 inline-flex w-full shrink-0 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-label-md text-on-surface transition hover:border-primary/30 hover:bg-surface-container focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          >
            Sign out
          </button>
        </aside>

        <main className="min-w-0 space-y-6 py-1">
          <div className="flex items-center justify-between lg:hidden">
            <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-label-sm uppercase tracking-[0.22em] text-primary">
              Focus AI
            </span>
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-outline-variant bg-surface-container-low text-on-surface shadow-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
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
          </div>

          <header className="rounded-[28px] border border-primary/20 bg-[linear-gradient(135deg,rgba(37,52,109,0.96),rgba(104,124,255,0.88))] p-6 text-on-primary-container shadow-elevated sm:p-8">
            <p className="text-label-sm uppercase tracking-[0.22em] text-on-primary-container/75">Focus AI workspace</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Keep your work clear and moving.
            </h1>
            <p className="mt-4 max-w-3xl text-body-lg text-on-primary-container/85">
              Plan tasks, build consistent habits, and keep your learning, projects, and applications in one place.
            </p>
          </header>

          <Outlet />
        </main>
      </div>
      <OnboardingDeck isOpen={isOnboardingOpen} onDismiss={dismissOnboarding} onOpenFeature={(to) => { dismissOnboarding(); navigate(to); }} />
    </div>
  );
};
