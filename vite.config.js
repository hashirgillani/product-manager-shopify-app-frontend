import { defineConfig } from "vite";
import { dirname } from "path";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  root: dirname(fileURLToPath(import.meta.url)),
  plugins: [react(), tailwindcss()],
  server: {
    host: "localhost",
    port: 5173,
    allowedHosts: [".ngrok-free.dev"],
  },
});