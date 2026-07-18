import { formControlClassName } from "../../../components/FormField";
import { formatLabel } from "../resourceLibrary";

export const ResourceSelectField = ({ id, label, value, options, onChange }) => (
  <label className="block space-y-2" htmlFor={id}>
    <span className="text-label-md text-on-surface">{label}</span>
    <select id={id} name={id} value={value} onChange={onChange} className={formControlClassName}>
      {options.map((option) => (
        <option key={option} value={option}>
          {formatLabel(option)}
        </option>
      ))}
    </select>
  </label>
);
