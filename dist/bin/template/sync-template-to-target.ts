import { getTemplateFile } from "./get-template-file.js";
import { description } from "../util/description.js";
import {
  caseTransformFileTokens,
  caseTransformTokens,
} from "./case-transform-tokens.js";
import path from "path";
import fs from "fs-extra";
import { getAllFiles } from "../file-management/get-all-files.js";
import { promptConfirm } from "../prompt/prompt-confirm.js";
import { promptDiffFile } from "../prompt/prompt-diff-file.js";
import { chalk } from "../util/chalk.js";
import { stringToComment } from "../util/string-to-comment.js";
import { wait } from "../util/wait.js";
import { openFile } from "../file-management/open-file.js";

/**
 * Expected type from an index.ts file in a template directory. All of the paths
 * specified in this can target input parameters in their file paths.
 *
 * You would use them like this:
 * "path/to/file/${{parameter name}}/file.${{another parameter name}}.ts"
 *
 * Specifying the parameters makes them REQUIRED when the template is used.
 * Parameters that are not fulfilled will trigger an error. This ensures the
 * caller fulfills all of the parameters AND the template will satisfy all of
 * caller's parameters making it a two way contract that helps prevent bugs.
 */
export type TemplateSync = {
  /**
   * The template can suggest a target path for the installation. If one is
   * provided by the caller of the sync, this will be ignored.
   */
  defaultTargetPath?: string;
  /**
   * Inject additional parameters into the template file contents. These values
   * will override any parameters passed in from the caller of the sync method.
   */
  templateParams?: Record<string, string>;
  /**
   * This sets up input prompts for the user when a parameter is encountered that
   * the system does not provide a value for. The key is the parameter/token
   * name and the value is the prompt message or a message and default values.
   */
  paramPrompts?:
    | Record<string, string | { message: string; default: string | string[] }>
    | (() => Promise<
        Record<string, string | { message: string; default: string | string[] }>
      >);
  /**
   * This triggers syncing other templates before syncing this template.
   *
   * Use absolute paths here (use getTemplateFile)
   */
  includeTemplates?: string[];
  /**
   * This is a list of where the files for this template should go. It is a list
   * of tuples where:
   *
   * [path relative to template directory, path relative to target directory]
   */
  fileMap?: [string, string][];
  /**
   * This specifies files to delete. This will be relative to the target
   * directory.
   */
  cleanup?: string[];
};

export type AsyncTemplateSync = () => Promise<TemplateSync>;

/**
 * Typeguard for the TemplateSync type.
 */
export function isTemplateSync(obj: any): obj is TemplateSync {
  return (
    obj &&
    (Array.isArray(obj.includeTemplates) ||
      Array.isArray(obj.fileMap) ||
      Array.isArray(obj.cleanup))
  );
}

/**
 * Retrieves the template sync object from a template folder structure.
 *
 * This throws errors if invalid paths are used or of the template specified is
 * not configured correctly.
 */
