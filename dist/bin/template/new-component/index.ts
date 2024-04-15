import { TemplateSync } from "../sync-template-to-target";
import path from "path";

export default async () =>
  ({
    defaultTargetPath: path.resolve("./"),
    fileMap: [
      [
        "./templates/component.template",
        "./ui/components/${{category: kebab}}/${{component: kebab}}/${{component: kebab}}.tsx",
      ],
      [
        "./templates/scss.template",
        "./ui/components/${{category: kebab}}/${{component: kebab}}/${{component: kebab}}.scss",
      ],
      [
        "./templates/story.template",
        "./ui/stories/components/${{category: kebab}}/${{component: kebab}}.stories.tsx",
      ],
      [
        "./templates/props.template",
        "./ui/stories/data/${{category: kebab}}/${{component: kebab}}-props.tsx",
      ],
    ],
  }) as TemplateSync;
