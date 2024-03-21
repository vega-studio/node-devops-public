import { template } from "../util/template.js";
import * as changecase from "change-case";
import fs from "fs-extra";
import path from "path";
import { description } from "../util/description.js";
import { chalk } from "../util/chalk.js";

/**
 * This reads a template string and replaces all found tokens with the options
 * provided. This allows each token to be specified with a case change syntax:
 *
 * ${token: case type}
 *
 * Where case type can be:
 *
 * - upper
 * - lower
 * - camel
 * - pascal
 * - constant
 * - sentence
 * - header
 * - snake
 * - kebab
 * - param
 */
export function caseTransformTokens(
  options: Record<string, string>,
  templateContents: string,
  tokenId?: string,
  failOnMissingTokenInTemplate?: boolean,
  failOnMissingTokenForOptions?: boolean
) {
  const onToken = (file: string) => (match: string) => {
    match = match.trim();
    const checks = match.split(":").map((s) => s.trim());
    let result: string = options[checks[0]] || checks[0];

    if (!options[checks[0]]) {
      console.warn(
        "No available option for token specified for template file:",
        {
          file,
          match,
        }
      );

      return match;
    }

    if (!checks[1]) {
      return result;
    }

    // Look for a transform to the case
    switch (checks[1]) {
      case "upper":
        result = changecase.capitalCase(result);
        break;
      case "lower":
        result = result.toLowerCase();
        break;
      case "camel":
        result = changecase.camelCase(result);
        break;
      // case "title": result = changecase.titleCase(result); break;
      case "pascal":
        result = changecase.pascalCase(result);
        break;
      case "constant":
        result = changecase.constantCase(result);
        break;
      case "sentence":
        result = changecase.sentenceCase(result);
        break;
      case "header":
        result = changecase.trainCase(result);
        break;
      case "snake":
        result = changecase.snakeCase(result);
        break;

      case "kebab":
      case "param":
        result = changecase.kebabCase(result);
        break;

      default:
        console.warn(
          "Invalid transform specified for token within template file:",
          { file, match }
        );
        break;
    }

    return result;
  };

  // Generate all of the contents of our files by replacing the relevant terms
  const results = template({
    template: templateContents,
    options: {},
    doubleCurlyBrackets: true,
    onToken: onToken(tokenId || "Template"),
  });

  if (failOnMissingTokenInTemplate) {
    if (results.unresolvedTemplateOptions.size > 0) {
      throw new Error(description`
        Some tokens provided by the template were not resolved by the options
        provided. These need to be resolved to continue:
        Template ID: ${chalk.yellowBrightBold(tokenId || "None")}
        Tokens: ${chalk.redBrightBold(
          Array.from(results.unresolvedTemplateOptions.keys()).join(", ")
        )}
      `);
    }
  }

  if (failOnMissingTokenForOptions) {
    if (results.unresolvedProvidedOptions.size > 0) {
      throw new Error(description`
        Some tokens provided by the options were not resolved by the template.
        These need to be resolved to continue:
        Template ID: ${chalk.yellowBrightBold(tokenId || "None")}
        Tokens: ${chalk.redBrightBold(
          Array.from(results.unresolvedProvidedOptions.keys()).join(", ")
        )}
      `);
    }
  }

  return results;
}

/**
 * This loads a template file and replaces all found tokens with the options
 * provided. This allows each token to be specified with a case change syntax:
 *
 * ${token: case type}
 *
 * Where case type can be:
 *
 * - upper
 * - lower
 * - camel
 * - pascal
 * - constant
 * - sentence
 * - header
 * - snake
 * - kebab
 * - param
 */
export function caseTransformFileTokens(
  options: Record<string, string>,
  filePath: string,
  failOnMissingTokenInTemplate?: boolean,
  failOnMissingTokenForOptions?: boolean
) {
  const templateFileName = path.basename(filePath);

  return caseTransformTokens(
    options,
    fs.readFileSync(filePath, { encoding: "utf-8" }),
    templateFileName,
    failOnMissingTokenInTemplate,
    failOnMissingTokenForOptions
  );
}