export async function getTemplateSyncObject(templateDirectory: string) {
  // Look at the directory indicated to be the template directory and see if
  // there is an index file to load.
  const templateIndexPath = getTemplateFile(templateDirectory, "index.ts");

  if (!templateIndexPath) {
    console.error(description`
      Specified template is not a valid template folder: ${templateIndexPath}
      There must be an index.ts file that exports a default TemplateSync object.
    `);
    throw new Error("Invalid template directory.");
  }

  let templateSync: TemplateSync = {};
  const templateIndex = await import(templateIndexPath);
  let check = templateIndex.default;

  // See if an async config object is provided.
  if (check instanceof Function) {
    check = await check();
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

/**
 * Options for the syncTemplateToTarget helper method.
 */
export interface ISyncTemplateToTarget {
  /**
   * Name of the template. This is the folder name as the template appears in
   * the template directory.
   */
  templateId: string;
  /**
   * This is the target directory that informs the relative pathing of any
   * target paths the template specifies.
   */
  targetDirectory: string;
  /**
   * These are the parameter options we pass into the template content of each
   * file.
   *
   * ie- we pass in { test: "value" } the file itself can now use:
   * class ${{test: pascal}} { ... }
   */
  templateParams: Record<string, string>;
  /**
   * When true, the method won't ask for certain confirmations and will run with
   * less user checks.
   */
  suppressVerbosePrompts?: boolean;
  /**
   * THis specifically suppresses the starting confirmation prompt asking if the
   * user wishes to proceed.
   */
  suppressConfirmations?: boolean;
  /**
   * This suppresses prompts when a file already exists in the target directory
   * and the template is trying to override it.
   */
  suppressOverridePrompts?: boolean;
  /**
   * When set to true, the files that get copied will be given an identifier tag
   * that shows which template Id the file originates from. This is good for
   * debugging and is used for syncing changes made in a used template back to
   * the base template files.
   */
  includeTemplateIdTag?: boolean;
  /**
   * When set, this will automatically open the written files in the editor.
   */
  openWrittenFiles?: boolean;

  /**
   * This provides a means for adjusting a token replacement after all
   * transforms have taken place to allow for special behaviors like specific
   * tokens not honoring the requested case type.
   */
  onTokenReplace?: (token: string, value: string) => string;
}

/**
 * Copies the template files from the target project to the template project.
 *
 * This also looks for an index.ts in the template directory which can export a
 * list of path mappings that specifies specific instructions on copying files.
 *
 * The mapping can also include other templates syncs to perform.
 *
 * @returns This returns tuples of the files that were written. [target, source]
 */
export async function syncTemplateToTarget({
  templateId,
  targetDirectory,
  templateParams,
  suppressVerbosePrompts = false,
  suppressConfirmations = false,
  suppressOverridePrompts = false,
  includeTemplateIdTag = false,
  openWrittenFiles = false,
}: ISyncTemplateToTarget) {
  // Look at the directory indicated to be the template directory and see if
  // there is an index file to load.
  const templateDirectoryPath = getTemplateFile(templateId);

  if (!templateDirectoryPath) {
    console.error(description`
      The template path specified ${templateId} does not exist in the
      template directory or overriding directories. Please check the path and
      try again.
    `);
    process.exit(1);
  }

  // If there is an index file, load it and see if it exports a TemplateSync
  // object.
  let templateSync: TemplateSync = await getTemplateSyncObject(templateId);

  if (!suppressVerbosePrompts) {
    console.warn(description`

      Syncing template:
        ${chalk.cyanBrightBold(templateId)}
      ${
        (templateSync.includeTemplates?.length || 0) > 0
          ? `This template includes additional templates:
      ${chalk.cyanBrightBold(
        templateSync.includeTemplates?.map((t) => `  ${t}`).join("\n") || ""
      )}\n`
          : ""
      }
      You can use these identifiers in the 'npm run template <command> <target>'
      style commands to perform template specific tasks.
    `);
  }

  if (!suppressVerbosePrompts && !suppressConfirmations) {
    const shouldContinue = await promptConfirm(description`
      The process will now begin copying template files to target locations.
      Proceeding will create prompts requesting overrides to any existing files
      which can get rather lengthy (all overrides will default to NO), and any
      files that don't exist will get written without prompt.
      Continue?
    `);

    if (!shouldContinue) {
      console.warn("adios!");
      process.exit(1);
    }
  }

  const paramPrompts =
    typeof templateSync.paramPrompts === "function"
      ? await templateSync.paramPrompts()
      : templateSync.paramPrompts;

  // Apply the additional path params and template params to the provided path
  // and template param objects. Also, make them new objects so we don't mutate
  // the input.
  templateParams = {
    ...templateParams,
    ...(templateSync.templateParams || {}),
  };

  // Now that we have a valid template sync object, we can begin the sync.
  // We start by first seeing if there are any other templates to sync before
  // this one.
  const includeTemplates = templateSync.includeTemplates || [];
  // We keep track of all files written as a result of this operation and will
  // NOT trigger an override prompt for these files when this operation runs as
  // this template expects to override them.
  const ignoreOverride = new Set<string>();

  for (const template of includeTemplates) {
    const files = await syncTemplateToTarget({
      templateId: template,
      targetDirectory,
      templateParams,
      suppressVerbosePrompts: true,
      suppressOverridePrompts,
      suppressConfirmations,
      includeTemplateIdTag,
    });

    files.forEach(([target]) => ignoreOverride.add(target));
  }

  // Next we perform the file mappings specified
  const fileMap = templateSync.fileMap || [];
  const finalFileMap: [string, string][] = [];

  for (const [source, target] of fileMap) {
    // Apply the path params to our paths to generate the real path we need. If
    // any tokens in the path are missed we error and quit.
    const sourceWithParams = (
      await caseTransformTokens(
        templateParams,
        source,
        source,
        true,
        false,
        paramPrompts
      )
    ).template;
    const targetWithParams = (
      await caseTransformTokens(
        templateParams,
        target,
        target,
        true,
        false,
        paramPrompts
      )
    ).template;
    // Generate the paths that will take place here
    const sourcePath = path.join(templateDirectoryPath, sourceWithParams);
    const targetPath = path.join(targetDirectory, targetWithParams);
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

  // Take the paths we have generated and validated and perform the template
  // transforms and copy the results to the target path.
  const writtenFiles: [string, string][] = [];

  for (const [source, target] of finalFileMap) {
    // Read in the source file and perform the template token injection
    const contents = (
      await caseTransformFileTokens(
        templateParams,
        source,
        true,
        false,
        paramPrompts
      )
    ).template;
    // Ensure the directory for the target file exists
    await fs.ensureDir(path.dirname(target));
    // Copy the contents into the target file destination, prompt for an
    // override strategy if the file already exists.
    const didWrite = await promptDiffFile(
      contents,
      target,
      description`
        The file ${target} already exists. Please select a stratetgy for
        resolving the conflict.
      `,
      ignoreOverride.has(target) || suppressOverridePrompts
    );

    // Track which files were written from this operation.
    if (didWrite) {
      if (includeTemplateIdTag) {
        console.warn(`[Sync] ${target}`);
        // Inject a comment at the top of the file that shows which base file
        // this file originated from.
        const templateIdTag = `${stringToComment(
          `$\{{${templateId}:${source}}}`,
          path.extname(target)
        )}\n`;
        // Read in the file contents
        const fileContents = fs.readFileSync(target, "utf8");
        // Write the file contents with the template id tag at the top.
        fs.writeFileSync(target, `${templateIdTag}${fileContents}`, "utf8");
      }
      writtenFiles.push([target, source]);
    }
  }

  // Last let's examine the cleanup list and delete any files that are specified
  const cleanup = templateSync.cleanup || [];

  for (const file of cleanup) {
    const fileWithParams = (
      await caseTransformTokens(
        templateParams,
        file,
        file,
        true,
        false,
        paramPrompts
      )
    ).template;
    const filePath = path.join(targetDirectory, fileWithParams);

    if (fs.existsSync(filePath)) {
      await fs.remove(filePath);
    } else {
      console.warn(description`
        Template specified a cleanup file that did not exist: ${filePath}
      `);
    }
  }

  if (!suppressVerbosePrompts) {
    console.warn(description`

      Template sync complete for ${chalk.cyanBrightBold(templateId)}.

    `);
  }

  if (openWrittenFiles) {
    await wait(100);
    await openFile(writtenFiles.map(([targetPath]) => targetPath));
  }

  return writtenFiles;
}
