export const INITIAL_JOB_APPLICATION_FILTERS = { status: "all", followUp: "all", sort: "followUpSoonest" };

export const hasActiveJobApplicationFilters = (filters) => filters.status !== "all" || filters.followUp !== "all";

const followUpTimestamp = (application) => {
  if (!application.followUpDate) return Number.POSITIVE_INFINITY;

  const timestamp = new Date(application.followUpDate).getTime();
  return Number.isNaN(timestamp) ? Number.POSITIVE_INFINITY : timestamp;
};

export const filterAndSortJobApplications = (applications, filters) => applications
  .filter((application) => (filters.status === "all" || application.status === filters.status) && (filters.followUp === "all" || (filters.followUp === "scheduled" ? Boolean(application.followUpDate) : !application.followUpDate)))
  .sort((left, right) => {
    if (filters.sort === "company") return left.company.localeCompare(right.company);

    const followUpDifference = followUpTimestamp(left) - followUpTimestamp(right);
    return followUpDifference || left.company.localeCompare(right.company);
  });