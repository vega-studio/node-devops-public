import * as Vite from "vite";
import fs from "fs";
import path from "path";
import { chalk } from "../../bin/lib/util/chalk.js";

/**
 * Performs a splice operation like an array on a string. Does not mutate
 * original string.
 */
function spliceStr(str: string, index: number, count: number, add?: string) {
  // We cannot pass negative indexes directly to the 2nd slicing operation.
  if (index < 0) {
    index = str.length + index;
    if (index < 0) {
      index = 0;
    }
  }

  return str.slice(0, index) + (add || "") + str.slice(index + count);
}

/**
 * Removes comments from a valid shader file
 */
function removeComments(str: string) {
  // We now must count valid context brackets till we find a bracket that would close the context of the main
  // body.
  let insideMultilineComment = false;
  let insideSingleLineComment = false;

  const comments = [];
  let currentMultiline = { start: -1, stop: -1 };
  let currentSingleLine = { start: -1, stop: -1 };

  // When openBracket === close bracket, we have the location of the end of the body of the main method
  for (let i = 0, iMax = str.length; i < iMax; ++i) {
    const char = str[i];
    const nextChar = str[i + 1];

    // Analyze each character for comments and valid bracket contexts
    switch (char) {
      case "/":
        switch (nextChar) {
          case "*":
            if (!insideSingleLineComment && !insideMultilineComment) {
              currentMultiline.start = i;
              insideMultilineComment = true;
              i++;
            }
            break;

          case "/":
            if (!insideMultilineComment && !insideSingleLineComment) {
              currentSingleLine.start = i;
              insideSingleLineComment = true;
              i++;
            }
            break;
        }
        break;

      case "*":
        if (nextChar === "/") {
          if (insideMultilineComment) {
            currentMultiline.stop = i + 2;
            comments.push(currentMultiline);
            currentMultiline = { start: -1, stop: -1 };
            insideMultilineComment = false;
            i++;
          }
        }
        break;

      case "\n":
      case "\r":
        if (insideSingleLineComment) {
          // console.log('STOP SINGLE LINE');
          currentSingleLine.stop = i;
          comments.push(currentSingleLine);
          currentSingleLine = { start: -1, stop: -1 };
          insideSingleLineComment = false;
        }
        break;
    }
  }

  // Our indices discoveredare ascending in nature, so we must remove them descending
  comments.reverse();

  comments.forEach((comment) => {
    str = spliceStr(str, comment.start, comment.stop - comment.start);
  });

  return str;
}

/**
 * This reduces the amount of empty space used in the shader
 */
function removeSpace(str: string) {
  // All tabs are now single spaces
  str = str.replace(/\t/g, " ");
  // Space followed by multiple spaces are reduced to a single space
  str = str.replace(/  +/gm, " ");
  // Space followed by new lines are reduced to a single new line
  str = str.replace(/ (\n|\r)+/gm, "\n");
  // Newline followed by multiple newlines are reduced to a newline
  str = str.replace(/(\n|\r)(\n|\r)+/gm, "\n");
  // Newline folloed by spaces are reduced to a newline
  str = str.replace(/(\n|\r) +/gm, "\n");

  // No trailing or leading whitespace
  return str.trim();
}

/**
 * A simple loader to manipulate a shader that is being loaded into the bundle
 */
function compressShader(source: string) {
  const noComments = removeComments(source);
  const noSpaces = removeSpace(noComments);

  return makeExport(noSpaces);
}

function makeExport(source: string) {
  const json = JSON.stringify(source)
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029")
    // Escape template literals as this is a syntax used in deltav for
    // templating strings
    .replace(/\$\{/gm, "$\\{");

  return `export default \`${json.slice(1, json.length - 1)}\`;`;
}

/**
 * A plugin that imports shader files (vs and fs) and makes them available as a
 * string. In Production mode, this will remove comments and excess whitespace.
 * In development mode, this will simply return the shader file as a string.
 */
export function viteDevopsShaderCompressionPlugin(): Vite.PluginOption {
  return {
    name: "vite-devops-shader-compression-plugin",
    enforce: "pre",

    load(id) {
      const filePath = path.resolve(id);
      // Determine appropriate MIME type
      const extensions = [".vs", ".fs"];

      // If the extension type was established, this resource will be base64 inlined.
      if (
        fs.existsSync(filePath) &&
        extensions.includes(path.extname(filePath)) &&
        !filePath.includes("node_modules") &&
        !filePath.includes("\x00")
      ) {
        const code = fs.readFileSync(filePath, { encoding: "utf-8" });

        if (process.env.NODE_ENV === "development") {
          console.warn(
            "Not compressing shader:",
            chalk.cyanBrightBold(path.basename(filePath))
          );

          return makeExport(code);
        }

        console.warn("Compressing shader:", chalk.cyanBrightBold(filePath));
        return compressShader(code);
      }
    },
  };
}
