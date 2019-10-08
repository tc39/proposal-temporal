import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";

export default {
  input: "setup.js",
  output: {
    name: "temporal",
    file: "playground.js",
    format: "umd",
    lib: ["es6"]
  },
  plugins: [
    commonjs(),
    resolve({ preferBuiltins: false })
  ]
};
