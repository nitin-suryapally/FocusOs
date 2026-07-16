import { useEffect, useState } from "react";
import { useAuthToken } from "../../../store/useAuthStore";
import { createTaskRequest, fetchTasksRequest, updateTaskRequest } from "../api/tasksApi";
import { TaskCreateModal } from "../components/TaskCreateModal";
import { TaskGroupSection } from "../components/TaskGroupSection";
import { TaskSummaryCards } from "../components/TaskSummaryCards";
import { TasksEmptyState } from "../components/TasksEmptyState";
import { TasksErrorState } from "../components/TasksErrorState";
import { TasksLoadingState } from "../components/TasksLoadingState";
import { TasksPageHeader } from "../components/TasksPageHeader";
import {
  INITIAL_TASK_FORM_VALUES,
  buildTaskPayload,
  createTaskFormValues,
  groupTasks,
  validateTaskForm
} from "../taskUtils";

export const TasksPage = () => {
  const token = useAuthToken();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formValues, setFormValues] = useState(INITIAL_TASK_FORM_VALUES);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskActionError, setTaskActionError] = useState(null);
  const [togglingTaskIds, setTogglingTaskIds] = useState(new Set());

  const loadTasks = async () => {
    if (!token) {
      setTasks([]);
      setIsLoading(false);
      setError("Authentication required.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchTasksRequest(token);
      setTasks(result.tasks || []);
    } catch (requestError) {
      setError(requestError.message || "Unable to load tasks.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [token]);

  const openCreateModal = () => {
    setFieldErrors({});
    setSubmitError(null);
    setTaskActionError(null);
    setFormValues(createTaskFormValues());
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    if (isSubmitting) {
      return;
    }

    setIsCreateModalOpen(false);
    setFieldErrors({});
    setSubmitError(null);
  };

  const updateField = (event) => {
    const { name, value } = event.target;

    setFormValues((current) => ({ ...current, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((current) => ({ ...current, [name]: undefined }));
    }

    if (submitError) {
      setSubmitError(null);
    }

    if (submitSuccess) {
      setSubmitSuccess(null);
    }
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();

    if (!token) {
      setSubmitError("Authentication required.");
      return;
    }

    const nextErrors = validateTaskForm(formValues);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    const payload = buildTaskPayload(formValues);

    setFieldErrors({});
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(true);

    try {
      const result = await createTaskRequest(token, payload);
      const createdTask = result.task;

      setTasks((current) => [createdTask, ...current]);
      setError(null);
      setIsLoading(false);
      setFormValues(INITIAL_TASK_FORM_VALUES);
      setSubmitSuccess(result.message || "Task created.");
      setIsCreateModalOpen(false);
    } catch (requestError) {
      setSubmitError(requestError.message || "Unable to create task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTaskCompletion = async (task) => {
    if (!token) {
      setTaskActionError("Authentication required.");
      return;
    }

    const nextCompleted = !task.completed;
    const previousTaskSnapshot = { ...task };

    setTaskActionError(null);
    setSubmitSuccess(null);
    setTogglingTaskIds((current) => {
      const next = new Set(current);
      next.add(task.id);
      return next;
    });
    setTasks((current) =>
      current.map((currentTask) =>
        currentTask.id === task.id ? { ...currentTask, completed: nextCompleted } : currentTask
      )
    );

    try {
      const result = await updateTaskRequest(token, task.id, { completed: nextCompleted });

      setTasks((current) =>
        current.map((currentTask) => (currentTask.id === task.id ? { ...currentTask, ...result.task } : currentTask))
      );
    } catch (requestError) {
      setTasks((current) =>
        current.map((currentTask) => (currentTask.id === task.id ? previousTaskSnapshot : currentTask))
      );
      setTaskActionError(requestError.message || "Unable to update task.");
    } finally {
      setTogglingTaskIds((current) => {
        const next = new Set(current);
        next.delete(task.id);
        return next;
      });
    }
  };

  const completedCount = tasks.filter((task) => task.completed).length;
  const openCount = tasks.length - completedCount;
  const { todayTasks, upcomingTasks, completedTasks } = groupTasks(tasks);

  return (
    <div className="space-y-6">
      <TasksPageHeader
        submitSuccess={submitSuccess}
        taskActionError={taskActionError}
        onCreateTask={openCreateModal}
      />

      <TaskCreateModal
        isOpen={isCreateModalOpen}
        values={formValues}
        fieldErrors={fieldErrors}
        submitError={submitError}
        isSubmitting={isSubmitting}
        onChange={updateField}
        onClose={closeCreateModal}
        onSubmit={handleCreateTask}
        submitLabel="Save task"
        overlayTestId="task-create-overlay"
      />

      {isLoading ? <TasksLoadingState /> : null}

      {!isLoading && error ? <TasksErrorState error={error} onRetry={loadTasks} /> : null}

      {!isLoading && !error && tasks.length === 0 ? <TasksEmptyState /> : null}

      {!isLoading && !error && tasks.length > 0 ? (
        <>
          <TaskSummaryCards totalCount={tasks.length} openCount={openCount} completedCount={completedCount} />

          <TaskGroupSection
            title="Today"
            description="Open tasks due today so the immediate queue is visible first."
            tasks={todayTasks}
            emptyMessage="No open tasks are due today."
            togglingTaskIds={togglingTaskIds}
            onToggleComplete={handleToggleTaskCompletion}
          />

          <TaskGroupSection
            title="Upcoming"
            description="Open tasks that can be planned next, including items without a due date."
            tasks={upcomingTasks}
            emptyMessage="No upcoming open tasks are waiting in the queue."
            togglingTaskIds={togglingTaskIds}
            onToggleComplete={handleToggleTaskCompletion}
          />

          <TaskGroupSection
            title="Completed"
            description="Finished tasks stay visible here while edit and delete actions wait for a later slice."
            tasks={completedTasks}
            emptyMessage="No tasks have been completed yet."
            togglingTaskIds={togglingTaskIds}
            onToggleComplete={handleToggleTaskCompletion}
          />
        </>
      ) : null}
    </div>
  );
};
