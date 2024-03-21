import { TemplateSync } from "../sync-template-to-target.js";
import path from "path";

export default async () =>
  ({
    defaultTargetPath: path.resolve("./"),
    fileMap: [["./example.test.ts", "./unit-test/example.test.ts"]],
  }) as TemplateSync;
