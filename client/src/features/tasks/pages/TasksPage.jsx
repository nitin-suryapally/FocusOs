import { useEffect, useState } from "react";
import { ConfirmActionModal } from "../../../components/ConfirmActionModal";
import { useAuthToken } from "../../../store/useAuthStore";
import { fetchResourcesRequest } from "../../resources/api/resourcesApi";
import { createTaskRequest, deleteTaskRequest, fetchTasksRequest, updateTaskRequest } from "../api/tasksApi";
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
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formValues, setFormValues] = useState(INITIAL_TASK_FORM_VALUES);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskActionError, setTaskActionError] = useState(null);
  const [togglingTaskIds, setTogglingTaskIds] = useState(new Set());
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

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

  useEffect(() => {
    if (!token) {
      setResources([]);
      return;
    }

    fetchResourcesRequest(token)
      .then((result) => setResources(result.resources || []))
      .catch(() => setResources([]));
  }, [token]);

  const resetForm = () => {
    setFieldErrors({});
    setSubmitError(null);
  };

  const openCreateModal = () => {
    resetForm();
    setTaskActionError(null);
    setEditingTask(null);
    setFormValues(createTaskFormValues());
    setIsCreateModalOpen(true);
  };

  const closeTaskModal = () => {
    if (isSubmitting) {
      return;
    }

    setIsCreateModalOpen(false);
    setEditingTask(null);
    resetForm();
  };

  const openEditModal = (task) => {
    resetForm();
    setTaskActionError(null);
    setSubmitSuccess(null);
    setEditingTask(task);
    setFormValues(createTaskFormValues(task));
    setIsCreateModalOpen(true);
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

    setFieldErrors({});
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(true);

    try {
      const result = await createTaskRequest(token, buildTaskPayload(formValues));

      setTasks((current) => [result.task, ...current]);
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

  const handleEditTask = async (event) => {
    event.preventDefault();

    if (!token || !editingTask) {
      setSubmitError("Authentication required.");
      return;
    }

    const nextErrors = validateTaskForm(formValues);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(true);

    try {
      const result = await updateTaskRequest(token, editingTask.id, {
        ...buildTaskPayload(formValues),
        completed: editingTask.completed
      });

      setTasks((current) => current.map((task) => (task.id === result.task.id ? result.task : task)));
      setEditingTask(null);
      setIsCreateModalOpen(false);
      setSubmitSuccess(result.message || "Task updated.");
    } catch (requestError) {
      setSubmitError(requestError.message || "Unable to update task.");
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
    setTogglingTaskIds((current) => new Set(current).add(task.id));
    setTasks((current) => current.map((currentTask) => (
      currentTask.id === task.id ? { ...currentTask, completed: nextCompleted } : currentTask
    )));

    try {
      const result = await updateTaskRequest(token, task.id, { completed: nextCompleted });
      setTasks((current) => current.map((currentTask) => (
        currentTask.id === task.id ? { ...currentTask, ...result.task } : currentTask
      )));
    } catch (requestError) {
      setTasks((current) => current.map((currentTask) => (
        currentTask.id === task.id ? previousTaskSnapshot : currentTask
      )));
      setTaskActionError(requestError.message || "Unable to update task.");
    } finally {
      setTogglingTaskIds((current) => {
        const next = new Set(current);
        next.delete(task.id);
        return next;
      });
    }
  };

  const requestDeleteTask = (task) => setTaskToDelete(task);

  const handleDeleteTask = async () => {
    const task = taskToDelete;
    if (!token) {
      setTaskActionError("Authentication required.");
      return;
    }


    setPendingDeleteId(task.id);
    setTaskActionError(null);
    setSubmitSuccess(null);

    try {
      const result = await deleteTaskRequest(token, task.id);
      setTasks((current) => current.filter((currentTask) => currentTask.id !== task.id));
      setSubmitSuccess(result.message || "Task deleted.");
    } catch (requestError) {
      setTaskActionError(requestError.message || "Unable to delete task.");
    } finally {
      setPendingDeleteId(null);
    }
  };

  const completedCount = tasks.filter((task) => task.completed).length;
  const openCount = tasks.length - completedCount;
  const { todayTasks, upcomingTasks, completedTasks } = groupTasks(tasks);
  const modalIsEditing = Boolean(editingTask);

  const taskGroupProps = {
    togglingTaskIds,
    pendingDeleteId,
    onToggleComplete: handleToggleTaskCompletion,
    onEdit: openEditModal,
    onDelete: requestDeleteTask
  };

  return (
    <div className="space-y-6">
      <TasksPageHeader submitSuccess={submitSuccess} taskActionError={taskActionError} onCreateTask={openCreateModal} />

      <TaskCreateModal
        isOpen={isCreateModalOpen}
        values={formValues}
        resources={resources}
        fieldErrors={fieldErrors}
        submitError={submitError}
        isSubmitting={isSubmitting}
        onChange={updateField}
        onClose={closeTaskModal}
        onSubmit={modalIsEditing ? handleEditTask : handleCreateTask}
        eyebrow={modalIsEditing ? "Edit task" : "Add task"}
        title={modalIsEditing ? "Keep this task current" : "Capture the next task before it slips away"}
        description={modalIsEditing ? "Update the task details without leaving the grouped workspace." : "Required fields match the current backend validation rules."}
        submitLabel={modalIsEditing ? "Update task" : "Save task"}
        overlayTestId={modalIsEditing ? "task-edit-overlay" : "task-create-overlay"}
      />

      <ConfirmActionModal isOpen={Boolean(taskToDelete)} title="Delete task?" description={`Delete ${taskToDelete?.title || "this task"}? This cannot be undone.`} confirmLabel="Delete task" isConfirming={Boolean(pendingDeleteId)} onCancel={() => setTaskToDelete(null)} onConfirm={handleDeleteTask} testId="task-delete-confirmation" />

      {isLoading ? <TasksLoadingState /> : null}
      {!isLoading && error ? <TasksErrorState error={error} onRetry={loadTasks} /> : null}
      {!isLoading && !error && tasks.length === 0 ? <TasksEmptyState /> : null}

      {!isLoading && !error && tasks.length > 0 ? (
        <>
          <TaskSummaryCards totalCount={tasks.length} openCount={openCount} completedCount={completedCount} />
          <TaskGroupSection title="Today" description="Open tasks due today so the immediate queue is visible first." tasks={todayTasks} emptyMessage="No open tasks are due today." {...taskGroupProps} />
          <TaskGroupSection title="Upcoming" description="Open tasks that can be planned next, including items without a due date." tasks={upcomingTasks} emptyMessage="No upcoming open tasks are waiting in the queue." {...taskGroupProps} />
          <TaskGroupSection title="Completed" description="Finished tasks stay visible here so they can be reviewed, edited, or removed." tasks={completedTasks} emptyMessage="No tasks have been completed yet." {...taskGroupProps} />
        </>
      ) : null}
    </div>
  );
};
