const normalize = (value) => value.trim().toLowerCase();

const sortValues = (values) => Array.from(new Set(values.filter(Boolean))).sort((left, right) => left.localeCompare(right));

export const INITIAL_RESOURCE_LIBRARY_FILTERS = {
  search: "",
  status: "all",
  type: "all",
  topic: "all",
  tag: "all"
};

export const hasActiveResourceLibraryFilters = (filters) =>
  Object.entries(filters).some(([key, value]) => (key === "search" ? value.trim().length > 0 : value !== "all"));

export const buildResourceLibraryFilterOptions = (resources) => ({
  topics: sortValues(resources.map((resource) => resource.topic)),
  tags: sortValues(resources.flatMap((resource) => resource.tags || []))
});

export const filterResources = (resources, filters) => {
  const searchTerm = normalize(filters.search);

  return resources.filter((resource) => {
    const matchesSearch =
      searchTerm.length === 0 ||
      [resource.title, resource.topic, resource.notes || "", ...(resource.tags || [])]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm);

    const matchesStatus = filters.status === "all" || resource.status === filters.status;
    const matchesType = filters.type === "all" || resource.type === filters.type;
    const matchesTopic = filters.topic === "all" || resource.topic === filters.topic;
    const matchesTag = filters.tag === "all" || (resource.tags || []).some((tag) => normalize(tag) === normalize(filters.tag));

    return matchesSearch && matchesStatus && matchesType && matchesTopic && matchesTag;
  });
};
