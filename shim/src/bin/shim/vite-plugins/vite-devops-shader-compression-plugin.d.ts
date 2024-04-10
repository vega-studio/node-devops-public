import * as Vite from "vite";
/**
 * A plugin that imports shader files (vs and fs) and makes them available as a
 * string. In Production mode, this will remove comments and excess whitespace.
 * In development mode, this will simply return the shader file as a string.
 */
export declare function viteDevopsShaderCompressionPlugin(): Vite.PluginOption;
