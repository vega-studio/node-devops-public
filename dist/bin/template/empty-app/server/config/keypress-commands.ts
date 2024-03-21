import readline from "readline";
import { Application } from "express";
import { chalk } from "../../../util/chalk.js";
import { execSync } from "child_process";
import { Logging } from "./logging.js";

const toggleShowLogLevel = () => {
  Logging.showLevel = !Logging.showLevel;
  Logging.system.info(
    chalk.cyanBright(`Showing Log Levels in Console: ${Logging.showLevel}`)
  );
};

const showAPILogs = () => {
  if (Logging.api.level === "none") {
    Logging.api.level = "info";
  } else if (Logging.api.level === "info") {
    Logging.api.level = "http";
  } else if (Logging.api.level === "http") {
    Logging.api.level = "verbose";
  } else if (Logging.api.level === "verbose") {
    Logging.api.level = "debug";
  } else if (Logging.api.level === "debug") {
    Logging.api.level = "none";
  }

  Logging.system.info(
    chalk.cyanBright(`API log level changed: ${Logging.api.level}`)
  );
};

const listAPIEndpoints = (app: Application, basePath = "") => {
  const routes: any[] = [];

  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      routes.push({
        path: basePath + middleware.route.path,
        method: Object.keys(middleware.route.methods).join(", ").toUpperCase(),
      });
    } else if (middleware.name === "router") {
      const routerPath = middleware.regexp.source
        .replace("^\\", "")
        .replace("\\/?(?=\\/|$)", "");
      middleware.handle.stack.forEach((handler: any) => {
        const route = handler.route;
        route &&
          routes.push({
            path: (basePath + routerPath + route.path).replace("\\\\/", "/"),
            method: Object.keys(route.methods).join(", ").toUpperCase(),
          });
      });
    }
  });

  console.warn(routes);
};

const openDevPage = () => {
  execSync("open https://localhost");
};

const openHasuraConsole = () => {
  execSync("npx hasura console --project app/server/hasura");
};

/**
 * Listens to the stdin inut for the letter r to be pressed to trigger listing
 * all registered routes for the express app.
 */
export const keypressCommands = (app: Application) => {
  // Listen to stdin for the key r to be pressed
  process.stdin.setRawMode?.(true);
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  readline.emitKeypressEvents(process.stdin);

  process.stdin.on("keypress", (chunk, key) => {
    try {
      if (chunk.toString() === "a" || chunk.toString() === "A") {
        showAPILogs();
      } else if (chunk.toString() === "l" || chunk.toString() === "L") {
        toggleShowLogLevel();
      } else if (chunk.toString() === "r" || chunk.toString() === "R") {
        listAPIEndpoints(app);
      } else if (chunk.toString() === "o" || chunk.toString() === "O") {
        openDevPage();
      } else if (chunk.toString() === "h" || chunk.toString() === "H") {
        openHasuraConsole();
      }

      if (key && key.ctrl && key.name === "c") {
        process.exit(0);
      }
    } catch (error) {
      console.error(error);
    }
  });

  Logging.system.info(chalk.cyanBright("o - open the dev page in the browser"));
  Logging.system.info(chalk.cyanBright("h - open the hasura console"));
  Logging.system.info(chalk.cyanBright("r - list all registered routes"));
  Logging.system.info(
    chalk.cyanBright("a - cycle through levels of API request logs")
  );
  Logging.system.info(
    chalk.cyanBright("l - toggle logging log levels with each log")
  );
  Logging.system.info(
    chalk.cyanBright(
      "b - Perform a one time build to preview the app folder structure in the ./build folder"
    )
  );
  Logging.system.info(
    chalk.cyanBright(
      "q - Quit the dev server application (hold shift for a fast shutdown)"
    )
  );
};
