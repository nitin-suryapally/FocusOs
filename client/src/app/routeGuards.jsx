import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuthInitialize, useAuthIsInitializing, useAuthToken } from "../store/useAuthStore";

const SessionLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-background px-6 text-body-md text-on-surface">
    Restoring your workspace...
  </div>
);

export const ProtectedRoute = () => {
  const location = useLocation();
  const token = useAuthToken();
  const initialize = useAuthInitialize();
  const isInitializing = useAuthIsInitializing();

  useEffect(() => {
    if (token) {
      initialize().catch(() => undefined);
    }
  }, [initialize, token]);

  if (token && isInitializing) {
    return <SessionLoader />;
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export const PublicOnlyRoute = () => {
  const token = useAuthToken();

  if (token) {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
};
