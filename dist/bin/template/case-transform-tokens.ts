import { template } from "../util/template.js";
import * as changecase from "change-case";
import fs from "fs-extra";
import path from "path";
import { description } from "../util/description.js";
import { chalk } from "../util/chalk.js";
import { promptTextInput } from "../prompt/prompt-text-input.js";
import { isDefined, isString } from "../util/types.js";
import { promptSelect } from "../prompt/prompt-select.js";

export type ParamPrompt =
  | string
  | { message: string; default: string | string[] };

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
 *
 * If token prompts are provided, each missing token will be prompted for
 * instead of triggering a failure.
 *
 * NOTE: If tokenPrompts is provided, the resulting answers for tokens WILL be
 * applied to the options object.
 */
export async function caseTransformTokens(
  options: Record<string, string>,
  templateContents: string,
  tokenId?: string,
  failOnMissingTokenInTemplate?: boolean,
  failOnMissingTokenForOptions?: boolean,
  tokenPrompts?: Record<string, ParamPrompt>
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

  // Let's ensure all tokens are resolved. Missing options will check to see if
  // they are allowed to be prompted for resolution.
  console.log({ tokenPrompts });
  if (tokenPrompts) {
    // Check if all missing tokens have a prompt available. If any are missing,
    // we just fail if the fail flag is set.
    const missingTokens = Array.from(results.unresolvedTemplateOptions.keys());
    let canPrompt = true;

    // Only if the fail flag is set do we check if all missing are accounted
    // for.
    if (failOnMissingTokenInTemplate) {
      for (const token of missingTokens) {
        if (!isDefined(tokenPrompts[token])) {
          canPrompt = false;
          break;
        }
      }
    }

    // If we are allowed to prompt, we prompt for each token then we re-run this
    // process.
    if (canPrompt) {
      for (const token of missingTokens) {
        const prompt = tokenPrompts[token];
        let answer: string = "";

        if (isString(prompt)) {
          answer = await promptTextInput(prompt);
        } else if (Array.isArray(prompt.default)) {
          answer = (await promptSelect(prompt.message, prompt.default)) || "";
        } else {
          answer = await promptTextInput(prompt.message, prompt.default);
        }

        options[token] = answer;
      }

      // Now re-run the process with the newly set options. We don't include the
      // prompts as they should have been resolve just now.
      return caseTransformTokens(
        options,
        templateContents,
        tokenId,
        failOnMissingTokenInTemplate,
        failOnMissingTokenForOptions
      );
    }
  }

  // Check if we are supposed to fail when a token is in the template, but no
  // answer was given for it.
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
export async function caseTransformFileTokens(
  options: Record<string, string>,
  filePath: string,
  failOnMissingTokenInTemplate?: boolean,
  failOnMissingTokenForOptions?: boolean,
  tokenPrompts?: Record<string, ParamPrompt>
) {
  const templateFileName = path.basename(filePath);

  return await caseTransformTokens(
    options,
    fs.readFileSync(filePath, { encoding: "utf-8" }),
    templateFileName,
    failOnMissingTokenInTemplate,
    failOnMissingTokenForOptions,
    tokenPrompts
  );
}
