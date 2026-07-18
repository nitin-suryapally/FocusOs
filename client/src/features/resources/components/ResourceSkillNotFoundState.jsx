import { Link } from "react-router-dom";

export const ResourceSkillNotFoundState = () => (
  <section className="rounded-[28px] border border-dashed border-outline-variant bg-surface/82 p-6 shadow-card backdrop-blur-sm sm:p-8">
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
