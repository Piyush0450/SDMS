const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const IS_DEBUG = import.meta.env.VITE_DEBUG_AUTH === "true";

export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  // Attach token from localStorage (or fallback to sessionStorage) if present
  const sessionStr = localStorage.getItem("sdms_session") || sessionStorage.getItem("sdms_session");
  const session = JSON.parse(sessionStr || "null");
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

  const rawBody = config.body;
  if (config.body && typeof config.body === "object" && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  if (IS_DEBUG) {
    console.log(`[AUTH DEBUG] Calling API: ${config.method || "GET"} ${url}`, {
      headers: config.headers,
      body: rawBody,
      session,
    });
  }

  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({}));

  if (IS_DEBUG) {
    console.log(`[AUTH DEBUG] API Response (${response.status}):`, data);
  }

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

