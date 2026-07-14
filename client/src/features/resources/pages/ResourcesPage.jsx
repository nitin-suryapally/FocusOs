import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthToken } from "../../../store/useAuthStore";
import { createResourceRequest, fetchResourcesRequest } from "../api/resourcesApi";
import { ResourceFormModal } from "../components/ResourceCreateModal";
import { ResourceLibraryFilters } from "../components/ResourceLibraryFilters";
import { buildResourcePayload, createResourceFormValues, INITIAL_RESOURCE_FORM_VALUES, validateResourceForm } from "../resourceForm";
import {
  buildResourceLibraryFilterOptions,
  filterResources,
  hasActiveResourceLibraryFilters,
  INITIAL_RESOURCE_LIBRARY_FILTERS
} from "../resourceFilters";
import { buildSkillPagePath, buildSkillPages, formatSkillPageDescription, formatTopicCount } from "../resourceLibrary";

export const ResourcesPage = () => {
  const token = useAuthToken();
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formValues, setFormValues] = useState(INITIAL_RESOURCE_FORM_VALUES);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState(INITIAL_RESOURCE_LIBRARY_FILTERS);
  const filteredResources = filterResources(resources, filters);
  const filterOptions = buildResourceLibraryFilterOptions(resources);
  const topicCount = formatTopicCount(filteredResources);
  const skillPages = buildSkillPages(filteredResources);
  const hasActiveFilters = hasActiveResourceLibraryFilters(filters);
  const resultSummary = `${skillPages.length} skill page${skillPages.length === 1 ? "" : "s"} from ${filteredResources.length} resource${
    filteredResources.length === 1 ? "" : "s"
  }`;

  const loadResources = async () => {
    if (!token) {
      setResources([]);
      setIsLoading(false);
      setError("Authentication required.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchResourcesRequest(token);
      setResources(result.resources || []);
    } catch (requestError) {
      setError(requestError.message || "Unable to load resources.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, [token]);

  const openCreateModal = () => {
    setSubmitError(null);
    setFieldErrors({});
    setFormValues(createResourceFormValues());
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    if (isSubmitting) {
      return;
    }

    setIsCreateModalOpen(false);
    setSubmitError(null);
    setFieldErrors({});
  };

  const updateField = (event) => {
    const { name, value } = event.target;

    setFormValues((current) => ({ ...current, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((current) => ({ ...current, [name]: undefined }));
    }

    if (submitError) {
      setSubmitError(null);
    }

    if (submitSuccess) {
      setSubmitSuccess(null);
    }
  };

  const updateFilter = (event) => {
    const { name, value } = event.target;

    setFilters((current) => ({ ...current, [name]: value }));
  };

  const resetFilters = () => {
    setFilters(INITIAL_RESOURCE_LIBRARY_FILTERS);
  };

  const handleCreateResource = async (event) => {
    event.preventDefault();

    if (!token) {
      setSubmitError("Authentication required.");
      return;
    }

    const nextErrors = validateResourceForm(formValues);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    const payload = buildResourcePayload(formValues);

    setFieldErrors({});
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(true);

    try {
      const result = await createResourceRequest(token, payload);
      const createdResource = result.resource;

      setResources((current) => [createdResource, ...current]);
      setError(null);
      setIsLoading(false);
      setFormValues(INITIAL_RESOURCE_FORM_VALUES);
      setSubmitSuccess(result.message || "Resource created.");
      setIsCreateModalOpen(false);
    } catch (requestError) {
      setSubmitError(requestError.message || "Unable to create resource.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-card backdrop-blur-sm sm:p-8">
        <p className="text-label-sm uppercase tracking-[0.2em] text-primary">Resource library</p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-on-surface sm:text-4xl">
              Organize skill pages and the resources each one needs.
            </h1>
            <p className="mt-4 text-body-lg text-on-surface-variant">
              The Resource Library is the entry point for every skill page. Each page groups links, articles, notes,
              and references for a specific skill so the library stays structured instead of becoming one long list.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 lg:max-w-xs lg:items-end">
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-label-md text-on-primary shadow-card transition hover:shadow-elevated"
            >
              Add resource
            </button>
            <p className="text-body-sm text-on-surface-variant lg:text-right">
              Add a new item to the right skill page without leaving the library.
            </p>
          </div>
        </div>

        {submitSuccess ? (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-body-sm text-emerald-700">
            {submitSuccess}
          </div>
        ) : null}
      </section>

      <ResourceFormModal
        isOpen={isCreateModalOpen}
        values={formValues}
        fieldErrors={fieldErrors}
        submitError={submitError}
        isSubmitting={isSubmitting}
        onChange={updateField}
        onClose={closeCreateModal}
        onSubmit={handleCreateResource}
        eyebrow="Add resource"
        title="Save something worth returning to"
        description="Required fields match the backend validation rules."
        submitLabel="Save resource"
        overlayTestId="resource-create-overlay"
      />

      {isLoading ? (
        <section aria-label="Resources loading state" className="grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-[24px] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-card"
            >
              <div className="h-3 w-24 rounded-full bg-surface-container-high" />
              <div className="mt-4 h-8 w-28 rounded-full bg-surface-container-high" />
              <div className="mt-4 h-4 w-full rounded-full bg-surface-container-high" />
              <div className="mt-2 h-4 w-4/5 rounded-full bg-surface-container-high" />
            </div>
          ))}
        </section>
      ) : null}

      {!isLoading && error ? (
        <section className="rounded-[28px] border border-rose-200 bg-white/85 p-6 shadow-card backdrop-blur-sm sm:p-8">
          <p className="text-label-sm uppercase tracking-[0.18em] text-rose-600">Could not load resources</p>
          <h2 className="mt-3 text-2xl font-semibold text-on-surface">The library is unavailable right now.</h2>
          <p className="mt-3 max-w-2xl text-body-md text-on-surface-variant">{error}</p>
          <button
            type="button"
            onClick={loadResources}
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-label-md text-on-primary transition hover:opacity-90"
          >
            Retry
          </button>
        </section>
      ) : null}

      {!isLoading && !error && resources.length === 0 ? (
        <section className="rounded-[28px] border border-dashed border-outline-variant bg-white/75 p-6 shadow-card backdrop-blur-sm sm:p-8">
          <p className="text-label-sm uppercase tracking-[0.18em] text-primary">Empty state</p>
          <h2 className="mt-3 text-2xl font-semibold text-on-surface">No resources saved yet.</h2>
          <p className="mt-3 max-w-2xl text-body-md text-on-surface-variant">
            Saved links, courses, notes, and reference docs will appear here as soon as they are added.
          </p>
        </section>
      ) : null}

      {!isLoading && !error && resources.length > 0 ? (
        <>
          <ResourceLibraryFilters
            filters={filters}
            options={filterOptions}
            resultSummary={resultSummary}
            hasActiveFilters={hasActiveFilters}
            onChange={updateFilter}
            onReset={resetFilters}
          />

          <section className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-[24px] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-card">
              <p className="text-label-sm uppercase tracking-[0.18em] text-on-surface-variant">Skill pages</p>
              <p className="mt-3 text-4xl font-semibold text-on-surface">{skillPages.length}</p>
              <p className="mt-3 text-body-sm text-on-surface-variant">Distinct skill pages currently represented in the library.</p>
            </div>
            <div className="rounded-[24px] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-card">
              <p className="text-label-sm uppercase tracking-[0.18em] text-on-surface-variant">Resources</p>
              <p className="mt-3 text-4xl font-semibold text-on-surface">{filteredResources.length}</p>
              <p className="mt-3 text-body-sm text-on-surface-variant">Items currently visible across the filtered skill pages.</p>
            </div>
            <div className="rounded-[24px] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-card">
              <p className="text-label-sm uppercase tracking-[0.18em] text-on-surface-variant">Topics</p>
              <p className="mt-3 text-4xl font-semibold text-on-surface">{topicCount}</p>
              <p className="mt-3 text-body-sm text-on-surface-variant">Distinct learning areas represented in the current library.</p>
            </div>
          </section>

          <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-card backdrop-blur-sm sm:p-8">
            <div className="flex flex-col gap-3 border-b border-outline-variant/60 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-label-sm uppercase tracking-[0.18em] text-primary">Skill pages</p>
                <h2 className="mt-2 text-2xl font-semibold text-on-surface">Resource Library</h2>
              </div>
              <p className="text-body-sm text-on-surface-variant">Open a skill page to see the resources stored for that topic.</p>
            </div>

            {skillPages.length > 0 ? (
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {skillPages.map((skillPage) => (
                  <Link
                    key={skillPage.id}
                    to={buildSkillPagePath(skillPage.id)}
                    className="rounded-[24px] border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-elevated"
                  >
                    <p className="text-label-sm uppercase tracking-[0.18em] text-primary">Skill page</p>
                    <h3 className="mt-3 text-2xl font-semibold text-on-surface">{skillPage.topic}</h3>
                    <p className="mt-3 text-body-md text-on-surface-variant">{formatSkillPageDescription(skillPage)}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-[24px] border border-dashed border-outline-variant bg-surface-container-lowest p-6">
                <p className="text-label-sm uppercase tracking-[0.18em] text-primary">No matches</p>
                <h3 className="mt-3 text-xl font-semibold text-on-surface">No skill pages match the current filters.</h3>
                <p className="mt-3 text-body-md text-on-surface-variant">
                  Adjust the search or clear one of the active filters to widen the library again.
                </p>
              </div>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
};
