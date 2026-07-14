import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthToken } from "../../../store/useAuthStore";
import { deleteResourceRequest, fetchResourcesRequest, updateResourceRequest } from "../api/resourcesApi";
import { ResourceFormModal } from "../components/ResourceCreateModal";
import { ResourceSkillResourceCard } from "../components/ResourceSkillResourceCard";
import { buildResourcePayload, createResourceFormValues, validateResourceForm } from "../resourceForm";
import {
  buildSkillPagePathFromTopic,
  buildSkillPages,
  findSkillPageById,
  formatSkillPageDescription
} from "../resourceLibrary";

export const ResourceSkillPage = () => {
  const { skillPageId } = useParams();
  const navigate = useNavigate();
  const token = useAuthToken();
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingResource, setEditingResource] = useState(null);
  const [formValues, setFormValues] = useState(createResourceFormValues());
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

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
  }, [token, skillPageId]);

  const skillPages = buildSkillPages(resources);
  const skillPage = findSkillPageById(resources, skillPageId);

  const closeEditModal = () => {
    if (isSubmitting) {
      return;
    }

    setEditingResource(null);
    setFieldErrors({});
    setSubmitError(null);
  };

  const openEditModal = (resource) => {
    setEditingResource(resource);
    setFormValues(createResourceFormValues(resource));
    setFieldErrors({});
    setSubmitError(null);
    setActionMessage(null);
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
  };

  const handleEditResource = async (event) => {
    event.preventDefault();

    if (!token || !editingResource) {
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
    setActionMessage(null);
    setIsSubmitting(true);

    try {
      const result = await updateResourceRequest(token, editingResource.id, payload);
      const updatedResource = result.resource;
      const nextResources = resources.map((resource) =>
        resource.id === updatedResource.id ? updatedResource : resource
      );
      const nextPath = buildSkillPagePathFromTopic(updatedResource.topic);

      setResources(nextResources);
      setEditingResource(null);
      setActionMessage(result.message || "Resource updated.");

      if (nextPath !== `/app/resources/${skillPageId}`) {
        navigate(nextPath);
      }
    } catch (requestError) {
      setSubmitError(requestError.message || "Unable to update resource.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteResource = async (resource) => {
    if (!token) {
      setError("Authentication required.");
      return;
    }

    if (!window.confirm(`Delete ${resource.title}?`)) {
      return;
    }

    setPendingDeleteId(resource.id);
    setActionMessage(null);
    setError(null);

    try {
      const result = await deleteResourceRequest(token, resource.id);
      const nextResources = resources.filter((currentResource) => currentResource.id !== resource.id);

      setResources(nextResources);
      setActionMessage(result.message || "Resource deleted.");

      if (!findSkillPageById(nextResources, skillPageId)) {
        navigate("/app/resources");
      }
    } catch (requestError) {
      setError(requestError.message || "Unable to delete resource.");
    } finally {
      setPendingDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <section aria-label="Skill resources loading state" className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-[24px] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-card"
          >
            <div className="h-3 w-24 rounded-full bg-surface-container-high" />
            <div className="mt-4 h-8 w-40 rounded-full bg-surface-container-high" />
            <div className="mt-4 h-4 w-full rounded-full bg-surface-container-high" />
            <div className="mt-2 h-4 w-4/5 rounded-full bg-surface-container-high" />
          </div>
        ))}
      </section>
    );
  }

  if (error && !skillPage) {
    return (
      <section className="rounded-[28px] border border-rose-200 bg-white/85 p-6 shadow-card backdrop-blur-sm sm:p-8">
        <p className="text-label-sm uppercase tracking-[0.18em] text-rose-600">Could not load skill resources</p>
        <h1 className="mt-3 text-2xl font-semibold text-on-surface">This skill page is unavailable right now.</h1>
        <p className="mt-3 max-w-2xl text-body-md text-on-surface-variant">{error}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={loadResources}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-label-md text-on-primary transition hover:opacity-90"
          >
            Retry
          </button>
          <Link
            to="/app/resources"
            className="inline-flex items-center justify-center rounded-xl border border-outline-variant px-4 py-3 text-label-md text-on-surface transition hover:bg-surface-container-low"
          >
            Back to library
          </Link>
        </div>
      </section>
    );
  }

  if (!skillPage) {
    return (
      <section className="rounded-[28px] border border-dashed border-outline-variant bg-white/75 p-6 shadow-card backdrop-blur-sm sm:p-8">
        <p className="text-label-sm uppercase tracking-[0.18em] text-primary">Skill page not found</p>
        <h1 className="mt-3 text-2xl font-semibold text-on-surface">This resource page does not exist yet.</h1>
        <p className="mt-3 max-w-2xl text-body-md text-on-surface-variant">
          Return to the library and open one of the available skill pages.
        </p>
        <Link
          to="/app/resources"
          className="mt-5 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-label-md text-on-primary transition hover:opacity-90"
        >
          Back to library
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-card backdrop-blur-sm sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-label-sm uppercase tracking-[0.2em] text-primary">Skill resources</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-on-surface sm:text-4xl">{skillPage.topic}</h1>
            <p className="mt-4 text-body-lg text-on-surface-variant">{formatSkillPageDescription(skillPage)}</p>
          </div>
          <Link
            to="/app/resources"
            className="inline-flex items-center justify-center rounded-xl border border-outline-variant px-4 py-3 text-label-md text-on-surface transition hover:bg-surface-container-low"
          >
            Back to library
          </Link>
        </div>

        {actionMessage ? (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-body-sm text-emerald-700">
            {actionMessage}
          </div>
        ) : null}
      </section>

      <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-card backdrop-blur-sm sm:p-8">
        <div className="flex flex-col gap-3 border-b border-outline-variant/60 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-label-sm uppercase tracking-[0.18em] text-primary">Resources</p>
            <h2 className="mt-2 text-2xl font-semibold text-on-surface">Saved materials for this skill</h2>
          </div>
          <p className="text-body-sm text-on-surface-variant">{skillPages.length} total skill pages currently exist in the library.</p>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-body-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="mt-6 space-y-4">
          {skillPage.resources.map((resource) => (
            <ResourceSkillResourceCard
              key={resource.id}
              resource={resource}
              onEdit={openEditModal}
              onDelete={handleDeleteResource}
              isDeleting={pendingDeleteId === resource.id}
            />
          ))}
        </div>
      </section>

      <ResourceFormModal
        isOpen={Boolean(editingResource)}
        values={formValues}
        fieldErrors={fieldErrors}
        submitError={submitError}
        isSubmitting={isSubmitting}
        onChange={updateField}
        onClose={closeEditModal}
        onSubmit={handleEditResource}
        eyebrow="Edit resource"
        title="Update this resource"
        description="Keep the saved resource current without leaving the skill page."
        submitLabel="Update resource"
        overlayTestId="resource-edit-overlay"
      />
    </div>
  );
};
