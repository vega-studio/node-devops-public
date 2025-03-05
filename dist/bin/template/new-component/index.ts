import { type TemplateSync, type TemplateSyncContext } from "../types.js";
import path from "path";
import fs from "fs-extra";

export default async (ctx: TemplateSyncContext): Promise<TemplateSync> => {
  const {
    util: { changecase, openFile, description },
    targetProject: { targetProjectPackage },
    component: {
      isComponentSelections,
      generateCategory,
      makeComponentSelections,
      checkComponentStructure,
    },
    prompt: { promptTextInput },
  } = ctx.lib;

  let isNewCategory = false;
  const targetPackage = await targetProjectPackage();
  const componentNames = new Set<string>();

  ctx.components.forEach((c) =>
    componentNames.add(changecase.pascalCase(path.basename(c, path.extname(c))))
  );

  /**
   * This finds the nearest barrel file (parent barrel) to the newly created
   * component and adds the new component to the exports.
   */
  async function updateBarrel(
    paths: Awaited<ReturnType<typeof checkComponentStructure>>,
    selections: ReturnType<typeof makeComponentSelections>
  ) {
    const kebabName = changecase.kebabCase(selections.component);
    const filePath = path.resolve(
      paths?.componentsPath || "",
      selections.category,
      kebabName,
      `${kebabName}.tsx`
    );

    // Get the barrel file that is the immediate parent
    const properBarrel = path.resolve(filePath, "../../index.ts");

    // We should require the barrel to be the immediate parent.
    if (!fs.existsSync(properBarrel)) {
      console.warn(description`
      Not found: ${properBarrel}
      A parent barrel file within the component category was not found.
      One will be created.
    `);

      fs.writeFileSync(properBarrel, "", { encoding: "utf-8" });
    }

    let barrel = fs.readFileSync(properBarrel, { encoding: "utf-8" });
    // Clear exact same export
    barrel = barrel
      .split(`export * from "./${kebabName}/${kebabName}.js";`)
      .map((s) => s.trim())
      .join("\n");
    // Inject the export at the bottom of the barrel
    barrel = `${barrel.trim()}\nexport * from "./${kebabName}/${kebabName}.js";\n`;
    // Write the new barrel
    fs.writeFileSync(properBarrel, `${barrel.trim()}\n`, { encoding: "utf-8" });
    // Open the barrel file for review
    await openFile(properBarrel);
  }

  return {
    defaultTargetPath: path.resolve("./"),
    fileMap: [
      [
        "./templates/component.template",
        "./ui/components/${{category: kebab}}/${{component: kebab}}/${{component: kebab}}.tsx",
      ],
      [
        "./templates/scss.template",
        "./ui/components/${{category: kebab}}/${{component: kebab}}/${{component: kebab}}.scss",
      ],
      [
        "./templates/story.template",
        "./ui/stories/components/${{category: kebab}}/${{component: kebab}}.stories.tsx",
      ],
      [
        "./templates/props.template",
        "./ui/stories/data/${{category: kebab}}/${{component: kebab}}-props.tsx",
      ],
    ],

    templateParams: {
      project: targetPackage.name,
    },

    paramPrompts: async () => {
      const categories = fs
        .readdirSync(ctx.componentsPaths?.componentsPath || "")
        .filter((c) =>
          fs
            .statSync(
              path.resolve(ctx.componentsPaths?.componentsPath || "", c)
            )
            .isDirectory()
        );

      return {
        component: {
          message: "Type a name for the component:",
          default: "",

          // Make sure the component name chosen is not already in use.
          onValue: async (component: string) => {
            while (componentNames.has(changecase.pascalCase(component))) {
              console.error("The component name you provided already exists.");
              component = await promptTextInput(
                "Type a name for the component:"
              );
            }

            component = changecase.pascalCase(component);
            return component;
          },
        },

        category: {
          message:
            "Start typing to select the directory to add your new component:",
          default: categories.concat(["New..."]),

          // When the user selects New... we prompt the user to enter a name for
          // the category.
          onValue: async (category: string) => {
            if (category === "New...") {
              category = await promptTextInput(
                "Type a name for the new directory:"
              );
              category = changecase.kebabCase(category);

              // Keep prompting for a unique name
              while (
                fs.existsSync(
                  path.resolve(
                    ctx.componentsPaths?.componentsPath || "",
                    category
                  )
                )
              ) {
                console.error(
                  "The category/directory you provided already exists."
                );
                category = await promptTextInput(
                  "Type a name for a new directory/category:"
                );
                category = changecase.kebabCase(category);
              }

              isNewCategory = true;
            }

            return category;
          },
        },
      };
    },

    syncComplete: async (files, ctx, options) => {
      if (isComponentSelections(options)) {
        // Ensure the category has it's files generated correctly and barrels
        // updated
        if (isNewCategory && ctx.componentsPaths) {
          await generateCategory(ctx.componentsPaths, options);
        }

        // We update the barrel files for the newly made components
        updateBarrel(ctx.componentsPaths, options);
      }
    },
  };
};
