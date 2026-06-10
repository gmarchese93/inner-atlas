import path from "node:path";
import { defineConfig } from "vitest/config";

const appRoot = path.resolve(import.meta.dirname, "artifacts/inner-atlas");

export default defineConfig({
  esbuild: {
    jsx: "automatic",
  },
  resolve: {
    alias: {
      "@": path.resolve(appRoot, "src"),
      react: path.resolve(appRoot, "node_modules/react"),
      "react-dom": path.resolve(appRoot, "node_modules/react-dom"),
      "react-router-dom": path.resolve(
        appRoot,
        "node_modules/react-router-dom",
      ),
    },
    dedupe: ["react", "react-dom", "react-router", "react-router-dom"],
  },
  test: {
    clearMocks: true,
    restoreMocks: true,
    setupFiles: ["./tests/setup.ts"],
    environment: "jsdom",
    environmentOptions: {
      jsdom: {
        url: "http://localhost/",
      },
    },
    include: ["tests/{unit,integration}/**/*.test.{js,jsx,ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "coverage",
      include: [
        "artifacts/inner-atlas/src/audio/**/*.js",
        "artifacts/inner-atlas/src/lib/activeSession.js",
        "artifacts/inner-atlas/src/lib/sessionStorage.js",
      ],
      exclude: ["**/*.test.{js,jsx,ts,tsx}"],
    },
  },
});
