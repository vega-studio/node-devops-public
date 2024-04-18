import { getAllFiles } from "../file-management/get-all-files.js";
import { caseTransformTokens } from "./case-transform-tokens.js";
import { getTemplateFile } from "./get-template-file.js";
import { getTemplateSyncObject } from "./get-template-sync-object.js";
import path from "path";
import fs from "fs";
import { buildTemplateSyncContext } from "./build-template-sync-context.js";

/**
 * Gets ALL files relevant to a template that exists in the target project.
 *
 * The template path passed in is relative to the template directory as this
 * uses the getTemplateFile function to get the absolute path to the template.
 *
 * The result will be tuples of the [target path, source path] for each file
 * that exists in the target project.
 */
export async function getAllCopiedTemplateFilePaths(
  templateId: string,
  targetDirectory: string | null,
  templatePathParams: Record<string, string>,
  out: [string, string, string][] = []
) {
  // Build the context for the template so it has all the resources necessary to
  // generate the template.
  const ctx = await buildTemplateSyncContext();
  // Retrieve the sync object (all errors handled in the method called)
  const templateSync = await getTemplateSyncObject(templateId, ctx);
  // This will contain all of the results of this operation.
  const result: [string, string, string][] = out;
  // First get all of the files from the included templates
  const includeTemplates = templateSync.includeTemplates || [];

  for (const included of includeTemplates) {
    await getAllCopiedTemplateFilePaths(
      included,
      targetDirectory,
      templatePathParams,
      result
    );
  }

  // Now get all of the files from the file map
  const fileMap = templateSync.fileMap || [];
  const finalFileMap: [string, string][] = [];
  // Get the directory path. We KNOW it's defined because the sync object
  // retrieval passed
  const templateDirectoryPath = getTemplateFile(templateId);
  if (!templateDirectoryPath) throw Error("Unexpected Error!");
  targetDirectory = targetDirectory || templateSync.defaultTargetPath || null;

  for (const [source, target] of fileMap) {
    // Apply the path params to our paths to generate the real path we need. If
    // any tokens in the path are missed we error and quit.
    const sourceWithParams = (
      await caseTransformTokens(templatePathParams, source, source, true, false)
    ).template;
    const targetWithParams = (
      await caseTransformTokens(templatePathParams, target, target, true, false)
    ).template;
    // Generate the paths that will take place here
    const sourcePath = path.join(templateDirectoryPath, sourceWithParams);
    const targetPath = path.join(targetDirectory || "", targetWithParams);
    // Get all files based on these paths from the source (it may be a
    // directory)
    const sourceFiles = await getAllFiles(sourcePath);

    for (let k = 0, kMax = sourceFiles.length; k < kMax; ++k) {
      const filePath = sourceFiles[k];
      const relativePath = path.relative(sourcePath, filePath);
      // Push the paths to the final file map
      finalFileMap.push([filePath, path.resolve(targetPath, relativePath)]);
    }
  }

  // Last filter out only existing files on the file system
  finalFileMap.forEach(([source, target]) => {
    if (fs.existsSync(source)) result.push([target, source, templateId]);
  });

  return result;
}
