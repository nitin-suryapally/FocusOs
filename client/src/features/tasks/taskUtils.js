const INITIAL_TASK_FORM_VALUES = {
  title: "",
  topic: "",
  type: "general",
  priority: "medium",
  dueDate: "",
  resourceId: ""
};

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const parseTaskDueDate = (dueDate) => {
  if (!dueDate) {
    return null;
  }

  const parsedDate = new Date(dueDate);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const formatDueDate = (dueDate) => {
  const parsedDate = parseTaskDueDate(dueDate);

  if (!parsedDate) {
    return "No due date";
  }

  return parsedDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
};

const validateTaskForm = (values) => {
  const errors = {};

  if (!values.title.trim()) {
    errors.title = "Title is required.";
  }

  if (values.topic !== "" && !values.topic.trim()) {
    errors.topic = "Topic must be text.";
  }

  return errors;
};

const buildTaskPayload = (values) => ({
  title: values.title.trim(),
  topic: values.topic.trim(),
  type: values.type,
  priority: values.priority,
  dueDate: values.dueDate || null,
  resourceId: values.resourceId || null,
  completed: false
});

const createTaskFormValues = (values = INITIAL_TASK_FORM_VALUES) => ({
  title: values.title || "",
  topic: values.topic || "",
  type: values.type || "general",
  priority: values.priority || "medium",
  dueDate: values.dueDate ? values.dueDate.slice(0, 10) : "",
  resourceId: values.resource?.id || values.resourceId || ""
});

const groupTasks = (tasks) => {
  const today = startOfDay(new Date());
  const todayTasks = [];
  const upcomingTasks = [];
  const completedTasks = [];

  tasks.forEach((task) => {
    if (task.completed) {
      completedTasks.push(task);
      return;
    }

    const parsedDueDate = parseTaskDueDate(task.dueDate);
    const taskDueDay = parsedDueDate ? startOfDay(parsedDueDate) : null;

    if (taskDueDay && taskDueDay.getTime() === today.getTime()) {
      todayTasks.push(task);
      return;
    }

    upcomingTasks.push(task);
  });

  const sortByDueDate = (leftTask, rightTask) => {
    const leftDueDate = parseTaskDueDate(leftTask.dueDate);
    const rightDueDate = parseTaskDueDate(rightTask.dueDate);

    if (!leftDueDate && !rightDueDate) {
      return leftTask.title.localeCompare(rightTask.title);
    }

    if (!leftDueDate) {
      return 1;
    }

    if (!rightDueDate) {
      return -1;
    }

    return leftDueDate - rightDueDate;
  };

  todayTasks.sort(sortByDueDate);
  upcomingTasks.sort(sortByDueDate);
  completedTasks.sort((leftTask, rightTask) => leftTask.title.localeCompare(rightTask.title));

  return {
    todayTasks,
    upcomingTasks,
    completedTasks
  };
};

export {
  INITIAL_TASK_FORM_VALUES,
  buildTaskPayload,
  createTaskFormValues,
  formatDueDate,
  groupTasks,
  parseTaskDueDate,
  validateTaskForm
};
