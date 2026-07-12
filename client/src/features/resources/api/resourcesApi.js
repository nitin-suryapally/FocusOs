const JSON_HEADERS = {
  "Content-Type": "application/json"
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";

const buildUrl = (path) => `${API_BASE_URL}${path}`;

const parseJson = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Unable to load resources.");
  }

  return data;
};

export const fetchResourcesRequest = async (token) => {
  const response = await fetch(buildUrl("/api/resources"), {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return parseJson(response);
};

export const createResourceRequest = async (token, payload) => {
  const response = await fetch(buildUrl("/api/resources"), {
    method: "POST",
    headers: {
      ...JSON_HEADERS,
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  return parseJson(response);
};
