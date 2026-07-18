import { formControlClassName } from "../../../components/FormField";
import { JOB_APPLICATION_STATUS_OPTIONS, formatJobApplicationStatus } from "../jobApplicationOptions";

const SelectField = ({ id, label, value, options, onChange, formatOption = (option) => option }) => (
  <label className="block space-y-2" htmlFor={id}>
    <span className="text-label-md text-on-surface">{label}</span>
    <select id={id} name={id} value={value} onChange={onChange} className={formControlClassName}>
      {options.map((option) => <option key={option} value={option}>{formatOption(option)}</option>)}
    </select>
  </label>
);

export const JobApplicationsFilters = ({ filters, applicationCount, hasActiveFilters, onChange, onReset }) => (
  <section className="rounded-[28px] border border-outline-variant/70 bg-surface/82 p-6 shadow-card backdrop-blur-sm sm:p-8">
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-outline-variant/60 pb-5">
      <div>
        <p className="text-label-sm uppercase tracking-[0.18em] text-primary">Pipeline view</p>
        <h2 className="mt-2 text-2xl font-semibold text-on-surface">Filter and order applications</h2>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-body-sm text-on-surface-variant">{applicationCount} visible</p>
        {hasActiveFilters ? <button type="button" onClick={onReset} className="rounded-xl border border-outline-variant px-4 py-2 text-label-md text-on-surface">Clear filters</button> : null}
      </div>
    </div>
    <div className="mt-6 grid gap-5 md:grid-cols-3">
      <SelectField id="status" label="Status" value={filters.status} options={["all", ...JOB_APPLICATION_STATUS_OPTIONS]} onChange={onChange} formatOption={(option) => option === "all" ? "All statuses" : formatJobApplicationStatus(option)} />
      <SelectField id="followUp" label="Follow-up" value={filters.followUp} options={["all", "scheduled", "unscheduled"]} onChange={onChange} formatOption={(option) => option === "all" ? "All follow-ups" : option} />
      <SelectField id="sort" label="Sort by" value={filters.sort} options={["followUpSoonest", "company"]} onChange={onChange} formatOption={(option) => option === "followUpSoonest" ? "Follow-up soonest" : "Company"} />
    </div>
  </section>
);