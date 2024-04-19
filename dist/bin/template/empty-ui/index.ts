import { TemplateSync } from "../types.js";
import path from "path";

export default async () =>
  ({
    defaultTargetPath: path.resolve("./"),
    fileMap: [
      ["./assets", "./ui/assets"],
      ["./components", "./ui/components"],
      ["./stories", "./ui/stories"],
      ["./root", "./ui"],
    ],
  }) as TemplateSync;
