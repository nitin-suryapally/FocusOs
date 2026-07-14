const parseTags = (value) =>
  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

export const INITIAL_RESOURCE_FORM_VALUES = {
  title: "",
  topic: "",
  type: "article",
  status: "saved",
  url: "",
  tags: "",
  notes: ""
};

export const createResourceFormValues = (resource) => {
  if (!resource) {
    return INITIAL_RESOURCE_FORM_VALUES;
  }

  return {
    title: resource.title || "",
    topic: resource.topic || "",
    type: resource.type || "article",
    status: resource.status || "saved",
    url: resource.url || "",
    tags: resource.tags?.join(", ") || "",
    notes: resource.notes || ""
  };
};

export const validateResourceForm = (values) => {
  const errors = {};

  if (!values.title.trim()) {
    errors.title = "Title is required.";
  }

  if (!values.topic.trim()) {
    errors.topic = "Topic is required.";
  }

  if (values.url.trim()) {
    try {
      new URL(values.url.trim());
    } catch {
      errors.url = "Enter a valid URL.";
    }
  }

  return errors;
};

export const buildResourcePayload = (values) => ({
  title: values.title.trim(),
  topic: values.topic.trim(),
  type: values.type,
  status: values.status,
  url: values.url.trim(),
  tags: parseTags(values.tags),
  notes: values.notes.trim()
});
