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
import { buildTemplateSyncContext } from "./build-template-sync-context.js";
import { type TemplateSync } from "./types.js";
import { getTemplateSyncObject } from "./get-template-sync-object.js";
import { processAITemplate } from "../ai/process-ai-template.js";

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
  templateParams: Record<string, string | undefined>;
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
   * When set, the AI prompts included in templates will be processed and
   * utilized. When not set, the AI prompts in the template will simply be
   * stripped out.
   */
  useAIFeatures?: boolean;

  /**
   * This provides a means for adjusting a token replacement after all
   * transforms have taken place to allow for special behaviors like specific
   * tokens not honoring the requested case type.
   */
  transformToken?: (
    token: string[],
    value: string,
    suggested: string,
    options: Record<string, string | undefined>
  ) => string;
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
  useAIFeatures = false,
  transformToken,
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

  // Generate our template sync context to pass to our template sync functions
  // from the template file.
  const ctx = await buildTemplateSyncContext();

  // If there is an index file, load it and see if it exports a TemplateSync
  // object.
  let templateSync: TemplateSync = await getTemplateSyncObject(templateId, ctx);

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
        paramPrompts,
        templateSync.transformToken || transformToken
      )
    ).result;
    const targetWithParams = (
      await caseTransformTokens(
        templateParams,
        target,
        target,
        true,
        false,
        paramPrompts,
        templateSync.transformToken || transformToken
      )
    ).result;
    // Generate the paths that will take place here
    const sourcePath = path.join(templateDirectoryPath, sourceWithParams);
    const targetPath = path.join(targetDirectory, targetWithParams);
    // Get all files based on these paths from the source (it may be a
    // directory)
    const sourceFiles = await getAllFiles(sourcePath);

    for (let k = 0, kMax = sourceFiles.length; k < kMax; ++k) {
      const filePath = sourceFiles[k];
      const relativePath = path.relative(sourcePath, filePath);
      const targetFilePath = path.join(targetPath, relativePath);

      // Ignore certain file target names
      if (targetFilePath.includes(".DS_Store")) continue;

      // Push the paths to the final file map
      finalFileMap.push([filePath, targetFilePath]);
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
        paramPrompts,
        templateSync.transformToken || transformToken
      )
    ).result;
    // Ensure the directory for the target file exists
    await fs.ensureDirSync(path.dirname(target));
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
        paramPrompts,
        templateSync.transformToken || transformToken
      )
    ).result;
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

  // If AI features are enabled, then we will process each file AGAIN, but this
  // time with the AI template processor.
  if (useAIFeatures) {
  }

  // If AI features are NOT enabled, then we simply perform processing of the
  // template to strip out any AI prompts.
  else {
    writtenFiles.map(([targetPath]) => {
      // Read the generate file from the template and strip out any AI
      // prompting.
      processAITemplate({
        template: fs.readFileSync(targetPath, "utf8"),
        stripAI: true,
      });
    });
  }

  if (openWrittenFiles) {
    await wait(100);
    await openFile(writtenFiles.map(([targetPath]) => targetPath));
  }

  templateSync.syncComplete?.(writtenFiles, ctx, templateParams);
  return writtenFiles;
}
