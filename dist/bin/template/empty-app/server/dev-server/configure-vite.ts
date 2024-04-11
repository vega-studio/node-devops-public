import express from "express";
import https from "https";
import path from "path";
import { getEnv } from "../config/get-env.js";
import { Logging } from "../config/logging.js";
import { useVite } from "devops/shim/index.js";
import { wait } from "../../../util/wait.js";

export async function configureVite(
  app: express.Express,
  httpsServer: https.Server
) {
  const { RESOURCE_PATH = "" } = process.env;
  const ENV = await getEnv();
  Logging.system.info("Configuring Vite dev server...");
  let viteEstablished = false;
  let attempts = 0;

  while (!viteEstablished) {
    // HMR support when in dev mode
    try {
      await useVite(app, httpsServer, () => {
        // Set up the expected resource path for hosting static resources.
        app.use(ENV.basePublicRoute, express.static(RESOURCE_PATH));
        Logging.system.info(
          `Production server hosting static resources from ${RESOURCE_PATH}`
        );

        // Final catch-all route to index.html defined last so our deep routing still
        // will host the file and initialize the app.
        app.get("/*", (_req, res) => {
          res.sendFile(path.resolve(RESOURCE_PATH, "index.html"));
        });
        Logging.system.info(
          `Production server resolving all unresolved static routes to ${path.resolve(
            RESOURCE_PATH,
            "index.html"
          )}`
        );
      });
      Logging.system.info("Vite configuration completed.");
      viteEstablished = true;
    } catch (err) {
      attempts++;
      await wait(1000);
      Logging.system.error(
        "Failed to establish Vite configuration. Trying Again..."
      );

      // Begin logging the cause if we keep failing.
      if (attempts > 3) {
        Logging.error(Logging.system, err);
      }
    }
  }
}
