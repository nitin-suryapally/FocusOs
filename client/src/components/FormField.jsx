export const formControlClassName =
  "w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface outline-none transition placeholder:text-on-surface-variant/70 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20";

export const formTextAreaClassName = `${formControlClassName} min-h-[120px] resize-y`;

export const FormField = ({ id, label, type = "text", value, onChange, placeholder, autoComplete, error }) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-label-md text-on-surface">{label}</label>
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
        className={formControlClassName}
      />
      {error ? (
        <span id={`${id}-error`} role="alert" className="block text-body-sm text-error">
          {error}
        </span>
      ) : null}
    </div>
  );
};