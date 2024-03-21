import express from "express";
import https from "https";
import path from "path";
import { getEnv } from "../config/get-env.js";
import { useVite } from "devops/shim/express-vite.js";

export async function configureVite(
  app: express.Express,
  httpsServer: https.Server
) {
  const { RESOURCE_PATH = "" } = process.env;
  const ENV = await getEnv();

  // HMR support when in dev mode
  useVite(app, httpsServer, () => {
    // Set up the expected resource path for hosting static resources.
    app.use(ENV.basePublicRoute, express.static(RESOURCE_PATH));

    // Final catch-all route to index.html defined last so our deep routing still
    // will host the file and initialize the app.
    app.get("/*", (_req, res) => {
      res.sendFile(path.resolve(RESOURCE_PATH, "index.html"));
    });
  });
}
