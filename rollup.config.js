import { dirname } from "path";

import typescript from "typescript";

import commonjsPlugin from "@rollup/plugin-commonjs";
import resolvePlugin from "@rollup/plugin-node-resolve";
import terserPlugin from "@rollup/plugin-terser";
import dtsPlugin from "rollup-plugin-dts";
import peerDepsExternalPlugin from "rollup-plugin-peer-deps-external";
import typescriptPlugin from "rollup-plugin-typescript-2";

const packageJson = require("./package.json");

export default [
  {
    input: "src/index.ts",
    output: [
      {
        dir: dirname(packageJson.main),
        preserveModules: true,
        preserveModulesRoot: "src",
        format: "cjs",
        sourcemap: true,
      },
      {
        dir: dirname(packageJson.module),
        preserveModules: true,
        preserveModulesRoot: "src",
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
    plugins: [dtsPlugin.default()],
  },
];