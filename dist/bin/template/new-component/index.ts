import { TemplateSync } from "../sync-template-to-target";
import path from "path";

export default async () =>
  ({
    defaultTargetPath: path.resolve("./"),
    fileMap: [
      [
        "./templates/component.template",
        "./ui/components/${{category}}/${{component}}/${{component}}.tsx",
      ],
      [
        "./templates/scss.template",
        "./ui/components/${{category}}/${{component}}/${{component}}.scss",
      ],
      [
        "./templates/story.template",
        "./ui/stories/components/${{category}}/${{component}}.stories.tsx",
      ],
      [
        "./templates/props.template",
        "./ui/stories/data/${{category}}/${{component}}-props.tsx",
      ],
    ],
  }) as TemplateSync;
