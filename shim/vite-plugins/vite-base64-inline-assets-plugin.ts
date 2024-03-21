import * as Vite from "vite";
import fs from "fs";
import path from "path";

export function viteBase64InlineAssetsPlugin(): Vite.PluginOption {
  return {
    name: "vite-base64-inline-assets-plugin",
    enforce: "pre",
    load(id: string) {
      const filePath = path.resolve(id);

      // Determine appropriate MIME type
      let mimeType;
      switch (path.extname(filePath)) {
        case ".woff":
          mimeType = "font/woff";
          break;
        case ".woff2":
          mimeType = "font/woff2";
          break;
        case ".ttf":
          mimeType = "font/ttf";
          break;
        case ".png":
          mimeType = "image/png";
          break;
        case ".jpg":
        case ".jpeg":
          mimeType = "image/jpeg";
          break;
        case ".gif":
          mimeType = "image/gif";
          break;
        case ".svg":
          mimeType = "image/svg+xml";
          break;
      }

      // If a mime type was established, this resource will be base64 inlined.
      if (mimeType) {
        const fontFile = fs.readFileSync(filePath);
        const base64Asset = fontFile.toString("base64");
        return `export default "data:${mimeType};base64,${base64Asset}"`;
      }
    },
  };
}
