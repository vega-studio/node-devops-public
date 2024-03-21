import url from "url";
import path from "path";
import fs from "fs-extra";
import { chalk } from "../util/chalk.js";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

/**
 * This returns a full path to the specified template file. The templatePath
 * entered will be relative to the template folder itself or pick up on template
 * overrides.
 *
 * This will response to the environment variable:
 *
 * NO_OVERRIDE_TEMPLATES=true
 *
 * which prevents this method from looking at any override files which is useful
 * for making operations that run this method in deeply nestedt structures to
 * all have a reliable path to the base template files.
 *
 * If the file does not exist this will return null.
 */
export function getTemplateFile(...templatePath: string[]) {
  // First check for overrides in the target project
  let p = path.resolve("template", path.join(...templatePath));

  if (process.env.NO_OVERRIDE_TEMPLATES !== "true" && fs.existsSync(p)) {
    console.warn(
      "Retrieving override template at path:",
      chalk.cyanBrightBold(p)
    );
    return p;
  }

  // If no overrides, use the template pathing when in the node devops project
  p = path.resolve(__dirname, path.join(...templatePath));

  if (fs.existsSync(p)) {
    console.warn(
      "Retrieving node-devops template at path:",
      chalk.cyanBrightBold(p)
    );
    return p;
  }

  // If we are not in node-devops we check the distribution path
  p = path.resolve(__dirname, "template", path.join(...templatePath));

  if (fs.existsSync(p)) {
    console.warn("Retrieving template at path:", chalk.cyanBrightBold(p));
    return p;
  }

  return null;
}
