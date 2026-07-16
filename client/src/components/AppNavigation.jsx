import { NavLink } from "react-router-dom";

const navigationItems = [
  { to: "/app", label: "Overview", description: "Daily focus and recent activity", end: true },
  { to: "/app/resources", label: "Resources", description: "Save and revisit learning material" },
  { to: "/app/tasks", label: "Tasks", description: "Plan execution and learning work" },
  { to: "/app/streaks", label: "Streaks", description: "Track consistency and momentum" },
  { to: "/app/projects", label: "Projects", description: "Move ideas into active delivery" },
  { to: "/app/applications", label: "Applications", description: "Manage your job pipeline" }
];

const navItemClassName = ({ isActive }) =>
  [
    "group block w-full rounded-2xl border px-4 py-3 transition",
    isActive
      ? "border-primary/30 bg-primary-container text-on-primary-container shadow-card"
      : "border-outline-variant/80 bg-surface-container-low text-on-surface hover:border-primary/30 hover:bg-surface-container"
  ].join(" ");

export const AppNavigation = ({ onNavigate }) => {
  return (
    <nav className="space-y-3">
      {navigationItems.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.end} className={navItemClassName} onClick={onNavigate}>
          <div className="text-label-md">{item.label}</div>
          <p className="mt-1 text-body-sm text-current opacity-75">{item.description}</p>
        </NavLink>
      ))}
    </nav>
  );
};
