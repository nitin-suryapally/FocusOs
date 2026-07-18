import { useEffect, useState } from "react";
import { useAuthToken } from "../../../store/useAuthStore";
import { fetchStreakSummaryRequest } from "../api/streaksApi";
import { StreakSummaryCards } from "../components/StreakSummaryCards";
import { StreaksEmptyState } from "../components/StreaksEmptyState";
import { StreaksErrorState } from "../components/StreaksErrorState";
import { StreaksHeader } from "../components/StreaksHeader";
import { StreaksLoadingState } from "../components/StreaksLoadingState";

export const StreaksPage = () => {
  const token = useAuthToken();
  const [streak, setStreak] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const loadStreak = async () => {
    if (!token) { setStreak(null); setError("Authentication required."); setIsLoading(false); return; }
    setIsLoading(true); setError(null);
    try { const result = await fetchStreakSummaryRequest(token); setStreak(result.streak); } catch (requestError) { setError(requestError.message || "Unable to load streak summary."); } finally { setIsLoading(false); }
  };
  useEffect(() => { loadStreak(); }, [token]);
  const isEmpty = streak?.currentStreak === 0 && streak?.bestStreak === 0;
  return <div className="space-y-6"><StreaksHeader />{isLoading ? <StreaksLoadingState /> : null}{!isLoading && error ? <StreaksErrorState error={error} onRetry={loadStreak} /> : null}{!isLoading && !error && isEmpty ? <StreaksEmptyState /> : null}{!isLoading && !error && !isEmpty ? <StreakSummaryCards streak={streak} /> : null}</div>;
};