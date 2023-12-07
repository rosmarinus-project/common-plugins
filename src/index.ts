import { resolve as resolvePath } from 'path';
import typescript, { RollupTypescriptOptions } from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import strip, { RollupStripOptions } from '@rollup/plugin-strip';
import babel, { RollupBabelInputPluginOptions } from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';
import type { FilterPattern } from '@rollup/pluginutils';
import type { Plugin } from 'rollup';

export interface TsOptions {
  tsconfig?: string;
  outDir?: string;
}

export interface StripOptions extends RollupStripOptions {
  removeConsole?: boolean;
  removeDebugger?: boolean;
  removeAssert?: boolean;
}

export interface Options {
  ts?: RollupTypescriptOptions;
  babel?: false | RollupBabelInputPluginOptions;
  strip?: boolean | StripOptions;
  src?: FilterPattern;
  replace?: Record<string, string>;
  alias?: false | Record<string, string>;
}

export default function commonPlugin(options?: Options): Plugin[] {
  const { src = ['src/**/*'], ts, babel: babelConfig, strip: stripConfig, replace: replaceConfig } = options || {};

  const entries = options?.alias === false ? [] : [{ find: '@src', replacement: resolvePath('src') }];

  Object.entries(options?.alias || {}).forEach(([find, replacement]) => {
    entries.push({ find, replacement });
  });
  const plugins = [
    commonjs(),
    alias({
      entries,
    }),
    resolve({
      preferBuiltins: true,
    }),
    json(),
    typescript({
      ...ts,
      tsconfig: ts?.tsconfig || './tsconfig.json',
    }),
  ];

  if (replaceConfig) {
    plugins.unshift(
      replace({
        preventAssignment: true,
        values: replaceConfig,
      }),
    );
  }

  if (babelConfig !== false) {
    plugins.push(
      babel({
        ...babelConfig,
        babelHelpers: babelConfig?.babelHelpers || 'bundled',
        extensions: babelConfig?.extensions ?? ['.js', '.ts', '.jsx', '.tsx'],
        include: babelConfig?.include || src,
      }),
    );
  }

  if (stripConfig) {
    if (stripConfig === true) {
      plugins.push(
        strip({
          include: src,
          debugger: true,
          functions: ['console.*', 'assert.*'],
        }),
      );
    } else {
      const { removeConsole, removeDebugger, removeAssert, ...rest } = stripConfig;

      plugins.push(
        strip({
          include: src,
          debugger: removeDebugger,
          functions: [
            ...(removeConsole ? ['console.*'] : []),
            ...(removeAssert ? ['assert.*'] : []),
            ...(rest.functions || []),
          ],
          ...rest,
        }),
      );
    }
  }

  return plugins;
}
