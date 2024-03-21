import Express, { Application, Router } from "express";
import fs from "fs-extra";
import path from "path";
import { chalk } from "../../../util/chalk.js";

type APITarget = (router: Router) => void;

/**
 * This stores the current router that will be applied when the api targets are
 * called.
 */
let routerCtx: Express.Router;

/**
 * This reads all modules in the API folder and appl
 */
export async function applyAPI(express: Application) {
  console.warn(
    chalk.cyan(`

      Building APIs.
        - This will build API routes based on the server/api folder
        - Some files wil be ignored as they are tools for building the API

    `)
  );

  const apiPath = path.resolve("app/server/api");
  // Read ALL of the files in the API folder recursively
  const files = fs
    .readdirSync(apiPath)
    .map((f) => path.join(apiPath, f))
    .filter((f) => !f.endsWith("gql") && !f.endsWith("api/index.ts"));
  // We will generate a router for each folder in the API folder.
  const routers = new Map<string, Express.Router>();
  // Generate our top level router for the APIs in general
  const router = Express.Router();
  express.use("/api", router);

  for (let i = 0; i < files.length; ++i) {
    const filePath = files[i];

    if (fs.statSync(filePath).isDirectory()) {
      const subFiles = fs.readdirSync(filePath);
      subFiles.forEach((f) => files.push(path.resolve(filePath, f)));
    }

    // If the file is a ts module, we dynamically import it. This should trigger
    // all of the api modules to execute and gather itself into api targets
    else {
      const routerName = path.relative(
        apiPath,
        path.join(path.dirname(filePath), path.basename(filePath, ".ts"))
      );
      let router = routers.get(routerName);

      if (!router) {
        router = Express.Router();
        routers.set(routerName, router);
        express.use(`/api/${routerName}`, router);
      }

      // Set the router ctx for the calls to the api applicator.
      routerCtx = router;

      if (filePath.endsWith(".ts")) {
        console.warn(
          `${chalk.yellowBrightBold(`[ROUTE: api/${routerName}]`)} ${filePath}`
        );
        try {
          await import(filePath);
        } catch (err) {
          // Do nothing as invalid modules are not our concern here.
          console.error(err);
        }
      }
    }
  }

  console.warn(chalk.cyan("[DONE]\n\n"));
}

/**
 * Wrap your API endpoints in this function to add it to the available API for
 * the application server.
 */
export async function api(target: APITarget) {
  await target(routerCtx);

  return target;
}
