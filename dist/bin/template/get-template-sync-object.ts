import { description } from "../util/description.js";
import { getTemplateFile } from "./get-template-file.js";
import {
  isTemplateSync,
  type TemplateSync,
  type TemplateSyncContext,
} from "./types.js";

/**
 * Retrieves the template sync object from a template folder structure.
 *
 * This throws errors if invalid paths are used or of the template specified is
 * not configured correctly.
 */
export async function getTemplateSyncObject(
  templateDirectory: string,
  ctx: TemplateSyncContext
) {
  // Look at the directory indicated to be the template directory and see if
  // there is an index file to load.
  let templateIndexPath = getTemplateFile(templateDirectory, "index.js");

  if (!templateIndexPath) {
    templateIndexPath = getTemplateFile(templateDirectory, "index.ts");

    if (!templateIndexPath) {
      console.error(description`
        Specified template is not a valid template folder: ${templateIndexPath}
        There must be an index.ts file that exports a default TemplateSync object.
      `);
      throw new Error("Invalid template directory.");
    }
  }

  let templateSync: TemplateSync = {};
  const templateIndex = await import(templateIndexPath);
  let check = templateIndex.default;

  // See if an async config object is provided.
  if (check instanceof Function) {
    check = await check(ctx);
  }

  if (isTemplateSync(check)) {
    templateSync = check;
  } else {
    console.error(description`
      Specified template is not a valid template folder: ${templateIndexPath}
      The index.ts file must export a default TemplateSync object.
    `);
    throw new Error("Invalid template directory.");
  }

  return templateSync;
}
