/**
 * This is a specialized plugin for supporting the `app/config` folder to have
 * targetted environment files that automatically swap for the correct
 * environment being built for.
 *
 * The default configuration would be to have `env` files at the root of the
 * folder:
 *
 * ```
 * app/config:
 *   env.ts
 *   env.prod.ts
 *   env.stage.ts
 *   env.custom.ts
 * ```
 *
 * You have two ways to target the configuration:
 *
 * For development use the environment variable `ENV_MODE` to target the
 * environment of choice such as
 *
 * ```
 * ENV_MODE=custom
 * ```
 *
 * For releases you specify a `build.conf.js` file in the root of the project
 * with the contents:
 *
 * ```
 * export const BUILD_TARGETS = ["prod", "custom"];
 * ```
 *
 * Which will cause the release process to make a distribution per release
 * target specified.
 *
 * env within this devops system is intended to help smoothe over a dev server
 * with the development environment to make it easier to interface with any
 * remote server under any domain.
 *
 * However, the concept can be expanded for the developer by adding sub folders
 * to create more specific environment configurations that may be needed for a
 * front end but NOT a server. Or may be it's just for easier organization of
 * configuration. One common use would be a theme:
 *
 * ```
 * app/config:
 *   env:
 *     env.ts
 *     env.prod.ts
 *     env.stage.ts
 *     env.custom.ts
 *  theme:
 *     theme.ts
 *     theme.prod.ts
 *     theme.stage.ts
 *     theme.custom.ts
 * ```
 *
 * Your code imports these configurations via:
 *
 * ```
 * import { Thing } from "config/thing";
 * ```
 *
 * The important formatting concerns here is to ensure you make a common entry
 * file with the same name as the parent folder:
 *
 * ```
 * app/config:
 *   env:
 *     env.ts
 *   theme:
 *     theme.ts
 * ```
 *
 * Then you add any additional environments of the same file name.
 * `<file>.<environment>.ts`.
 *
 * The file with no environment in it's file path is the file used in
 * development when no environment is specified.
 */

import fs from "fs-extra";
import path from "path";
import { chalk } from "../../bin/lib/util/chalk.js";
import { viteDevopsStringReplacePlugin } from "./vite-devops-string-replace-plugin.js";

export function viteDevopsAppConfigPlugin(env?: string | null) {
  // This is a fix for running storybook how we run it which adjusts the cwd
  // to the devops folder
  const projectRoot = process.env.PROJECT_ROOT || ".";
  // Look in the app config folder for any folder environments
  const configPath = path.resolve(projectRoot, "app/config");

  if (!fs.existsSync(configPath)) {
    console.warn(
      `viteDevopsAppConfigPlugin: ${chalk.cyanBrightBold(
        "No app/config folder found."
      )}`
    );

    return;
  }

  try {
    const allFolders = fs.readdirSync(configPath).filter((f) => {
      return fs.statSync(path.join(configPath, f)).isDirectory();
    });
    const folderPaths = allFolders.map((f) => path.join(configPath, f));
    const replacements = allFolders.map((folder, i) => {
      // With no environment, we check for the special case of a .local file being
      // present in the folder. If it is, we use that as the environment.
      if (!env) {
        // If local exists, create special replacement to target the local file
        if (
          fs.existsSync(path.join(folderPaths[i], `${folder}.local`)) ||
          fs.existsSync(path.join(folderPaths[i], `${folder}.local.js`)) ||
          fs.existsSync(path.join(folderPaths[i], `${folder}.local.ts`)) ||
          fs.existsSync(path.join(folderPaths[i], `${folder}.local.tsx`)) ||
          fs.existsSync(path.join(folderPaths[i], `${folder}.local.jsx`))
        ) {
          return [
            {
              from: `"config/${folder}/${folder}"`,
              to: `"config/${folder}/${folder}.local"`,
            },
            {
              from: `"config/${folder}/${folder}.js"`,
              to: `"config/${folder}/${folder}.local.js"`,
            },
            {
              from: `"config/${folder}/${folder}.ts"`,
              to: `"config/${folder}/${folder}.local.ts"`,
            },
          ];
        }

        // Otherwise, the default env file will be used
        else {
          return [];
        }
      }

      // An enviroment was specified, so we will target that environment
      return [
        {
          from: `"config/${folder}/${folder}"`,
          to: `"config/${folder}/${folder}.${env}"`,
        },
        {
          from: `"config/${folder}/${folder}.js"`,
          to: `"config/${folder}/${folder}.${env}.js"`,
        },
        {
          from: `"config/${folder}/${folder}.ts"`,
          to: `"config/${folder}/${folder}.${env}.ts"`,
        },
      ];
    });

    // Flatten all of our mappings into a single array
    const flattened = replacements.reduce((acc, val) => acc.concat(val), []);

    // See if there's a base env local file to use
    const shouldUseLocalTopEnv =
      !env &&
      (fs.existsSync(path.join(configPath, `env.local`)) ||
        fs.existsSync(path.join(configPath, `env.local.js`)) ||
        fs.existsSync(path.join(configPath, `env.local.ts`)) ||
        fs.existsSync(path.join(configPath, `env.local.tsx`)) ||
        fs.existsSync(path.join(configPath, `env.local.jsx`)));

    // Generate mappings for the top level env file. This is a legacy support
    // feature.
    const mapTopEnv = shouldUseLocalTopEnv
      ? // Use the local env file if it exists
        [
          { from: '"config/env"', to: `"config/env.local"` },
          { from: '"config/env.js"', to: `"config/env.local.js"` },
          { from: '"config/env.ts"', to: `"config/env.local.ts"` },
        ]
      : env
      ? // Use the correct environment when specified
        [
          { from: '"config/env"', to: `"config/env.${env}"` },
          { from: '"config/env.js"', to: `"config/env.${env}.js"` },
          { from: '"config/env.ts"', to: `"config/env.${env}.ts"` },
        ]
      : // If no environment was specified, no mapping should happen
        [];

    const allMappings = [
      // Support env from the root of the config folder
      ...mapTopEnv,
      // Support any folder environments
      ...flattened,
    ];

    // Log the mapping configuration in use
    if (allMappings.length > 0) {
      console.warn(`

  ${chalk.yellowBrightBold("Using the following mappings for app config:")}

  \t${chalk.cyanBrightBold(
    allMappings.map((m) => `\n  ${m.from} => ${m.to}`).join("\n\t")
  )}

      `);
    }

    return viteDevopsStringReplacePlugin(allMappings);
  } catch (e) {
    console.error(e);
    console.error(
      chalk.redBrightBold(`
      App config plugin failed to load. The default config paths will be used
      and any specific environment requested will be ignored.
    `)
    );
  }
}
