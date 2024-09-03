import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    "../src/**/*.@mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  staticDirs: [
    "../resources"
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-docs",
    "@storybook/addon-interactions",
    "@storybook/addon-storysource",
  ],
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
  tags: [
    "autodocs",
  ],
};

export default config;
