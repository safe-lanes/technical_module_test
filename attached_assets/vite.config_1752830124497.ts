import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { cartographer } from "@replit/vite-plugin-cartographer"; // Import here

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined
      ? [cartographer()] // Use imported plugin
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(path.dirname(new URL(import.meta.url).pathname), "client", "src"),
      "@shared": path.resolve(path.dirname(new URL(import.meta.url).pathname), "shared"),
      "@assets": path.resolve(path.dirname(new URL(import.meta.url).pathname), "attached_assets"),
    },  
  },
  root: path.resolve(path.dirname(new URL(import.meta.url).pathname), "client"),
  build: {
    outDir: path.resolve(path.dirname(new URL(import.meta.url).pathname), "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    port: 5000, // Ensure the recommended port is used
    host: "0.0.0.0", // Bind to all IPs
  },
});