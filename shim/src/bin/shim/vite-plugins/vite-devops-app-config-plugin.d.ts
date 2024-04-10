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
export declare function viteDevopsAppConfigPlugin(env?: string | null): import("vite").PluginOption;
