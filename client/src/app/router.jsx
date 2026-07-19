import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { AppLayout } from "../layouts/AppLayout";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { ResourcesPage } from "../features/resources/pages/ResourcesPage";
import { ResourceSkillPage } from "../features/resources/pages/ResourceSkillPage";
import { TasksPage } from "../features/tasks/pages/TasksPage";
import { StreaksPage } from "../features/streaks/pages/StreaksPage";
import { ProjectIdeasPage } from "../features/projectIdeas/pages/ProjectIdeasPage";
import { ProjectIdeaDetailPage } from "../features/projectIdeas/pages/ProjectIdeaDetailPage";
import { JobApplicationsPage } from "../features/jobApplications/pages/JobApplicationsPage";
import { JobApplicationDetailPage } from "../features/jobApplications/pages/JobApplicationDetailPage";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { AppSectionPlaceholderPage } from "../pages/AppSectionPlaceholderPage";
import { ProtectedRoute, PublicOnlyRoute } from "./routeGuards";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/", element: <PublicOnlyRoute />, children: [{ element: <AuthLayout />, children: [{ path: "login", element: <LoginPage /> }, { path: "register", element: <RegisterPage /> }] }] },
  { path: "/app", element: <ProtectedRoute />, children: [{ element: <AppLayout />, children: [
    { index: true, element: <DashboardPage /> },
    { path: "resources", element: <ResourcesPage /> },
    { path: "resources/:skillPageId", element: <ResourceSkillPage /> },
    { path: "tasks", element: <TasksPage /> },
    { path: "streaks", element: <StreaksPage /> },
    { path: "projects", element: <ProjectIdeasPage /> },
    { path: "projects/:ideaId", element: <ProjectIdeaDetailPage /> },
    { path: "applications", element: <JobApplicationsPage /> },
    { path: "applications/:applicationId", element: <JobApplicationDetailPage /> }
  ] }] }
]);