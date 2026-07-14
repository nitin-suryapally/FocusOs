const formatLabel = (value) => value.replace(/_/g, " ");

export const buildSkillPageId = (topic) =>
  topic
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const formatDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
};

export const formatTopicCount = (resources) => new Set(resources.map((resource) => resource.topic)).size;

export const buildSkillPages = (resources) => {
  const skillPages = [];
  const skillPagesByTopic = new Map();

  resources.forEach((resource) => {
    const topicKey = resource.topic.trim().toLowerCase();

    if (!skillPagesByTopic.has(topicKey)) {
      const nextSkillPage = {
        id: buildSkillPageId(resource.topic),
        topic: resource.topic,
        resources: []
      };

      skillPagesByTopic.set(topicKey, nextSkillPage);
      skillPages.push(nextSkillPage);
    }

    skillPagesByTopic.get(topicKey).resources.push(resource);
  });

  return skillPages;
};

export const formatSkillPageDescription = (skillPage) => {
  const typeCountMap = skillPage.resources.reduce((counts, resource) => {
    counts.set(resource.type, (counts.get(resource.type) || 0) + 1);
    return counts;
  }, new Map());

  const typeSummary = Array.from(typeCountMap.entries())
    .map(([type, count]) => `${count} ${formatLabel(type)}`)
    .join(" • ");

  return `${skillPage.resources.length} resource${skillPage.resources.length === 1 ? "" : "s"} across ${typeSummary || "mixed formats"}.`;
};

export const buildSkillPagePath = (skillPageId) => `/app/resources/${skillPageId}`;

export const buildSkillPagePathFromTopic = (topic) => buildSkillPagePath(buildSkillPageId(topic));

export const findSkillPageById = (resources, skillPageId) =>
  buildSkillPages(resources).find((skillPage) => skillPage.id === skillPageId);

export { formatLabel };
