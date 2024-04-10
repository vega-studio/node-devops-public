import * as react from "@vitejs/plugin-react";
import * as Vite from "vite";
export interface IDevopsPlugins {
    react?: (available: react.Options) => react.Options;
}
/**
 * This provides ALL of the plugins that devops expects for vite to work
 * correctly.
 */
export declare function useDevopsPlugins(options?: IDevopsPlugins): Promise<Vite.PluginOption[]>;
