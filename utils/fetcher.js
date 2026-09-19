import { createApp } from "@shopify/app-bridge";
import { authenticatedFetch } from "@shopify/app-bridge/utilities/session-token";

const apiKeyMeta = document.querySelector('meta[name="shopify-api-key"]');
const shopifyHost = new URLSearchParams(window.location.search).get("host");

export const app = createApp({
  apiKey: apiKeyMeta?.content ?? "",
  host: shopifyHost ?? "",
});

const authFetch = authenticatedFetch(app);

// Base URL of the backend. When empty, /api requests go to the same origin
// (useful during local dev where Vite proxies /api to the backend).
export const API_BASE = import.meta.env.VITE_API_URL ?? "";

export function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  return authFetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
}