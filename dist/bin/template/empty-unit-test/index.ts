import { TemplateSync } from "../types.js";
import path from "path";

export default async () =>
  ({
    defaultTargetPath: path.resolve("./"),
    fileMap: [["./example.test.ts", "./unit-test/example.test.ts"]],
  }) as TemplateSync;
