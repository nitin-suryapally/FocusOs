const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";

const buildUrl = (path) => `${API_BASE_URL}${path}`;

const parseJson = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Unable to load tasks.");
  }

  return data;
};

export const fetchTasksRequest = async (token) => {
  const response = await fetch(buildUrl("/api/tasks"), {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return parseJson(response);
};

export const createTaskRequest = async (token, payload) => {
  const response = await fetch(buildUrl("/api/tasks"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  return parseJson(response);
};

export const updateTaskRequest = async (token, taskId, payload) => {
  const response = await fetch(buildUrl(`/api/tasks/${taskId}`), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  return parseJson(response);
};


export const deleteTaskRequest = async (token, taskId) => {
  const response = await fetch(buildUrl(`/api/tasks/${taskId}`), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return parseJson(response);
};
