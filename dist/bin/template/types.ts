import type { getAllComponents } from "../component/get-all-components.js";
import type {
  checkComponentStructure,
  ComponentsPaths,
} from "../component/check-component-structure.js";
import type { targetProjectPackage } from "../target-project/target-project-package.js";
import type {
  findComponent,
  isComponentSelections,
  makeComponentSelections,
} from "../component/find-component.js";
import * as changecase from "change-case";
import type { generateCategory } from "../component/generate-category.js";
import type { promptTextInput } from "../prompt/prompt-text-input.js";
import type { promptSelect } from "../prompt/prompt-select.js";
import type { promptOverrideFile } from "../prompt/prompt-override-file.js";
import type { targetProjectDependencies } from "../target-project/target-project-dependencies.js";
import type { targetProjectName } from "../target-project/target-project-name.js";
import type { targetProjectRepo } from "../target-project/target-project-repo.js";
import type { targetProjectVersion } from "../target-project/target-project-version.js";
import type { execInstall } from "../exec/exec-install.js";
import type { execScript } from "../exec/exec-script.js";
import type { execScriptX } from "../exec/exec-scriptx.js";
import type { execSyncResult } from "../exec/exec-sync-result.js";
import type { execSync } from "../exec/exec-sync.js";
import type { getPackageManager } from "../exec/get-package-manager.js";
import type { template } from "../util/template.js";
import type {
  caseTransformTokens,
  ParamPrompt,
} from "./case-transform-tokens.js";
import type { promptConfirm } from "../prompt/prompt-confirm.js";
import type { promptDiffFile } from "../prompt/prompt-diff-file.js";
import type { chalk } from "../util/chalk.js";
import type { description } from "../util/description.js";
import type { openFile } from "../file-management/open-file.js";

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
   *
   * The onValue callback fires after the user has provided a value. This allows
   * for additional modification after the selection or further prompting as
   * needed.
   */
  paramPrompts?:
    | Record<string, ParamPrompt>
    | (() => Promise<Record<string, ParamPrompt>>);
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

  /**
   * Allows a transorm to be applied to a discovered token. This replaces the
   * value the token currently is with the value the token will be transformed
   * into. Simply return the value to be injected into the template at the
   * token's position.
   *
   * If you return "suggested" this transform essentially becomes a noop.
   */
  transformToken?: (
    token: string[],
    value: string,
    suggested: string,
    options: Record<string, string | undefined>
  ) => string;

  /**
   * Executes when the template has finished syncing with the target. Includes
   * information relevant to the process when it ran.
   */
  syncComplete?: (
    files: [string, string][],
    ctx: TemplateSyncContext,
    options: Record<string, string | undefined>
  ) => Promise<void>;
};

/**
 * This is the context passed into the function that returns a template sync
 * object.
 */
export type TemplateSyncContext = {
  /** List of all components in the project currently (pascal case) */
  components: Set<string>;
  /** Relevant pathing information for component structure of the project. */
  componentsPaths: ComponentsPaths;

  /**
   * List of available common library functions passed to the template. Less
   * imports for the template means easier to maintain templates and makes
   * templates easier to write when overriding in a project.
   */
  lib: {
    component: {
      checkComponentStructure: typeof checkComponentStructure;
      findComponent: typeof findComponent;
      generateCategory: typeof generateCategory;
      getAllComponents: typeof getAllComponents;
      isComponentSelections: typeof isComponentSelections;
      makeComponentSelections: typeof makeComponentSelections;
    };
    exec: {
      execInstall: typeof execInstall;
      execScript: typeof execScript;
      execScriptX: typeof execScriptX;
      execSyncResult: typeof execSyncResult;
      execSync: typeof execSync;
      getPackageManager: typeof getPackageManager;
    };
    prompt: {
      promptConfirm: typeof promptConfirm;
      promptDiffFile: typeof promptDiffFile;
      promptOverrideFile: typeof promptOverrideFile;
      promptSelect: typeof promptSelect;
      promptTextInput: typeof promptTextInput;
    };
    targetProject: {
      targetProjectPackage: typeof targetProjectPackage;
      targetProjectDependencies: typeof targetProjectDependencies;
      targetProjectName: typeof targetProjectName;
      targetProjectRepo: typeof targetProjectRepo;
      targetProjectVersion: typeof targetProjectVersion;
    };
    util: {
      chalk: typeof chalk;
      changecase: typeof changecase;
      description: typeof description;
      openFile: typeof openFile;
      template: typeof template;
      caseTransformTokens: typeof caseTransformTokens;
    };
  };
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
