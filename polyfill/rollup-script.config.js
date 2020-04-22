import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'lib/index.mjs',
  output: {
    name: 'temporal',
    file: 'script.js',
    format: 'iife',
    sourcemap: true
  },
  plugins: [commonjs(), resolve({ preferBuiltins: false })]
};
