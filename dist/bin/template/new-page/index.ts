import { TemplateSync, type TemplateSyncContext } from "../types.js";
import path from "path";
import * as changecase from "change-case";
import fs from "fs-extra";
import { description } from "../../util/description.js";

async function getLayouts(ctx: TemplateSyncContext, fullPath?: boolean) {
  const layoutSuggestions: string[] = [];

  ctx.components.forEach((component) => {
    if (component.includes("-layout.tsx")) {
      if (fullPath) {
        layoutSuggestions.push(component);
      } else {
        layoutSuggestions.push(
          path.basename(component, path.extname(component) || "")
        );
      }
    }
  });

  layoutSuggestions.push("None...");

  return layoutSuggestions;
}

export default async (ctx: TemplateSyncContext): Promise<TemplateSync> => {
  let layoutComponents: string[] = [];

  return {
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
      layoutImport: " ",
      componentImport: " ",
      component: " ",
    },

    paramPrompts: async () => {
      return {
        page: "Enter a name for the page (Exclude the word 'page' in the name):",
        layout: {
          message: "Start typing to select the layout to utilize for the page:",
          default: await getLayouts(ctx),

          // When the user selects the layout to use, we will read the layout file
          // and check it for a common pattern of requesting specific components
          // to be used in the layout. We will utilize that to
          onValue: async (value) => {
            // If a layout is selected, we shall analyze the layout file for any
            // components it will use in the layout so we can auto import those
            // files and embed into the JSX for even faster development.
            if (value !== "None...") {
              const shouldEmbed = await ctx.lib.prompt.promptSelect(
                "Should this attempt to embed detected used components in the layout?",
                ["yes", "no"]
              );

              if (shouldEmbed?.toLowerCase() === "yes") {
                // Get the layout source file to inspect it
                const layouts = await getLayouts(ctx, true);
                const layoutSrcPath = layouts.find((layout) =>
                  layout.includes(value)
                );

                if (layoutSrcPath && fs.existsSync(layoutSrcPath)) {
                  const layoutSrc = await fs.readFile(layoutSrcPath, "utf8");
                  const componentsUsed = Array.from(
                    layoutSrc.matchAll(/groups\.get\((.+)\)/g)
                  ).map((match) => match[1]);

                  if (componentsUsed.length > 0) {
                    layoutComponents = componentsUsed;
                  } else {
                    console.error(
                      "No components detected in layout:",
                      layoutSrcPath
                    );
                    console.error(description`
                      The layout needs to use groupReactChildren and have calls like group.get(Component)
                      for this tool to pick up those in use.
                    `);
                  }
                } else {
                  console.error(
                    "Unable to find layout source file specified:",
                    layoutSrcPath
                  );
                  process.exit(1);
                }
              }
            }

            return value;
          },
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

      // We will generate imports for the components detected in use within the layout
      if (token[0] === "componentImport" && layoutComponents.length > 0) {
        return `import {\n  ${layoutComponents.join(
          ",\n  "
        )}\n} from "../../../../ui/index.js";`;
      }

      // We will generate the JSX of the components the layout uses for children
      if (token[0] === "component") {
        return `${layoutComponents.map((c) => `<${c} />`).join("\n        ")}`;
      }

      // The None... option for the layout should result in a div being used.
      if (token[0] === "layout") {
        if (value === "None...") {
          return "div";
        }
      }

      return suggested;
    },
  };
};
