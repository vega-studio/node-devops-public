import * as react from "@vitejs/plugin-react";
import * as Vite from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import path from "path";
import viteCheckerPlugin from "vite-plugin-checker";
import { viteBase64InlineAssetsPlugin } from "./vite-plugins/vite-base64-inline-assets-plugin.js";
import { viteDevopsAppConfigPlugin } from "./vite-plugins/vite-devops-app-config-plugin.js";
import { viteDevopsShaderCompressionPlugin } from "./vite-plugins/vite-devops-shader-compression-plugin.js";

export interface IDevopsPlugins {
  react?: (available: react.Options) => react.Options;
}

/**
 * This provides ALL of the plugins that devops expects for vite to work
 * correctly.
 */
export async function useDevopsPlugins(
  options?: IDevopsPlugins
): Promise<Vite.PluginOption[]> {
  const reactOptions: react.Options = {
    babel: {
      parserOpts: {
        plugins: ["decorators-legacy", "classProperties"],
      },
    },
  };
  const env = process.env.ENV_MODE;

  return [
    // Enable the import of vs and fs files with some additional bundle
    // optimizing.
    viteDevopsShaderCompressionPlugin(),
    // When the ENV_MODE is specified, we will target the specified env file for
    // the build.
    viteDevopsAppConfigPlugin(env),
    ((react?.default as any) || (react?.default?.default as any))(
      options?.react ? options?.react(reactOptions) : reactOptions
    ),
    viteBase64InlineAssetsPlugin(),
    cssInjectedByJsPlugin(),
    viteCheckerPlugin({
      typescript: {
        root: path.resolve("."),
      },
    }),
  ].filter(Boolean);
}
