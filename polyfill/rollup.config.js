import nodeResolve from 'rollup-plugin-node-resolve';
import license from 'rollup-plugin-license';
import { join } from 'path';

export default {
  input: 'lib/index.mjs',
  plugins: [
    nodeResolve({
      jsnext: true
    }),
    license({
      banner: {
        file: join(__dirname, 'LICENSE'),
        encoding: 'utf-8'
      }
    })
  ],
  output: {
    file: 'index.js',
    name: 'temporal',
    format: 'umd',
    sourcemap: true
  }
};
