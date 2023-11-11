import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';

const external = [];

function getConfig(format, banner) {
  return {
    input: 'src/index.ts',
    output: {
      file: `dist/${format}/index.js`,
      format,
      banner,
      sourcemap: true,
    },
    external,
    plugins: [
      commonjs(),
      resolve({
        preferBuiltins: true,
      }),
      json(),
      typescript({
        tsconfig: './tsconfig.json',
      }),
      babel({
        babelHelpers: 'bundled',
      }),
    ],
  };
}

export default [getConfig('cjs'), getConfig('es')];
