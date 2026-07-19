import { NavLink } from "react-router-dom";

const navigationItems = [
  { to: "/app", label: "Overview", description: "Today's priorities and recent progress", end: true },
  { to: "/app/resources", label: "Resources", description: "Save useful learning material by skill" },
  { to: "/app/tasks", label: "Tasks", description: "Plan what needs attention next" },
  { to: "/app/streaks", label: "Streaks", description: "See your current and best streaks" },
  { to: "/app/projects", label: "Projects", description: "Capture ideas and track their next steps" },
  { to: "/app/applications", label: "Applications", description: "Track applications and follow-ups" }
];

const navItemClassName = ({ isActive }) =>
  [
    "group block w-full rounded-2xl border px-4 py-3 transition",
    isActive
      ? "border-primary/30 bg-primary-container text-on-primary-container shadow-card"
      : "border-outline-variant/80 bg-surface-container-low text-on-surface hover:border-primary/30 hover:bg-surface-container",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
  ].join(" ");

export const AppNavigation = ({ onNavigate }) => {
  return (
    <nav aria-label="Primary workspace navigation" className="space-y-3">
      {navigationItems.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.end} className={navItemClassName} onClick={onNavigate}>
          <div className="text-label-md">{item.label}</div>
          <p className="mt-1 text-body-sm text-current opacity-75">{item.description}</p>
        </NavLink>
      ))}
    </nav>
  );
};