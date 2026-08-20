import { resolve } from "node:path";
import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const tempoughApiRoot = process.env.TEMPOUGH_API_ROOT || env.VITE_TEMPOUGH_API_ROOT;
  const tempoughApiUrl = tempoughApiRoot ? new URL(tempoughApiRoot.replace(/\/+$/, "")) : null;

  if (process.env.VITE_USE_REAL_API === "1" && !tempoughApiUrl) {
    throw new Error("VITE_TEMPOUGH_API_ROOT is required in .env.local or the environment.");
  }

  return {
  base: "./",
  plugins: [react(), ...(process.env.AZDO_HTTPS === "1" ? [basicSsl()] : [])],
  server: {
    strictPort: true,
    proxy: tempoughApiUrl ? {
      "/__tempough": {
        target: tempoughApiUrl.origin,
        changeOrigin: true,
        rewrite: (path) => `${tempoughApiUrl.pathname}${path.replace(/^\/__tempough/, "")}`,
      },
    } : undefined,
  },
  build: {
    copyPublicDir: false,
    sourcemap: false,
    rollupOptions: {
      input: {
        workItemForm: resolve(__dirname, "work-item-form.html"),
      },
    },
  },
  test: {
    environment: "jsdom",
    environmentOptions: {
      jsdom: { url: "https://localhost/" },
    },
    setupFiles: ["./test/setup.ts"],
  },
  };
});
