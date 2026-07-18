const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";

export const fetchStreakSummaryRequest = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/streaks/summary`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Unable to load streak summary.");
  return data;
};