import { defineConfig } from "vitest/config";
import path from "node:path";

/**
 * Vitest needs to resolve the `@/` path alias the same way the Next.js
 * bundler does (per `tsconfig.json`'s `paths`). Without this, library
 * tests that import from sibling files via `@/lib/...` fail to load.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      exclude: [
        "**/node_modules/**",
        ".next/**",
        "next.config.ts",
        "postcss.config.*",
        "tailwind.config.*",
        "**/*.config.*",
        "**/*.d.ts",
        "**/*.test.*",
        "scripts/**",
        "supabase/**",
      ],
    },
  },
});
