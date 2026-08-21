import { resolve } from "node:path";
import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import { loadEnv, type Plugin } from "vite";
import { defineConfig } from "vitest/config";

function azureDevOpsTrace(): Plugin {
  return {
    name: "azure-devops-trace",
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        if (request.url?.includes("work-item-form")) {
          console.info(`[Azure DevOps request] ${request.method} ${request.url}`);
        }
        next();
      });
      server.middlewares.use("/__azdo_trace", (request, response) => {
        let body = "";
        request.on("data", (chunk: Buffer) => { body += chunk.toString(); });
        request.on("end", () => {
          console.info(`[Azure DevOps iframe] ${body}`);
          response.statusCode = 204;
          response.end();
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const tempoughApiRoot = process.env.TEMPOUGH_API_ROOT || env.VITE_TEMPOUGH_API_ROOT;
  const tempoughApiUrl = tempoughApiRoot ? new URL(tempoughApiRoot.replace(/\/+$/, "")) : null;

  if (process.env.VITE_USE_REAL_API === "1" && !tempoughApiUrl) {
    throw new Error("VITE_TEMPOUGH_API_ROOT is required in .env.local or the environment.");
  }

  return {
  base: "./",
  plugins: [react(), azureDevOpsTrace(), ...(process.env.AZDO_HTTPS === "1" ? [basicSsl()] : [])],
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
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/dev.tsx",
        "src/mocks/service-worker.ts",
        "src/work-item-form.tsx",
        "src/domain.ts",
        "src/ports/**",
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
  };
});
