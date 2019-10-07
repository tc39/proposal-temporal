import babel from "rollup-plugin-babel";
export default {
  input: "lib/temporal.mjs",
  output: {
    name: "temporal",
    file: "index.js",
    format: "commonjs",
    lib: ["es6"]
  },
  external: ["es-abstract"],
  plugins: [
    babel({
      exclude: "node_modules/**",
      plugins: [
        "@babel/plugin-proposal-numeric-separator",
        "@babel/plugin-syntax-bigint"
      ]
    })
  ]
};
