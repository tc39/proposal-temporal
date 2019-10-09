import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import {uglify} from 'rollup-plugin-uglify';

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
    resolve({ preferBuiltins: false }),
    babel({
      exclude: 'node_modules/**',
      presets: [
        [
          "@babel/preset-env",
          {
            corejs: 3,
            useBuiltIns: "entry",
            targets: "> 0.25%, not dead"
          }
        ]
      ]
    }),
    uglify()
  ]
};
