import { dirname } from "path";

import typescript from "typescript";

import commonjsPlugin from "@rollup/plugin-commonjs";
import resolvePlugin from "@rollup/plugin-node-resolve";
import terserPlugin from "@rollup/plugin-terser";
import { dts as dtsPlugin } from "rollup-plugin-dts";
import peerDepsExternalPlugin from "rollup-plugin-peer-deps-external";
import typescriptPlugin from "rollup-plugin-typescript-2";

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
      typescriptPlugin({ typescript }),
      terserPlugin(),
    ],
  },
  {
    input: "dist/types/index.d.ts",
    output: [
      {
        file: packageJson.types,
        format: "es"
      }
    ],
    plugins: [
      dtsPlugin()
    ],
  },
];
