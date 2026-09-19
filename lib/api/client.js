import axios from "axios";
import { API_BASE_URL } from "./config";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  paramsSerializer: {
    serialize: (params) => {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null) continue;
        if (Array.isArray(value)) {
          searchParams.set(key, value.join(","));
        } else if (typeof value === "object") {
          searchParams.set(key, JSON.stringify(value));
        } else {
          searchParams.set(key, String(value));
        }
      }
      return searchParams.toString();
    },
  },
});

let sessionTokenProvider = null;

export const setTokenProvider = (provider) => {
  sessionTokenProvider = provider;
};

apiClient.interceptors.request.use(async (config) => {
  if (sessionTokenProvider) {
    try {
      const token = await sessionTokenProvider();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // no session token available (e.g. opened outside the Shopify admin)
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      !error.config?.url?.startsWith("/auth/")
    ) {
      window.dispatchEvent(new CustomEvent("auth:session-expired"));
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred.";
    return Promise.reject(new Error(message));
  }
);