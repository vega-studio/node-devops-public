import * as Vite from "vite";
/**
 * Generates a vite config suitable for running a Vite.build operation. The
 * various available targets modifies the behavior to target different folders.
 */
export declare function buildViteConfig(): Promise<Vite.UserConfig>;
