import { dirname } from "path";

import typescript from "typescript";

import commonjsPlugin from "@rollup/plugin-commonjs";
import resolvePlugin from "@rollup/plugin-node-resolve";
import terserPlugin from "@rollup/plugin-terser";
import peerDepsExternalPlugin from "rollup-plugin-peer-deps-external";
import typescriptPlugin from "rollup-plugin-typescript2";

const packageJson = require("./package.json");

const librarySourceRoot = "lib";

export default [
  {
    input: [
      `${librarySourceRoot}/index.ts`,
      `${librarySourceRoot}/Overlays/Heatmap/heatmap.worker.ts`,
    ],
    output: [
      {
        dir: dirname(packageJson.main),
        preserveModules: true,
        preserveModulesRoot: librarySourceRoot,
        format: "cjs",
        sourcemap: true,
      },
      {
        dir: dirname(packageJson.module),
        preserveModules: true,
        preserveModulesRoot: librarySourceRoot,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternalPlugin(),
      resolvePlugin(),
      commonjsPlugin(),
      typescriptPlugin({
        typescript,
        // currently we can neither use preserveModulesRoot for typings
        // nor define the output directory here with dirname(packageJson.types),
        // thus it remains within the tsconfig.json
        useTsconfigDeclarationDir: true
      }),
      terserPlugin(),
    ],
  },
];
