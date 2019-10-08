import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";

export default {
  input: "lib/index.mjs",
  output: {
    name: "temporal",
    file: "index.js",
    format: "commonjs",
    lib: ["es6"]
  },
  plugins: [
    commonjs(),
    resolve({ preferBuiltins: false })
  ]
};
