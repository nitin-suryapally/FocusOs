import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { AppLayout } from "../layouts/AppLayout";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { AppOverviewPage } from "../pages/AppOverviewPage";
import { AppSectionPlaceholderPage } from "../pages/AppSectionPlaceholderPage";
import { ProtectedRoute, PublicOnlyRoute } from "./routeGuards";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />
  },
  {
    path: "/",
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <LoginPage />
          },
          {
            path: "register",
            element: <RegisterPage />
          }
        ]
      }
    ]
  },
  {
    path: "/app",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <AppOverviewPage />
          },
          {
            path: "resources",
            element: (
              <AppSectionPlaceholderPage
                eyebrow="Resources"
                title="Resources module scaffold"
                description="This route is ready for resource CRUD, filters, and empty/loading states inside the shared shell."
              />
            )
          },
          {
            path: "tasks",
            element: (
              <AppSectionPlaceholderPage
                eyebrow="Tasks"
                title="Tasks module scaffold"
                description="This route is ready for today, upcoming, and completed task views within the protected layout."
              />
            )
          },
          {
            path: "streaks",
            element: (
              <AppSectionPlaceholderPage
                eyebrow="Streaks"
                title="Streaks module scaffold"
                description="This route is reserved for current streak, best streak, and daily completion logic."
              />
            )
          },
          {
            path: "projects",
            element: (
              <AppSectionPlaceholderPage
                eyebrow="Projects"
                title="Projects module scaffold"
                description="This route is ready for project idea capture, progress notes, and next-step tracking."
              />
            )
          },
          {
            path: "applications",
            element: (
              <AppSectionPlaceholderPage
                eyebrow="Applications"
                title="Applications module scaffold"
                description="This route is ready for job application tracking with status, dates, and follow-up flow."
              />
            )
          }
        ]
      }
    ]
  }
]);
