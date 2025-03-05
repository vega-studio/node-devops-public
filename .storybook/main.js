const path = require("path");
const fs = require("fs");
console.warn("PROJECT ROOT:", process.env.PROJECT_ROOT);
const NODE_MODULES_STORIES = (process.env.NODE_MODULES_STORIES || "")
  .split(",")
  .filter(Boolean);

const CONFIG = {
  stories: [
    {
      directory: path.resolve(process.env.PROJECT_ROOT || "", "./ui"),
      files: "**/*.mdx",
    },
    {
      directory: path.resolve(process.env.PROJECT_ROOT || "", "./ui"),
      files: "**/*.stories.@(js|jsx|ts|tsx)",
    },
    {
      directory: path.resolve(process.env.PROJECT_ROOT || "", "./ui"),
      files: "**/*.bugs.@(js|jsx|ts|tsx)",
    },
    ...NODE_MODULES_STORIES.map((moduleName) => {
      const moduleStories = path.resolve(
        process.env.PROJECT_ROOT || "",
        `./node_modules/${moduleName}/dist/stories`
      );
      if (fs.existsSync(moduleStories)) {
        return {
          directory: path.resolve(moduleStories),
          files: "**/*.stories.@(js|jsx|ts|tsx)",
        };
      } else {
        console.warn(
          `The stories for installed dependency ${moduleName} were not found.`
        );
      }
    }),
  ].filter(Boolean),
  addons: [
    "@storybook/preset-scss",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: [
    path.resolve(process.env.PROJECT_ROOT || "", "./ui/assets"),
    path.resolve(process.env.PROJECT_ROOT || "", "./ui/stories/assets"),
  ],
  babel: async (_options) =>
    require(process.env.PROJECT_ROOT, path.resolve(".babelrc.json")),
  viteFinal: async (config) => {
    // Vite adjustments for projects
    return config;
  },
  docs: {
    docsMode: false,
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      include: [
        path.resolve(process.env.PROJECT_ROOT || "", "ui/components/**/**.tsx"),
      ],
    },
  },
};
console.warn("STORIES FROM", CONFIG.stories);
console.warn("\\\\".replace("\\\\", "\\"));
module.exports = CONFIG;
