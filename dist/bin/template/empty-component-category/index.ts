import { TemplateSync } from "../sync-template-to-target";
import path from "path";

export default async () =>
  ({
    defaultTargetPath: path.resolve("./"),
    fileMap: [["./root", "./ui/components/${{category: kebab}}"]],
  }) as TemplateSync;
