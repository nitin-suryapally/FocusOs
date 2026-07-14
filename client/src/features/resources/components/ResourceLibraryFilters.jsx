import { FormField } from "../../../components/FormField";
import { formatLabel } from "../resourceLibrary";
import { RESOURCE_STATUS_OPTIONS, RESOURCE_TYPE_OPTIONS } from "../resourceOptions";

const FilterSelect = ({ id, label, value, options, onChange, formatOptionLabel = formatLabel }) => (
  <label className="block space-y-2" htmlFor={id}>
    <span className="text-label-md text-on-surface">{label}</span>
    <select
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
    >
      <option value="all">All</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {formatOptionLabel(option)}
        </option>
      ))}
    </select>
  </label>
);

export const ResourceLibraryFilters = ({ filters, options, resultSummary, hasActiveFilters, onChange, onReset }) => (
  <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-card backdrop-blur-sm sm:p-8">
    <div className="flex flex-col gap-3 border-b border-outline-variant/60 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-label-sm uppercase tracking-[0.18em] text-primary">Find skill pages</p>
        <h2 className="mt-2 text-2xl font-semibold text-on-surface">Search and filter the library</h2>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-body-sm text-on-surface-variant">{resultSummary}</p>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center rounded-xl border border-outline-variant px-4 py-2 text-label-md text-on-surface transition hover:bg-surface-container-low"
          >
            Clear filters
          </button>
        ) : null}
      </div>
    </div>

    <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-5">
      <FormField
        id="search"
        label="Search"
        value={filters.search}
        onChange={onChange}
        placeholder="Search topic, title, notes, or tags"
      />
      <FilterSelect id="status" label="Status" value={filters.status} options={RESOURCE_STATUS_OPTIONS} onChange={onChange} />
      <FilterSelect id="type" label="Type" value={filters.type} options={RESOURCE_TYPE_OPTIONS} onChange={onChange} />
      <FilterSelect id="topic" label="Topic" value={filters.topic} options={options.topics} onChange={onChange} formatOptionLabel={(option) => option} />
      <FilterSelect id="tag" label="Tag" value={filters.tag} options={options.tags} onChange={onChange} formatOptionLabel={(option) => option} />
    </div>
  </section>
);
