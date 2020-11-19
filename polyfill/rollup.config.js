import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import { env } from 'process';

const isProduction = env.NODE_ENV === 'production';
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
const replaceConfig = { exclude: 'node_modules/**' };
const resolveConfig = { preferBuiltins: false };

export default [
  !isTest262 && {
    input: 'lib/index.mjs',
    plugins: [
      replace({ ...replaceConfig, __debug__: !isProduction }),
      commonjs(),
      resolve(resolveConfig),
      babel(babelConfig),
      isProduction && terser()
    ],
    output: [
      {
        name: libName,
        file: './dist/index.js',
        format: 'cjs',
        sourcemap: true
      },
      {
        name: libName,
        file: './dist/index.umd.js',
        format: 'umd',
        sourcemap: true
      }
    ]
  },
  {
    input: 'lib/shim.mjs',
    plugins: [replace({ ...replaceConfig, __debug__: false }), commonjs(), resolve(resolveConfig)],
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
    plugins: [replace({ ...replaceConfig, __debug__: true }), commonjs(), resolve(resolveConfig), babel(babelConfig)]
  }
].filter(Boolean);
