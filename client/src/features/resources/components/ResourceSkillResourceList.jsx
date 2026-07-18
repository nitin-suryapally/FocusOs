import { ResourceSkillResourceCard } from "./ResourceSkillResourceCard";

export const ResourceSkillResourceList = ({ skillPage, skillPageCount, error, pendingDeleteId, onEdit, onDelete }) => (
  <section className="rounded-[28px] border border-outline-variant/70 bg-surface/82 p-6 shadow-card backdrop-blur-sm sm:p-8">
    <div className="flex flex-col gap-3 border-b border-outline-variant/60 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-label-sm uppercase tracking-[0.18em] text-primary">Resources</p>
        <h2 className="mt-2 text-2xl font-semibold text-on-surface">Saved materials for this skill</h2>
      </div>
      <p className="text-body-sm text-on-surface-variant">{skillPageCount} total skill pages currently exist in the library.</p>
    </div>

    {error ? (
      <div className="mt-6 rounded-2xl border border-error/20 bg-error-container/35 px-4 py-3 text-body-sm text-on-error-container">
        {error}
      </div>
    ) : null}

    <div className="mt-6 space-y-4">
      {skillPage.resources.map((resource) => (
        <ResourceSkillResourceCard
          key={resource.id}
          resource={resource}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={pendingDeleteId === resource.id}
        />
      ))}
    </div>
  </section>
);
