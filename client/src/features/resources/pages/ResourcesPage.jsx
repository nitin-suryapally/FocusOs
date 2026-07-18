import { useEffect, useState } from "react";
import { useAuthToken } from "../../../store/useAuthStore";
import { createResourceRequest, fetchResourcesRequest } from "../api/resourcesApi";
import { ResourceFormModal } from "../components/ResourceCreateModal";
import { ResourceLibraryHeader } from "../components/ResourceLibraryHeader";
import { ResourceLibrarySummaryCards } from "../components/ResourceLibrarySummaryCards";
import { ResourceSkillPageList } from "../components/ResourceSkillPageList";
import { ResourcesEmptyState } from "../components/ResourcesEmptyState";
import { ResourcesErrorState } from "../components/ResourcesErrorState";
import { ResourcesLoadingState } from "../components/ResourcesLoadingState";
import { ResourceLibraryFilters } from "../components/ResourceLibraryFilters";
import { buildResourcePayload, createResourceFormValues, INITIAL_RESOURCE_FORM_VALUES, validateResourceForm } from "../resourceForm";
import {
  buildResourceLibraryFilterOptions,
  filterResources,
  hasActiveResourceLibraryFilters,
  INITIAL_RESOURCE_LIBRARY_FILTERS
} from "../resourceFilters";
import { buildSkillPages, formatTopicCount } from "../resourceLibrary";

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
      <ResourceLibraryHeader submitSuccess={submitSuccess} onCreateResource={openCreateModal} />

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

      {isLoading ? <ResourcesLoadingState /> : null}
      {!isLoading && error ? <ResourcesErrorState error={error} onRetry={loadResources} /> : null}
      {!isLoading && !error && resources.length === 0 ? <ResourcesEmptyState /> : null}

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
          <ResourceLibrarySummaryCards
            skillPageCount={skillPages.length}
            resourceCount={filteredResources.length}
            topicCount={topicCount}
          />
          <ResourceSkillPageList skillPages={skillPages} />
        </>
      ) : null}
    </div>
  );
};