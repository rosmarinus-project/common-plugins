import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import type { Plugin } from 'rollup';

export interface BabelOptions {
  babelHelpers?: 'bundled' | 'runtime' | 'inline' | 'external';
  include?: ReadonlyArray<string | RegExp> | string | RegExp;
  exclude?: ReadonlyArray<string | RegExp> | string | RegExp;
}

export interface TsOptions {
  tsconfig?: string;
  outDir?: string;
}

export interface Options {
  ts?: TsOptions;
  babel?: false | BabelOptions;
}

export default function commonPlugin(options?: Options): Plugin[] {
  const { ts, babel: babelConfig } = options || {};
  const plugins = [
    commonjs(),
    resolve({
      preferBuiltins: true,
    }),
    json(),
    typescript({
      tsconfig: ts?.tsconfig || './tsconfig.json',
      outDir: ts?.outDir,
    }),
  ];

  if (babelConfig !== false) {
    plugins.push(
      babel({
        babelHelpers: babelConfig?.babelHelpers || 'bundled',
        extensions: ['.js', '.ts', '.jsx', '.tsx'],
        include: babelConfig?.include || ['src/**/*'],
        exclude: babelConfig?.exclude,
      }),
    );
  }

  return plugins;
}
