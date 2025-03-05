import { getAllCopiedTemplateFilePaths } from "./get-all-copied-template-file-paths.js";
import fs from "fs-extra";
import path from "path";
import { isDefined } from "../util/types.js";
import readline from "readline";
import { PromiseResolver } from "../util/promise-resolver.js";
import { processTemplate } from "../util/template.js";
import { stringToComment } from "../util/string-to-comment.js";
import { chalk } from "../util/chalk.js";

/**
 * Trim but only on the start of the string.
 */
function leftTrim(str: string) {
  return str.replace(/^\s+/, "");
}

/**
 * Takes any files that match the output of a template and copies them to the
 * base template directory. This is primarily used to aid in developing a
 * template.
 *
 * This is currently for developing within the devops project only and should
 * not be used in a real target project.
 */
export async function syncTargetToTemplate(
  templateId: string,
  targetDirectory: string | null = null
) {
  // Get our paths showing every file the template specifies that exists in the
  // target project.
  const allTargetFiles = await getAllCopiedTemplateFilePaths(
    templateId,
    targetDirectory,
    {}
  );

  // Get all of the immediate folders the template files are copied to. We
  // exclude the root folder itself.
  const projectRoot = path.resolve(".");
  const uniqueFolders = new Set<string>();
  const syncedFiles = new Set<string>();

  const allTargetFolders: [string, string][] = allTargetFiles
    .map<[string, string] | null>(([targetPath, sourcePath]) => {
      const targetDir = path.dirname(targetPath);

      if (uniqueFolders.has(targetDir)) return null;
      uniqueFolders.add(targetDir);

      return [targetDir, path.dirname(sourcePath)];
    })
    .filter((folder) => {
      return folder && folder[0] !== projectRoot;
    })
    .filter(isDefined);

  const writeFile = async (file: string, sourcePath: string) => {
    // Read in the file so we can examine the first line in the file
    const resolver = new PromiseResolver<string>();

    try {
      const readStream = fs.createReadStream(file);
      const reader = readline.createInterface({ input: readStream });
      let line = "";

      reader.on("line", (l) => {
        line = l;
        reader.close();
      });

      reader.on("close", () => {
        readStream.close();
        resolver.resolve(line);
      });
    } catch (err) {
      console.error("Can not read file:", file);
      if (err instanceof Error) {
        throw new Error(err.stack || err.message);
      }
    }

    // Wait for the line to be read
    const line = await resolver.promise;
    let baseFilePath = "";

    // Now we throw the line through the template helper to get the tokens in
    // the line, the token found should be a file path.
    processTemplate({
      template: line,
      options: {},
      doubleCurlyBrackets: true,

      onToken: (token) => {
        const splits = token.split(":");
        baseFilePath = splits.slice(1).join(":").trim();
        return token;
      },
    });

    // See if the token is a valid file path. If so, we will write the file to
    // that location. We will save the contents of the file but we will
    // exclude the first line as it's a token.
    if (fs.existsSync(baseFilePath)) {
      fs.ensureDirSync(path.dirname(baseFilePath));
      console.log("[Sync]", baseFilePath);
      const contents = fs.readFileSync(file, "utf8");
      // Write the file without the header back to the template
      fs.writeFileSync(baseFilePath, leftTrim(contents.split(line)[1]));
    }

    // If the token is not found or is not a file path, then we will copy the
    // file to the source path we have specified. We will also add the new
    // base file's path created to the first line to the target file to keep
    // the file synced up with the template.
    else {
      console.warn(
        chalk.yellowBrightBold("[New]"),
        chalk.cyanBrightBold(sourcePath)
      );
      fs.ensureDirSync(path.dirname(sourcePath));
      // Copy the file to the source path
      fs.copySync(file, sourcePath);

      // Read the contents of the file and add the base file path to the first
      // line of the file.
      const contents = fs.readFileSync(file, "utf8");
      fs.writeFileSync(
        file,
        `${stringToComment(
          `$\{{${templateId}:${sourcePath}}}`,
          path.extname(file)
        )}\n${contents}`
      );
    }

    // Indicate this file has been synced back
    syncedFiles.add(file);
  };

  // Copy the contents of the target files into the specified base path.
  for (const [targetPath, sourcePath] of allTargetFolders) {
    // Target must exist. The template sync objects included templates and clean
    // outs can cause some specified target files to no longer be around.
    if (!fs.existsSync(targetPath)) continue;

    // Read the contents of the folder.
    let directoryContents = fs
      .readdirSync(targetPath)
      .map((file) => [
        path.join(targetPath, file),
        path.join(sourcePath, file),
      ]);

    // Loop through each file and copy it to the base template. We will analyze
    // each file for a header from the templating system and use it to determine
    // which base file to copy it to.
    for (let i = 0; i < directoryContents.length; i++) {
      const [target, source] = directoryContents[i];

      // The target file needs to exist.
      if (!fs.existsSync(target)) continue;

      // If the file is a directory, we just add the directory contents to the
      // list we are processing
      if (fs.statSync(target).isDirectory()) {
        const subdirectory = fs
          .readdirSync(target)
          .map((f) => [path.join(target, f), path.join(source, f)]);

        directoryContents = directoryContents.concat(subdirectory);
      } else {
        await writeFile(target, source);
      }
    }
  }

  // We now have to ensure all files have been synced back. If they have not
  // they need to be copied over as well. These missed files could be files
  // synced to the project root or other edge cases.
  for (const [target, source] of allTargetFiles) {
    // If synced no need to do anything more
    if (syncedFiles.has(target)) continue;
    // Make sure the file exists
    if (!fs.existsSync(target)) continue;
    // Let's sync the file to it's source
    await writeFile(target, source);
  }

  // Last: let's examine the files that should exist in the source but are no
  // longer in the target. We will consider those files to have been deleted.
  for (const [target, source, id] of allTargetFiles) {
    // If synced no need to do anything more
    if (syncedFiles.has(target)) continue;

    // If the base exists, but the target does not we delete. We also can ONLY
    // delete if the source specified is from the template we are editing
    if (fs.existsSync(source) && !fs.existsSync(target) && id === templateId) {
      console.warn(chalk.redBrightBold("[DELETE]"), source);
      fs.removeSync(source);
    }
  }
}
