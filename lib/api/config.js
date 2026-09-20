export const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const ENDPOINTS = {
  auth: {
    begin: "/auth/begin",
    callback: "/auth/callback",
  },
  products: {
    list: "/products",
    logs: "/products/logs",
    detail: (id) => `/products/${id}`,
    update: (id) => `/products/${id}`,
  },
};