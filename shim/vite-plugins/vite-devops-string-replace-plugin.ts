import * as Vite from "vite";
import fs from "fs";
import path from "path";

export function viteDevopsStringReplacePlugin(
  replacements: { from: string; to: string }[]
): Vite.PluginOption {
  return {
    name: "vite-devops-string-replace-plugin",
    enforce: "pre",

    load(id: string) {
      const filePath = path.resolve(id);
      // Determine appropriate MIME type
      const extensions = [".ts", ".js", ".tsx", ".jsx"];

      // If the extension type was established, this resource will be base64 inlined.
      if (
        fs.existsSync(filePath) &&
        extensions.includes(path.extname(filePath)) &&
        !filePath.includes("node_modules") &&
        !filePath.includes("\x00")
      ) {
        let code = fs.readFileSync(filePath, { encoding: "utf-8" });
        // Replace the discovered string in the code
        replacements.forEach((replacement) => {
          code = code.replace(replacement.from, replacement.to);
        });

        return code;
      }
    },
  };
}
