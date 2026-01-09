import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import css from "rollup-plugin-css-only";

export default {
  input: "src/index.tsx",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true,
      banner: '"use client";'
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
      banner: '"use client";'
    }
  ],
  plugins: [
    resolve(),
    typescript(),
    css({ output: "styles.css" })
  ],
  external: ["react"]
};
