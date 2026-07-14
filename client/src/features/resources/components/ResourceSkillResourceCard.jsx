import { formatDate, formatLabel } from "../resourceLibrary";

export const ResourceSkillResourceCard = ({ resource, onEdit, onDelete, isDeleting }) => {
  const updatedAt = formatDate(resource.updatedAt);
  const createdAt = formatDate(resource.createdAt);

  return (
    <article className="rounded-[24px] border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-card">
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
              <dd className="text-right text-on-surface">{resource.tags?.length ? resource.tags.join(", ") : "None"}</dd>
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
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onEdit(resource)}
              className="inline-flex items-center justify-center rounded-xl border border-outline-variant px-4 py-2 text-label-md text-on-surface transition hover:bg-surface-container-low"
            >
              Edit resource
            </button>
            <button
              type="button"
              onClick={() => onDelete(resource)}
              disabled={isDeleting}
              className="inline-flex items-center justify-center rounded-xl border border-rose-200 px-4 py-2 text-label-md text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isDeleting ? "Deleting..." : "Delete resource"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
