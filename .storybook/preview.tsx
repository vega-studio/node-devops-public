import type { Preview } from "@storybook/react";

// import DocumentationTemplate from "./documentation-template.mdx";

const preview: Preview = {
  // ...rest of preview
  //👇 Enables auto-generated documentation for all stories
  tags: ["autodocs"],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    // page: DocumentationTemplate,
  },
};

export default preview;
