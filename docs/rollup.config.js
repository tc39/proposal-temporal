import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import builtins from 'rollup-plugin-node-builtins';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: '../polyfill/lib/index.mjs',
  output: {
    name: 'temporal',
    file: 'playground.js',
    format: 'umd'
  },
  plugins: [
    replace({
      exclude: 'node_modules/**',
      __debug__: true
    }),
    commonjs(),
    builtins(),
    resolve({ preferBuiltins: false }),
    babel({
      exclude: '../polyfill/lib/node_modules/**',
      babelHelpers: 'bundled',
      presets: [
        [
          '@babel/preset-env',
          {
            corejs: 3,
            useBuiltIns: 'entry',
            targets: '> 0.25%, not dead'
          }
        ]
      ]
    })
  ]
};
