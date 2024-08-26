#!/usr/bin/env node

const path = require("path");
const { execFileSync } = require("child_process");
const fs = require("fs");

// const __dirname = fileURLToPath(new URL(".", import.meta.url));

/**
 * This is a cross platform entry point for the CLI to aid in picking the
 * correct entry script for running the application. We go through a system
 * level script to aid in set up for our application to run isolated from the
 * initial script execution.
 *
 * NOTE: This is SPECIFICALLY written in VERY basic nodejs fashion and will not
 * be bundled in any fashion to keep it completely controlled and completely
 * compatible with running with a raw node executable. This prevents SO MANY
 * POSSIBLE ISSUES.
 */
async function run() {
  let pathToDist = path.resolve("./bin");

  if (!fs.existsSync(path.resolve(pathToDist, "main-entry.sh"))) {
    if (
      fs.existsSync(
        path.resolve("./node_modules/devops/dist/bin/main-entry.sh")
      )
    ) {
      pathToDist = path.resolve("./node_modules/devops/dist/bin");
    } else {
      console.error("Could not determine devops main-entry point.");
      process.exit(1);
    }
  }

  let scriptName, pathToScript, program;

  try {
    switch (process.platform) {
      case "aix":
      case "darwin":
      case "freebsd":
      case "linux":
      case "openbsd":
      case "sunos":
        scriptName = "main-entry.sh";
        pathToScript = path.resolve(pathToDist, scriptName);
        execFileSync(pathToScript, process.argv.slice(2), {
          stdio: ["inherit", "inherit", "inherit"],
          env: process.env,
        });
        break;

      case "win32":
        scriptName = "main-entry.ps1";
        pathToScript = path.resolve(pathToDist, scriptName);
        execFileSync(
          "powershell.exe",
          [
            "-NoProfile",
            "-ExecutionPolicy",
            "Bypass",
            "-File",
            pathToScript,
          ].concat(process.argv.slice(2)),
          {
            stdio: ["inherit", "inherit", "inherit"],
            env: process.env,
          }
        );
        break;

      default:
        console.error(`Unknown platform: ${process.platform}`);
        process.exit(1);
    }
  } catch (err) {
    process.exit(Number(err.code || 1));
  }
}

run();
