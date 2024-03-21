function isChildProcessError(err: any): err is { status: number } {
  return err && typeof err.status === "number";
}

export function isDefined<T>(val: T | undefined | null): val is T {
  return val !== void 0 && val !== null;
}

export interface IExecSync {
  /** Set to true to prevent error logs */
  silent?: boolean;
}

/**
 * Executes a command on the same stdio as the current process. This absorbs
 * errors and also ignores null/undefined arguments.
 *
 * Returns true if the command succeeded.
 */
async function run(command: string, args: (string | null | undefined)[] = []) {
  try {
    const result = Bun.spawnSync([command, ...args.filter(isDefined)], {
      stdio: ["inherit", "ignore", "inherit"],
      env: process.env,
    });

    if (result.exitCode !== 0) {
      if (!run.silent) {
        console.error(
          `Error: ${command} ${args.join(" ")} failed with code: ${
            result.exitCode
          }`
        );
        console.error(new Error().stack);
      }
      return false;
    }
  } catch (err) {
    if (!run.silent) {
      if (isChildProcessError(err)) {
        console.error(
          `Error: ${command} ${args.join(" ")} failed with code: ${err.status}`
        );
      } else if (err instanceof Error) {
        console.error(err.message);
      }

      console.error(new Error().stack);
    }

    return false;
  }

  return true;
}

// Default the execution style.
run.silent = true;

export const execSync: typeof run & IExecSync = run;
