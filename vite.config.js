import { defineConfig } from "vite";
import { dirname } from "path";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";
import { config as loadEnv } from "dotenv";

loadEnv();

// Injected into index.html's <meta name="shopify-api-key"> at build time.
process.env.VITE_SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;

export default defineConfig({
  root: dirname(fileURLToPath(import.meta.url)),
  plugins: [react()],
  resolve: {
    preserveSymlinks: true,
  },
  server: {
    host: "localhost",
    port: Number(process.env.PORT || 5173),
    // Allow the app to be accessed through the dev tunnel domain.
    allowedHosts: [".ngrok-free.dev"],
    proxy: {
      // Local dev convenience: when the frontend has no VITE_API_URL, /api
      // requests are proxied to the local backend so the browser stays
      // same-origin and CORS never gets in the way.
      "/api": {
        target: process.env.VITE_PROXY_TARGET || "http://127.0.0.1:3000",
        changeOrigin: false,
      },
    },
  },
});