import { formControlClassName } from "../../../components/FormField";

const formatLabel = (value) => value.charAt(0).toUpperCase() + value.slice(1);

export const TaskSelectField = ({ id, label, value, options, onChange }) => (
  <label className="block space-y-2" htmlFor={id}>
    <span className="text-label-md text-on-surface">{label}</span>
    <select id={id} name={id} value={value} onChange={onChange} className={formControlClassName}>
      {options.map((option) => <option key={option} value={option}>{formatLabel(option)}</option>)}
    </select>
  </label>
);
