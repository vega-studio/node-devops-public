import { TemplateSync } from "../sync-template-to-target";
import path from "path";

export default async () =>
  ({
    defaultTargetPath: path.resolve("./"),
    fileMap: [
      [
        "./templates/page.template",
        "./app/client/pages/${{page: kebab}}/${{page: kebab}}.page.tsx",
      ],
      [
        "./templates/scss.template",
        "./app/client/pages/${{page: kebab}}/${{page: kebab}}.page.scss",
      ],
    ],
    paramPrompts: async () => {
      return {
        page: "Enter a name for the page:",
      };
    },
  }) as TemplateSync;
