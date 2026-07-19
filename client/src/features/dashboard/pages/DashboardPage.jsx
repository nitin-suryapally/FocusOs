import { useEffect, useState } from "react";
import { useAuthToken } from "../../../store/useAuthStore";
import { fetchDashboardRequest } from "../api/dashboardApi";
import { DashboardEmptyState } from "../components/DashboardEmptyState";
import { DashboardErrorState } from "../components/DashboardErrorState";
import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardLoadingState } from "../components/DashboardLoadingState";
import { DashboardRecentActivitySection } from "../components/DashboardRecentActivitySection";
import { DashboardSummaryCards } from "../components/DashboardSummaryCards";
import { DashboardUpcomingSection } from "../components/DashboardUpcomingSection";
import { isDashboardEmpty, normalizeDashboard } from "../dashboardUtils";

export const DashboardPage = () => {
  const token = useAuthToken();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const loadDashboard = async () => {
    if (!token) {
      setDashboard(null);
      setError("Authentication required.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      setDashboard(normalizeDashboard(await fetchDashboardRequest(token)));
    } catch (requestError) {
      setError(requestError.message || "Unable to load dashboard.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadDashboard();
  }, [token]);
  const isEmpty = dashboard && isDashboardEmpty(dashboard);
  return (
    <div className="space-y-6">
      <DashboardHeader />
      {isLoading ? <DashboardLoadingState /> : null}
      {!isLoading && error ? (
        <DashboardErrorState error={error} onRetry={loadDashboard} />
      ) : null}
      {!isLoading && !error && isEmpty ? <DashboardEmptyState /> : null}
      {!isLoading && !error && dashboard && !isEmpty ? (
        <>
          <DashboardSummaryCards summary={dashboard.summary} />
          <div className="grid gap-6 xl:grid-cols-2">
            <DashboardUpcomingSection items={dashboard.upcoming} />
            <DashboardRecentActivitySection items={dashboard.recentActivity} />
          </div>
        </>
      ) : null}
    </div>
  );
};
