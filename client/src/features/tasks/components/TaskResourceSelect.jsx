import { formControlClassName } from "../../../components/FormField";

export const TaskResourceSelect = ({ resources, value, onChange }) => (
  <label className="block space-y-2" htmlFor="resourceId">
    <span className="text-label-md text-on-surface">Linked resource</span>
    <select id="resourceId" name="resourceId" value={value} onChange={onChange} className={formControlClassName}>
      <option value="">No linked resource</option>
      {resources.map((resource) => <option key={resource.id} value={resource.id}>{resource.title} — {resource.topic}</option>)}
    </select>
  </label>
);