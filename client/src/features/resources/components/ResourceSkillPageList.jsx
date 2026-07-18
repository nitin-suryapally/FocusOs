import { Link } from "react-router-dom";
import { buildSkillPagePath, formatSkillPageDescription } from "../resourceLibrary";

export const ResourceSkillPageList = ({ skillPages }) => (
  <section className="rounded-[28px] border border-outline-variant/70 bg-surface/82 p-6 shadow-card backdrop-blur-sm sm:p-8">
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
);
