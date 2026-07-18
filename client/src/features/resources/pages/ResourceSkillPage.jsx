import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ConfirmActionModal } from "../../../components/ConfirmActionModal";
import { useAuthToken } from "../../../store/useAuthStore";
import { deleteResourceRequest, fetchResourcesRequest, updateResourceRequest } from "../api/resourcesApi";
import { ResourceFormModal } from "../components/ResourceCreateModal";
import { ResourceSkillLoadingState } from "../components/ResourceSkillLoadingState";
import { ResourceSkillNotFoundState } from "../components/ResourceSkillNotFoundState";
import { ResourceSkillResourceList } from "../components/ResourceSkillResourceList";
import { ResourceSkillUnavailableState } from "../components/ResourceSkillUnavailableState";
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
  const [resourceToDelete, setResourceToDelete] = useState(null);

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

  const requestDeleteResource = (resource) => setResourceToDelete(resource);

  const handleDeleteResource = async () => {
    const resource = resourceToDelete;
    if (!token) {
      setError("Authentication required.");
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
      setResourceToDelete(null);
    }
  };

  if (isLoading) {
    return <ResourceSkillLoadingState />;
  }

  if (error && !skillPage) {
    return <ResourceSkillUnavailableState error={error} onRetry={loadResources} />;
  }

  if (!skillPage) {
    return <ResourceSkillNotFoundState />;
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

      <ResourceSkillResourceList
        skillPage={skillPage}
        skillPageCount={skillPages.length}
        error={error}
        pendingDeleteId={pendingDeleteId}
        onEdit={openEditModal}
        onDelete={requestDeleteResource}
      />

      <ConfirmActionModal isOpen={Boolean(resourceToDelete)} title="Delete resource?" description={`Delete ${resourceToDelete?.title || "this resource"}? Linked tasks will remain but no longer reference it.`} confirmLabel="Delete resource" isConfirming={Boolean(pendingDeleteId)} onCancel={() => setResourceToDelete(null)} onConfirm={handleDeleteResource} testId="resource-delete-confirmation" />

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
