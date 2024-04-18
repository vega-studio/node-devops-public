import {
  TemplateSync,
  type TemplateSyncContext,
} from "../sync-template-to-target.js";
import path from "path";
import * as changecase from "change-case";

async function getLayouts(ctx: TemplateSyncContext) {
  const layoutSuggestions: string[] = [];

  ctx.components.forEach((component) => {
    if (component.includes("-layout.tsx")) {
      layoutSuggestions.push(
        path.basename(component, path.extname(component) || "")
      );
    }
  });

  layoutSuggestions.push("None...");

  return layoutSuggestions;
}

export default async (ctx: TemplateSyncContext): Promise<TemplateSync> => ({
  defaultTargetPath: path.resolve("./"),
  fileMap: [
    [
      "./templates/page.template",
      "./app/client/pages/${{page: kebab}}/${{page: kebab}}.page.tsx",
    ],
    [
      "./templates/scss.template",
      "./app/client/pages/${{page: kebab}}/${{page: kebab}}.page.scss",
    ],
  ],

  templateParams: {
    // Specify the layout import here so we don't need to prompt a result for
    // it.
    layoutImport: "",
  },

  paramPrompts: async () => {
    return {
      page: "Enter a name for the page (Exclude the word 'page' in the name):",
      layout: {
        message:
          "Start typing to select the directory to add your new component:",
        default: await getLayouts(ctx),
      },
    };
  },

  transformToken: (
    token: string[],
    value: string,
    suggested: string,
    options: Record<string, string | undefined>
  ) => {
    // If the user specified a layout, we must include it's import in the
    // template. Otherwise we make NO import line.
    if (token[0] === "layoutImport") {
      const layout = options["layout"];

      if (layout !== void 0 && layout !== "None...") {
        return `import { ${changecase.pascalCase(
          layout
        )} } from "../../../../ui/index.js";`;
      }
    }

    // The None... option for the layout should result in a div being used.
    if (token[0] === "layout") {
      if (value === "None...") {
        return "div";
      }
    }

    return suggested;
  },
});
