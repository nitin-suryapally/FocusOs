const emptySummary = {
  tasks: { openCount: 0, dueTodayCount: 0, overdueCount: 0 },
  resources: { totalCount: 0, inProgressCount: 0 },
  streak: { currentStreak: 0, bestStreak: 0 },
  projectIdeas: { activeCount: 0 },
  jobApplications: { activeCount: 0, followUpDueCount: 0 }
};

export const normalizeDashboard = (dashboard = {}) => ({
  summary: {
    tasks: { ...emptySummary.tasks, ...dashboard.summary?.tasks },
    resources: { ...emptySummary.resources, ...dashboard.summary?.resources },
    streak: { ...emptySummary.streak, ...dashboard.summary?.streak },
    projectIdeas: { ...emptySummary.projectIdeas, ...dashboard.summary?.projectIdeas },
    jobApplications: { ...emptySummary.jobApplications, ...dashboard.summary?.jobApplications }
  },
  upcoming: Array.isArray(dashboard.upcoming) ? dashboard.upcoming : [],
  recentActivity: Array.isArray(dashboard.recentActivity) ? dashboard.recentActivity : []
});

export const isDashboardEmpty = (dashboard) => {
  const { tasks, resources, streak, projectIdeas, jobApplications } = dashboard.summary;
  return !tasks.openCount && !tasks.dueTodayCount && !tasks.overdueCount && !resources.totalCount && !resources.inProgressCount && !streak.currentStreak && !streak.bestStreak && !projectIdeas.activeCount && !jobApplications.activeCount && !jobApplications.followUpDueCount && !dashboard.upcoming.length && !dashboard.recentActivity.length;
};

export const formatDashboardDate = (value) => new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(value));
export const dashboardItemLabel = (kind) => kind === "jobApplicationFollowUp" ? "Application follow-up" : kind === "jobApplication" ? "Job application" : kind === "projectIdea" ? "Project idea" : kind === "resource" ? "Resource" : "Task";