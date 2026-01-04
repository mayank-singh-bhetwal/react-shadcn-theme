import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [dts()],
  esbuild: {
    jsx: "preserve"
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      name: "react-shadcn-theme",
      fileName: (format) => `index.${format === "es" ? "mjs" : "js"}`,
      formats: ["es", "cjs"]
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react/jsx-runtime": "jsxRuntime"
        }
      }
    }
  }
});
