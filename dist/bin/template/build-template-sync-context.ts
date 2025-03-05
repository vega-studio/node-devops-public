import { getAllComponents } from "../component/get-all-components.js";
import { checkComponentStructure } from "../component/check-component-structure.js";
import { targetProjectPackage } from "../target-project/target-project-package.js";
import {
  findComponent,
  isComponentSelections,
  makeComponentSelections,
} from "../component/find-component.js";
import * as changecase from "change-case";
import { generateCategory } from "../component/generate-category.js";
import { promptTextInput } from "../prompt/prompt-text-input.js";
import { promptSelect } from "../prompt/prompt-select.js";
import { promptSuggestions } from "../prompt/prompt-suggestions.js";
import { promptOverrideFile } from "../prompt/prompt-override-file.js";
import { targetProjectDependencies } from "../target-project/target-project-dependencies.js";
import { targetProjectName } from "../target-project/target-project-name.js";
import { targetProjectRepo } from "../target-project/target-project-repo.js";
import { targetProjectVersion } from "../target-project/target-project-version.js";
import { execInstall } from "../exec/exec-install.js";
import { execScript } from "../exec/exec-script.js";
import { execScriptX } from "../exec/exec-scriptx.js";
import { execSyncResult } from "../exec/exec-sync-result.js";
import { execSync } from "../exec/exec-sync.js";
import { getPackageManager } from "../exec/get-package-manager.js";
import { processTemplate } from "../util/template.js";
import type { TemplateSyncContext } from "./types.js";
import { promptConfirm } from "../prompt/prompt-confirm.js";
import { promptDiffFile } from "../prompt/prompt-diff-file.js";
import { chalk } from "../util/chalk.js";
import { description } from "../util/description.js";
import { openFile } from "../file-management/open-file.js";
import { caseTransformTokens } from "./case-transform-tokens.js";

/**
 * Generates the context we pass to our templates.
 */
export async function buildTemplateSyncContext(): Promise<TemplateSyncContext> {
  const paths = await checkComponentStructure(false);
  let components: string[] = [];
  if (paths) components = await getAllComponents(paths);
  else {
    console.warn(
      chalk.yellow("No components found in this project for the sync context.")
    );
  }

  return {
    components: new Set(components),
    componentsPaths: paths,

    lib: {
      component: {
        checkComponentStructure,
        findComponent,
        generateCategory,
        getAllComponents,
        isComponentSelections,
        makeComponentSelections,
      },
      exec: {
        execInstall,
        execScript,
        execScriptX,
        execSyncResult,
        execSync,
        getPackageManager,
      },
      prompt: {
        promptConfirm,
        promptDiffFile,
        promptOverrideFile,
        promptSelect,
        promptTextInput,
        promptSuggestions,
      },
      targetProject: {
        targetProjectPackage,
        targetProjectDependencies,
        targetProjectName,
        targetProjectRepo,
        targetProjectVersion,
      },
      util: {
        chalk,
        changecase,
        description,
        openFile,
        template: processTemplate,
        caseTransformTokens,
      },
    },
  };
}
