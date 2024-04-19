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
  | undefined
  | string
  | {
      message: string;
      default: string | string[];
      onValue?: (value: string) => Promise<string>;
    };

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
  options: Record<string, string | undefined>,
  templateContents: string,
  tokenId?: string,
  failOnMissingTokenInTemplate?: boolean,
  failOnMissingTokenForOptions?: boolean,
  tokenPrompts?: Record<string, ParamPrompt>,
  transformToken?: (
    token: string[],
    value: string,
    suggested: string,
    options: Record<string, string | undefined>
  ) => string
) {
  const onToken = (file: string) => (match: string) => {
    match = match.trim();
    const checks = match.split(":").map((s) => s.trim());
    let result: string = options[checks[0]] || checks[0];

    if (options[checks[0]] === void 0) {
      if (transformToken) {
        return transformToken(checks, match, match, options);
      }
      return match;
    }

    if (!checks[1]) {
      if (transformToken) {
        return transformToken(checks, result, match, options);
      }
      return result;
    }

    const preTransform = result;

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

    if (transformToken) {
      return transformToken(checks, preTransform, result, options);
    }
    return result;
  };

  // Run the template to discover all tokens in the template
  const checkTokens = template({
    template: templateContents,
    options: {},
    doubleCurlyBrackets: true,
  });

  // Get all of the tokens and make sure every token is resolved that can be
  // resolved before performing the actual templating routine
  let unresolvedTokens = new Set(
    Array.from(checkTokens.unresolvedTemplateOptions.keys())
      .map((t) => t.split(":")[0].trim())
      .filter((t) => !isDefined(options[t]))
  );

  if (tokenPrompts) {
    const needsPrompt = Object.keys(tokenPrompts).filter((t) =>
      unresolvedTokens.has(t)
    );

    if (needsPrompt.length > 0) {
      for (const token of needsPrompt) {
        unresolvedTokens.delete(token);
        const prompt = tokenPrompts[token];
        let answer: string = "";

        if (isString(prompt)) {
          answer = await promptTextInput(prompt);
        } else if (prompt) {
          if (Array.isArray(prompt.default)) {
            answer = (await promptSelect(prompt.message, prompt.default)) || "";
          } else {
            answer = await promptTextInput(prompt.message, prompt.default);
          }

          // Hand off the answer provided to the option that created it for an
          // additional transformation as needed.
          answer = prompt.onValue ? await prompt.onValue(answer) : answer;
        }

        options[token] = answer;
      }
    }
  }

  if (unresolvedTokens.size > 0 && failOnMissingTokenForOptions) {
    throw new Error(description`
        Some tokens provided by the template were not resolved by the options
        provided. These need to be resolved to continue:
        Template ID: ${chalk.yellowBrightBold(tokenId || "None")}
        Provided: ${chalk.redBrightBold(
          Array.from(Object.entries(options))
            .map(([key, val]) => `${key}: ${val}`)
            .join(", ")
        )}
        Tokens: ${chalk.redBrightBold(
          Array.from(unresolvedTokens.values()).join(", ")
        )}
      `);
  }

  // Generate all of the contents of our files by replacing the relevant terms
  const results = template({
    template: templateContents,
    options: {},
    doubleCurlyBrackets: true,
    onToken: onToken(tokenId || "Template"),
  });

  // Check if we are supposed to fail when a token is in the template, but no
  // answer was given for it.
  if (failOnMissingTokenInTemplate) {
    if (unresolvedTokens.size > 0) {
      throw new Error(description`
        Some tokens provided by the template were not resolved by the options
        provided. These need to be resolved to continue:
        Template ID: ${chalk.yellowBrightBold(tokenId || "None")}
        Provided: ${chalk.redBrightBold(
          Array.from(Object.entries(options))
            .map(([key, val]) => `${key}: ${val}`)
            .join(", ")
        )}
        Tokens: ${chalk.redBrightBold(
          Array.from(unresolvedTokens.keys()).join(", ")
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
        Provided: ${chalk.redBrightBold(
          Array.from(Object.entries(options))
            .map(([key, val]) => `${key}: ${val}`)
            .join(", ")
        )}
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
  options: Record<string, string | undefined>,
  filePath: string,
  failOnMissingTokenInTemplate?: boolean,
  failOnMissingTokenForOptions?: boolean,
  tokenPrompts?: Record<string, ParamPrompt>,
  transformToken?: (
    token: string[],
    value: string,
    suggested: string,
    options: Record<string, string | undefined>
  ) => string
) {
  const templateFileName = path.basename(filePath);

  return await caseTransformTokens(
    options,
    fs.readFileSync(filePath, { encoding: "utf-8" }),
    templateFileName,
    failOnMissingTokenInTemplate,
    failOnMissingTokenForOptions,
    tokenPrompts,
    transformToken
  );
}
