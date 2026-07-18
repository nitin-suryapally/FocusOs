import { useEffect, useState } from "react";
import { ConfirmActionModal } from "../../../components/ConfirmActionModal";
import { useAuthToken } from "../../../store/useAuthStore";
import { createJobApplicationRequest, deleteJobApplicationRequest, fetchJobApplicationsRequest, updateJobApplicationRequest } from "../api/jobApplicationsApi";
import { JobApplicationCreateModal } from "../components/JobApplicationCreateModal";
import { JobApplicationsEmptyState } from "../components/JobApplicationsEmptyState";
import { JobApplicationsErrorState } from "../components/JobApplicationsErrorState";
import { JobApplicationsFilters } from "../components/JobApplicationsFilters";
import { JobApplicationsHeader } from "../components/JobApplicationsHeader";
import { JobApplicationsList } from "../components/JobApplicationsList";
import { JobApplicationsLoadingState } from "../components/JobApplicationsLoadingState";
import { INITIAL_JOB_APPLICATION_FILTERS, filterAndSortJobApplications, hasActiveJobApplicationFilters } from "../jobApplicationFilters";

const initialValues = { company: "", role: "", status: "saved", applicationUrl: "", followUpDate: "", notes: "" };

export const JobApplicationsPage = () => {
  const token = useAuthToken();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [values, setValues] = useState(initialValues);
  const [formError, setFormError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filters, setFilters] = useState(INITIAL_JOB_APPLICATION_FILTERS);
  const [statusError, setStatusError] = useState(null);
  const [pendingStatusId, setPendingStatusId] = useState(null);
  const visibleApplications = filterAndSortJobApplications(applications, filters);

  const loadApplications = async () => {
    if (!token) {
      setError("Authentication required.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      setApplications((await fetchJobApplicationsRequest(token)).applications || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadApplications(); }, [token]);

  const openModal = (application) => {
    setEditing(application || null);
    setValues(application ? { ...initialValues, ...application, followUpDate: application.followUpDate?.slice(0, 10) || "" } : initialValues);
    setFormError({});
    setIsOpen(true);
  };

  const submitApplication = async (event) => {
    event.preventDefault();
    if (!values.company.trim() || !values.role.trim()) {
      setFormError({ company: !values.company.trim() ? "Company is required." : undefined, role: !values.role.trim() ? "Role is required." : undefined });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { ...values, company: values.company.trim(), role: values.role.trim(), applicationUrl: values.applicationUrl.trim(), notes: values.notes.trim() };
      const result = editing ? await updateJobApplicationRequest(token, editing.id, payload) : await createJobApplicationRequest(token, payload);
      setApplications((current) => editing ? current.map((application) => application.id === result.application.id ? result.application : application) : [result.application, ...current]);
      setIsOpen(false);
    } catch (requestError) {
      setFormError({ submit: requestError.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStatus = async (application, status) => {
    if (status === application.status) return;

    setPendingStatusId(application.id);
    setStatusError(null);
    try {
      const result = await updateJobApplicationRequest(token, application.id, { status });
      setApplications((current) => current.map((currentApplication) => currentApplication.id === result.application.id ? result.application : currentApplication));
    } catch (requestError) {
      setStatusError(requestError.message || "Unable to update job application status.");
    } finally {
      setPendingStatusId(null);
    }
  };

  const deleteApplication = async () => {
    if (!applicationToDelete) return;

    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteJobApplicationRequest(token, applicationToDelete.id);
      setApplications((current) => current.filter((application) => application.id !== applicationToDelete.id));
      setApplicationToDelete(null);
    } catch (requestError) {
      setDeleteError(requestError.message || "Unable to delete job application.");
    } finally {
      setIsDeleting(false);
    }
  };

  return <div className="space-y-6">
    <JobApplicationsHeader onCreate={() => openModal()} />
    <JobApplicationCreateModal isOpen={isOpen} values={values} error={formError} isSubmitting={isSubmitting} onChange={(event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }))} onClose={() => !isSubmitting && setIsOpen(false)} onSubmit={submitApplication} eyebrow={editing ? "Edit application" : undefined} heading={editing ? "Update the opportunity." : undefined} submitLabel={editing ? "Update application" : undefined} />
    {isLoading ? <JobApplicationsLoadingState /> : null}
    {!isLoading && error ? <JobApplicationsErrorState error={error} onRetry={loadApplications} /> : null}
    {!isLoading && !error && !applications.length ? <JobApplicationsEmptyState /> : null}
    {!isLoading && !error && applications.length ? <JobApplicationsFilters filters={filters} applicationCount={visibleApplications.length} hasActiveFilters={hasActiveJobApplicationFilters(filters)} onChange={(event) => setFilters((current) => ({ ...current, [event.target.name]: event.target.value }))} onReset={() => setFilters(INITIAL_JOB_APPLICATION_FILTERS)} /> : null}
    {!isLoading && !error && applications.length && !visibleApplications.length ? <section className="rounded-[28px] border border-dashed border-outline-variant bg-surface/78 p-6 text-center shadow-card"><h2 className="text-2xl font-semibold text-on-surface">No applications match these filters.</h2><p className="mt-3 text-body-md text-on-surface-variant">Adjust or clear the filters to see more of your pipeline.</p></section> : null}
    {!isLoading && !error && visibleApplications.length ? <JobApplicationsList applications={visibleApplications} onEdit={openModal} onDelete={(application) => { setDeleteError(null); setApplicationToDelete(application); }} onStatusChange={updateStatus} pendingStatusId={pendingStatusId} /> : null}
    {statusError ? <p className="text-body-sm text-error">{statusError}</p> : null}
    {deleteError ? <p className="text-body-sm text-error">{deleteError}</p> : null}
    <ConfirmActionModal isOpen={Boolean(applicationToDelete)} title="Delete job application?" description={`Delete ${applicationToDelete?.company || "this job application"}? This cannot be undone.`} confirmLabel="Delete application" isConfirming={isDeleting} onCancel={() => !isDeleting && setApplicationToDelete(null)} onConfirm={deleteApplication} testId="job-application-delete-confirmation" />
  </div>;
};