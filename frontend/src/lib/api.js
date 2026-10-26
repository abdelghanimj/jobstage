
const API_URL = "http://localhost:8000";

export async function getCsrfCookie() {
  const response = await fetch(`${API_URL}/sanctum/csrf-cookie`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Impossible d'obtenir le cookie CSRF.");
  }
}

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});

  headers.set("Accept", "application/json");

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const xsrfCookie = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("XSRF-TOKEN="));

  if (xsrfCookie) {
    headers.set(
      "X-XSRF-TOKEN",
      decodeURIComponent(xsrfCookie.substring("XSRF-TOKEN=".length))
    );
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Erreur HTTP ${response.status}`);
  }

  return data;
}
