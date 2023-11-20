import typescript, { RollupTypescriptOptions } from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import babel, { RollupBabelInputPluginOptions } from '@rollup/plugin-babel';
import type { Plugin } from 'rollup';

export interface TsOptions {
  tsconfig?: string;
  outDir?: string;
}

export interface Options {
  ts?: RollupTypescriptOptions;
  babel?: false | RollupBabelInputPluginOptions;
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
      ...ts,
      tsconfig: ts?.tsconfig || './tsconfig.json',
    }),
  ];

  if (babelConfig !== false) {
    plugins.push(
      babel({
        ...babelConfig,
        babelHelpers: babelConfig?.babelHelpers || 'bundled',
        extensions: babelConfig?.extensions ?? ['.js', '.ts', '.jsx', '.tsx'],
        include: babelConfig?.include || ['src/**/*'],
      }),
    );
  }

  return plugins;
}
