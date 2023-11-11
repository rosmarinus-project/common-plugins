import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import type { Plugin } from 'rollup';

export interface Options {
  tsconfig?: string;
  babel?: false | { babelHelpers?: 'bundled' | 'runtime' | 'inline' | 'external' };
}

export default function commonPlugin(options?: Options): Plugin {
  const { tsconfig = './tsconfig.json', babel: babelConfig } = options || {};
  const plugins = [
    commonjs(),
    resolve({
      preferBuiltins: true,
    }),
    json(),
    typescript({
      tsconfig,
    }),
  ];

  if (babelConfig !== false) {
    plugins.push(
      babel({
        babelHelpers: babelConfig?.babelHelpers || 'bundled',
        extensions: ['.js', '.ts', '.jsx', '.tsx'],
        exclude: 'node_modules/**',
      }),
    );
  }

  return {
    name: '@rosmarinus/common-plugins',
    options(options) {
      if (!options.plugins) {
        // eslint-disable-next-line no-param-reassign
        options.plugins = [];
      }

      if (Array.isArray(options.plugins)) {
        options.plugins?.push(...plugins);
      }
    },
  };
}
