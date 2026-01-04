import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import css from "rollup-plugin-css-only";

export default {
  input: "src/index.tsx",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true
    }
  ],
  plugins: [
    resolve(),
    typescript(),
    css({ output: "styles.css" })
  ],
  external: ["react"]
};
