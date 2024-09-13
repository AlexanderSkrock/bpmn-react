import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.@(js|jsx|mjs|ts|tsx)"
  ],
  staticDirs: [
    "../resources"
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {
      legacyRootApi: true,
    },
  },
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-docs",
    "@storybook/addon-links",
    "@storybook/addon-interactions",
    "@storybook/addon-storysource",
  ],
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
};

export default config;
