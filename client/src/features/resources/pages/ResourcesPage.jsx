import { useEffect, useState } from "react";
import { useAuthToken } from "../../../store/useAuthStore";
import { createResourceRequest, fetchResourcesRequest } from "../api/resourcesApi";
import { ResourceCreateModal } from "../components/ResourceCreateModal";

const INITIAL_FORM_VALUES = {
  title: "",
  topic: "",
  type: "article",
  status: "saved",
  url: "",
  tags: "",
  notes: ""
};

const formatDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
};

const formatLabel = (value) => value.replace(/_/g, " ");

const formatTopicCount = (resources) => new Set(resources.map((resource) => resource.topic)).size;

const parseTags = (value) =>
  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

const validateCreateForm = (values) => {
  const errors = {};

  if (!values.title.trim()) {
    errors.title = "Title is required.";
  }

  if (!values.topic.trim()) {
    errors.topic = "Topic is required.";
  }

  if (values.url.trim()) {
    try {
      new URL(values.url.trim());
    } catch {
      errors.url = "Enter a valid URL.";
    }
  }

  return errors;
};

export const ResourcesPage = () => {
  const token = useAuthToken();
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formValues, setFormValues] = useState(INITIAL_FORM_VALUES);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const topicCount = formatTopicCount(resources);

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

  const handleCreateResource = async (event) => {
    event.preventDefault();

    if (!token) {
      setSubmitError("Authentication required.");
      return;
    }

    const nextErrors = validateCreateForm(formValues);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    const payload = {
      title: formValues.title.trim(),
      topic: formValues.topic.trim(),
      type: formValues.type,
      status: formValues.status,
      url: formValues.url.trim(),
      tags: parseTags(formValues.tags),
      notes: formValues.notes.trim()
    };

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
      setFormValues(INITIAL_FORM_VALUES);
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
        <p className="text-label-sm uppercase tracking-[0.2em] text-primary">Resources</p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-on-surface sm:text-4xl">
              Keep learning material close to the work it supports.
            </h1>
            <p className="mt-4 text-body-lg text-on-surface-variant">
              This screen now covers the first working resources workflow: loading the saved library, creating new
              entries, and keeping the protected backend list visible in one place.
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
              Save a new article, course, video, or reference without leaving the list.
            </p>
          </div>
        </div>

        {submitSuccess ? (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-body-sm text-emerald-700">
            {submitSuccess}
          </div>
        ) : null}
      </section>

      <ResourceCreateModal
        isOpen={isCreateModalOpen}
        values={formValues}
        fieldErrors={fieldErrors}
        submitError={submitError}
        isSubmitting={isSubmitting}
        onChange={updateField}
        onClose={closeCreateModal}
        onSubmit={handleCreateResource}
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
          <section className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-[24px] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-card">
              <p className="text-label-sm uppercase tracking-[0.18em] text-on-surface-variant">Saved</p>
              <p className="mt-3 text-4xl font-semibold text-on-surface">{resources.length}</p>
              <p className="mt-3 text-body-sm text-on-surface-variant">Resources available in the protected backend list.</p>
            </div>
            <div className="rounded-[24px] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-card">
              <p className="text-label-sm uppercase tracking-[0.18em] text-on-surface-variant">Topics</p>
              <p className="mt-3 text-4xl font-semibold text-on-surface">{topicCount}</p>
              <p className="mt-3 text-body-sm text-on-surface-variant">Distinct learning areas represented in the current library.</p>
            </div>
            <div className="rounded-[24px] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-card">
              <p className="text-label-sm uppercase tracking-[0.18em] text-on-surface-variant">Latest</p>
              <p className="mt-3 text-xl font-semibold text-on-surface">{resources[0].title}</p>
              <p className="mt-3 text-body-sm text-on-surface-variant">Most recently added resource in the current session view.</p>
            </div>
          </section>

          <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-card backdrop-blur-sm sm:p-8">
            <div className="flex flex-col gap-3 border-b border-outline-variant/60 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-label-sm uppercase tracking-[0.18em] text-primary">Resource list</p>
                <h2 className="mt-2 text-2xl font-semibold text-on-surface">Saved materials from the backend</h2>
              </div>
              <p className="text-body-sm text-on-surface-variant">Newest updates appear first.</p>
            </div>

            <div className="mt-6 space-y-4">
              {resources.map((resource) => {
                const updatedAt = formatDate(resource.updatedAt);
                const createdAt = formatDate(resource.createdAt);

                return (
                  <article
                    key={resource.id}
                    className="rounded-[24px] border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-card"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-label-sm uppercase tracking-[0.16em] text-primary">
                            {formatLabel(resource.type)}
                          </span>
                          <span className="rounded-full bg-surface-container-high px-3 py-1 text-label-sm uppercase tracking-[0.16em] text-on-surface-variant">
                            {formatLabel(resource.status)}
                          </span>
                        </div>
                        <h3 className="mt-4 text-xl font-semibold text-on-surface">{resource.title}</h3>
                        <p className="mt-2 text-body-md text-on-surface-variant">Topic: {resource.topic}</p>
                        {resource.notes ? <p className="mt-3 text-body-md text-on-surface-variant">{resource.notes}</p> : null}
                      </div>

                      <div className="w-full max-w-sm rounded-[20px] border border-outline-variant/50 bg-white/70 p-4">
                        <dl className="grid gap-3 text-body-sm text-on-surface-variant">
                          <div className="flex items-center justify-between gap-4">
                            <dt>Updated</dt>
                            <dd className="text-right text-on-surface">{updatedAt || "Unknown"}</dd>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <dt>Created</dt>
                            <dd className="text-right text-on-surface">{createdAt || "Unknown"}</dd>
                          </div>
                          <div className="flex items-start justify-between gap-4">
                            <dt>Tags</dt>
                            <dd className="text-right text-on-surface">
                              {resource.tags?.length ? resource.tags.join(", ") : "None"}
                            </dd>
                          </div>
                        </dl>
                        {resource.url ? (
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-flex text-label-md text-primary transition hover:opacity-80"
                          >
                            Open resource
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
};
