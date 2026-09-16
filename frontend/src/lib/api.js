const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  // Attach token from sessionStorage if present
  const session = JSON.parse(sessionStorage.getItem("sdms_session") || "null");
  if (session?.token) {
    defaultHeaders["Authorization"] = `Bearer ${session.token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  if (config.body && typeof config.body === "object" && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  get: (endpoint) => apiFetch(endpoint, { method: "GET" }),
  post: (endpoint, body) => apiFetch(endpoint, { method: "POST", body }),
  put: (endpoint, body) => apiFetch(endpoint, { method: "PUT", body }),
  delete: (endpoint) => apiFetch(endpoint, { method: "DELETE" }),
};
