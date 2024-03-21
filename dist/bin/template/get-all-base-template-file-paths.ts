import { getAllFiles } from "../file-management/get-all-files.js";
import { caseTransformTokens } from "./case-transform-tokens.js";
import { getTemplateFile } from "./get-template-file.js";
import { getTemplateSyncObject } from "./sync-template-to-target.js";
import path from "path";

/**
 * Gets ALL files relevant to a template that exists in the target project.
 *
 * The template path passed in is relative to the template directory as this
 * uses the getTemplateFile function to get the absolute path to the template.
 *
 * The result will be tuples of the [target path, source path] for each file
 * that exists in the target project.
 */
export async function getAllBaseTemplateFilePaths(
  templatePath: string,
  templatePathParams: Record<string, string>,
  excludeIncludedTemplates = false,
  out: string[] = []
) {
  // Retrieve the sync object (all errors handled in the method called)
  const templateSync = await getTemplateSyncObject(templatePath);
  // This will contain all of the results of this operation.
  const result: string[] = out;

  // First get all of the files from the included templates
  if (!excludeIncludedTemplates) {
    const includeTemplates = templateSync.includeTemplates || [];

    for (const included of includeTemplates) {
      await getAllBaseTemplateFilePaths(
        included,
        templatePathParams,
        excludeIncludedTemplates,
        result
      );
    }
  }

  // Now get all of the files from the file map
  const added = new Set<string>(result);
  const fileMap = templateSync.fileMap || [];

  // Get the directory path. We KNOW it's defined because the sync object
  // retrieval passed
  const templateDirectoryPath = getTemplateFile(templatePath);
  if (!templateDirectoryPath) throw Error("Unexpected Error!");

  for (const [source] of fileMap) {
    // Apply the path params to our paths to generate the real path we need. If
    // any tokens in the path are missed we error and quit.
    const sourceWithParams = caseTransformTokens(
      templatePathParams,
      source,
      source,
      true,
      false
    ).template;
    // Generate the paths that will take place here
    const sourcePath = path.join(templateDirectoryPath, sourceWithParams);
    // Get all files based on these paths from the source (it may be a
    // directory)
    const sourceFiles = await getAllFiles(sourcePath);

    for (let k = 0, kMax = sourceFiles.length; k < kMax; ++k) {
      const filePath = sourceFiles[k];

      // Push the paths to the final file map
      if (!added.has(filePath)) {
        added.add(filePath);
        result.push(filePath);
      }
    }
  }

  return result;
}
