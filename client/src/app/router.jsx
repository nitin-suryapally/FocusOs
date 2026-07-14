import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { AppLayout } from "../layouts/AppLayout";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { ResourcesPage } from "../features/resources/pages/ResourcesPage";
import { ResourceSkillPage } from "../features/resources/pages/ResourceSkillPage";
import { TasksPage } from "../features/tasks/pages/TasksPage";
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
            element: <ResourcesPage />
          },
          {
            path: "resources/:skillPageId",
            element: <ResourceSkillPage />
          },
          {
            path: "tasks",
            element: <TasksPage />
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
