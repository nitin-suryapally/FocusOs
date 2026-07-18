import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuthToken } from "../../../store/useAuthStore";
import { fetchJobApplicationRequest } from "../api/jobApplicationsApi";
import { JobApplicationDetailSummary } from "../components/JobApplicationDetailSummary";

export const JobApplicationDetailPage = () => {
  const { applicationId } = useParams();
  const token = useAuthToken();
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadApplication = async () => {
    if (!token) {
      setError("Authentication required.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      setApplication((await fetchJobApplicationRequest(token, applicationId)).application);
    } catch (requestError) {
      setError(requestError.message || "Unable to load job application.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadApplication(); }, [token, applicationId]);

  if (isLoading) return <section aria-label="Job application loading state" className="animate-pulse rounded-[28px] border border-outline-variant/70 bg-surface-container-low p-8 shadow-card"><div className="h-4 w-28 rounded-full bg-surface-container-high" /><div className="mt-5 h-10 w-2/3 rounded-full bg-surface-container-high" /></section>;
  if (error) return <section className="rounded-[28px] border border-error/20 bg-error-container/90 p-6 shadow-card"><p className="text-label-sm uppercase tracking-[0.18em] text-error">Could not load job application</p><p className="mt-3 text-body-md text-on-error-container">{error}</p><div className="mt-5 flex gap-3"><button type="button" onClick={loadApplication} className="rounded-xl bg-primary px-4 py-3 text-label-md text-on-primary">Retry</button><Link to="/app/applications" className="rounded-xl border border-outline-variant px-4 py-3 text-label-md text-on-surface">Back to applications</Link></div></section>;

  return <div className="space-y-6"><Link to="/app/applications" className="inline-flex text-label-md text-primary">Back to applications</Link><JobApplicationDetailSummary application={application} /></div>;
};