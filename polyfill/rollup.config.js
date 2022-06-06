import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import { env } from 'process';

const isTest262 = !!env.TEST262;
const libName = 'temporal';
const babelConfig = {
  exclude: 'node_modules/**',
  babelHelpers: 'bundled',
  presets: [
    [
      '@babel/preset-env',
      {
        targets: '> 0.25%, not dead'
      }
    ]
  ]
};
const replaceConfig = { exclude: 'node_modules/**', preventAssignment: true };
const resolveConfig = { preferBuiltins: false };

export default [
  {
    input: 'lib/shim.mjs',
    plugins: [
      replace({ ...replaceConfig, __debug__: false, __isTest262__: isTest262 }),
      commonjs(),
      nodePolyfills(),
      resolve(resolveConfig)
    ],
    output: {
      name: libName,
      file: 'script.js',
      format: 'iife',
      sourcemap: true
    }
  },
  !isTest262 && {
    input: 'lib/shim.mjs',
    output: {
      name: libName,
      file: '../out/docs/playground.js',
      format: 'umd',
      sourcemap: true
    },
    plugins: [
      replace({ ...replaceConfig, __debug__: true, __isTest262__: false }),
      commonjs(),
      nodePolyfills(),
      resolve(resolveConfig),
      babel(babelConfig)
    ]
  }
].filter(Boolean);
