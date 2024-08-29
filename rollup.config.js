import { dirname } from "path";

import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

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
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      terser(),
    ],
    external: [
      "@turf/turf",
      "bpmn-js",
      "d3",
      "diagram-js",
      "grommet-icons",
      "react",
      "react-dom",
      "styled-components"
    ]
  },
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.types,
        format: "es"
      }
    ],
    plugins: [dts.default()],
  },
];