const JSON_HEADERS = {
  "Content-Type": "application/json"
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";

const buildUrl = (path) => `${API_BASE_URL}${path}`;

const parseJson = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
};

export const registerRequest = async (payload) => {
  const response = await fetch(buildUrl("/api/auth/register"), {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload)
  });
  return parseJson(response);
};

export const loginRequest = async (payload) => {
  const response = await fetch(buildUrl("/api/auth/login"), {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload)
  });

  return parseJson(response);
};

export const fetchCurrentUserRequest = async (token) => {
  const response = await fetch(buildUrl("/api/auth/me"), {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return parseJson(response);
};

export const logoutRequest = async (token) => {
  const response = await fetch(buildUrl("/api/auth/logout"), {
    method: "POST",
    headers: token
      ? {
          Authorization: `Bearer ${token}`
        }
      : undefined
  });

  return parseJson(response);
};
