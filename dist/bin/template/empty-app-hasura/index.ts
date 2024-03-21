import { TemplateSync } from "../sync-template-to-target.js";
import path from "path";

export default async (): Promise<TemplateSync> => ({
  defaultTargetPath: path.resolve("./"),
  includeTemplates: ["empty-app"],
  fileMap: [
    ["./root", "./"],
    ["./dts", "./dts"],
    ["./client", "./app/client"],
    ["./server", "./app/server"],
  ],
  cleanup: ["./app/client/api/rest", "./app/client/api/validation"],
});
