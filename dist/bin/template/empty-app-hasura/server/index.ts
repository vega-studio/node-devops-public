(global as any).window = {};

// Polyfills must be first
import "cross-fetch/dist/node-polyfill.js";

/**
 * NOTE: This is just a local development server to host files created for the
 * UI application. This does NOT deploy or impact production of the UI
 * Application in anyway.
 */
import express from "express";
import { apiProxy } from "./dev-server/api-proxy.js";
import { applyAPI } from "./api/index.js";
import { chalk } from "../../util/chalk.js";
import { configEnv } from "./config/config-env.js";
import { configureVite } from "./dev-server/configure-vite.js";
import { getEnv } from "./config/get-env.js";
import { getErrorMessage } from "../../util/get-error-message.js";
import { handleProcessExit } from "./dev-server/handle-process-exit.js";
import { Logging } from "./config/logging.js";
import { makeHttps } from "./config/make-https.js";

/**
 * Runs a simple HTTP server to host your files
 */
async function runServer() {
  // Make sure our environment is established for this instance
  await configEnv();
  // Get the environment configuration for this build mode.
  await getEnv();

  try {
    // Create our express application for configuration
    const app = express();
    // Configure our application to send requests to the API server specified in
    // our environment configuration.
    await apiProxy(app);
    // Apply all of the API endpoints to our express application
    await applyAPI(app);
    // Generate the https server that manages connections configured by our
    // express server.
    const httpsServer = await makeHttps(app);
    // Configure Vite for a development server to host the UI and manage HMR
    await configureVite(app, httpsServer);

    // Middleware to catch unmatched routes
    app.use("*", (req, res) => {
      console.warn(
        `Incoming request to ${req.originalUrl} does not match any valid routes.`
      );
      res.status(404).send("Oops! This isn't a valid resource!");
    });
  } catch (err) {
    Logging.system.error(getErrorMessage(err));
  }
}

/**
 * Set up handling server process shut down
 */
handleProcessExit(async (message: string, err?: Error) => {
  Logging.system.info(chalk.redBright(message));
  if (err) Logging.system.error(getErrorMessage(err));
});

runServer();
