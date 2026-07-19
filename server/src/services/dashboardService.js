import { JobApplication } from "../models/JobApplication.js";
import { ProjectIdea } from "../models/ProjectIdea.js";
import { Resource } from "../models/Resource.js";
import { Task } from "../models/Task.js";
import { getUserStreakSummary } from "./streakService.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const ACTIVE_APPLICATION_STATUSES = ["saved", "applied", "interviewing", "offer"];

const utcDayStart = (date) => Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
const recordId = (record) => (record._id || record.id).toString();
const dateValue = (value) => new Date(value).getTime();
const isoDate = (value) => new Date(value).toISOString();
const compareByDate = (field, direction) => (left, right) => {
  const dateDifference = direction * (dateValue(left[field]) - dateValue(right[field]));
  if (dateDifference) return dateDifference;
  const kindDifference = left.kind.localeCompare(right.kind);
  return kindDifference || left.id.localeCompare(right.id);
};

const findUserRecords = (model, userId, fields) => model.find({ user: userId }).select(fields).lean();

export const getDashboard = async (userId, now = new Date()) => {
  const [tasks, resources, ideas, applications, streak] = await Promise.all([
    findUserRecords(Task, userId, "title priority dueDate completed updatedAt"),
    findUserRecords(Resource, userId, "title status updatedAt"),
    findUserRecords(ProjectIdea, userId, "title status updatedAt"),
    findUserRecords(JobApplication, userId, "company role status followUpDate updatedAt"),
    getUserStreakSummary(userId, now)
  ]);

  const dayStart = utcDayStart(now);
  const nextDayStart = dayStart + DAY_MS;
  const activeApplications = applications.filter((application) => ACTIVE_APPLICATION_STATUSES.includes(application.status));
  const incompleteTasks = tasks.filter((task) => !task.completed);
  const hasDateOnOrBeforeToday = (value) => value && dateValue(value) < nextDayStart;

  const upcoming = [
    ...incompleteTasks
      .filter((task) => task.dueDate && dateValue(task.dueDate) >= nextDayStart)
      .map((task) => ({ kind: "task", id: recordId(task), title: task.title, date: isoDate(task.dueDate), priority: task.priority })),
    ...activeApplications
      .filter((application) => application.followUpDate && dateValue(application.followUpDate) >= nextDayStart)
      .map((application) => ({ kind: "jobApplicationFollowUp", id: recordId(application), title: `${application.company} - ${application.role}`, date: isoDate(application.followUpDate), status: application.status }))
  ].sort(compareByDate("date", 1)).slice(0, 10);

  const recentActivity = [
    ...tasks.map((task) => ({ kind: "task", id: recordId(task), title: task.title, updatedAt: isoDate(task.updatedAt) })),
    ...resources.map((resource) => ({ kind: "resource", id: recordId(resource), title: resource.title, updatedAt: isoDate(resource.updatedAt) })),
    ...ideas.map((idea) => ({ kind: "projectIdea", id: recordId(idea), title: idea.title, updatedAt: isoDate(idea.updatedAt) })),
    ...applications.map((application) => ({ kind: "jobApplication", id: recordId(application), title: `${application.company} - ${application.role}`, updatedAt: isoDate(application.updatedAt) }))
  ].sort(compareByDate("updatedAt", -1)).slice(0, 10);

  return {
    summary: {
      tasks: {
        openCount: incompleteTasks.length,
        dueTodayCount: incompleteTasks.filter((task) => task.dueDate && dateValue(task.dueDate) >= dayStart && dateValue(task.dueDate) < nextDayStart).length,
        overdueCount: incompleteTasks.filter((task) => task.dueDate && dateValue(task.dueDate) < dayStart).length
      },
      resources: { totalCount: resources.length, inProgressCount: resources.filter((resource) => resource.status === "in_progress").length },
      streak,
      projectIdeas: { activeCount: ideas.filter((idea) => !["completed", "archived"].includes(idea.status)).length },
      jobApplications: { activeCount: activeApplications.length, followUpDueCount: activeApplications.filter((application) => hasDateOnOrBeforeToday(application.followUpDate)).length }
    },
    upcoming,
    recentActivity
  };
};