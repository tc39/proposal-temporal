import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";

export default {
  input: "lib/index.mjs",
  output: {
    name: "temporal",
    file: "script.js",
    format: "iife",
    lib: ["es6"],
  },
  plugins: [
    commonjs(),
    resolve({ preferBuiltins: false }),
  ]
};
