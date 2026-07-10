export const FormField = ({ id, label, type = "text", value, onChange, placeholder, autoComplete, error }) => {
  return (
    <label className="block space-y-2" htmlFor={id}>
      <span className="text-label-md text-on-surface">{label}</span>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
      />
      {error ? (
        <span id={`${id}-error`} className="block text-body-sm text-error">
          {error}
        </span>
      ) : null}
    </label>
  );
};
