import * as Vite from "vite";
import https from "https";
import path from "path";
import Proxy from "http-proxy";
import { buildViteConfig } from "../bin/lib/build/build-vite-config.js";
import { chalk } from "../bin/lib/util/chalk.js";
import { NextFunction, Request, Response } from "express";

export type IViteResourceMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Response<any, Record<string, any>> | undefined | void;

/**
 * Creates some proxy services for Vite to make HMR available. This ONLY happens
 * during development mode. Use the callback to provide alternate hosting
 * behavior for develpment mode.
 */
export async function useVite(
  app: any,
  server: https.Server,
  onProduction?: () => void,
  resourceMiddleWare: IViteResourceMiddleware[] = []
) {
  console.warn(
    chalk.bgMagentaBright(
      "Vite: Checking environment...",
      process.env.NODE_ENV || "undefined"
    )
  );
  if (process.env.NODE_ENV === "production") {
    onProduction?.();
    return;
  }

  console.warn(chalk.bgMagentaBright("Starting Vite proxy for HMR..."));
  let port = Number(process.env.VITE_PORT || 25555);

  if (isNaN(port)) {
    port = 25555;
  }

  const proxy = Proxy.createProxyServer({
    target: { host: "localhost", port },
  });

  // Proxy anything yet-unhandled back to vite
  app.get("*", ...resourceMiddleWare, (req: any, res: any) =>
    proxy.web(req, res)
  );

  // Proxy hmr ws back to vite
  server.on("upgrade", (req, socket, head) => {
    if (req.url == "/") proxy.ws(req, socket, head);
  });

  const buildClientConfig: Vite.InlineConfig = await buildViteConfig();

  const viteServerConfig: Vite.InlineConfig = {
    root: path.resolve("app/client"),
    server: {
      port,
    },
  };

  // Start our vite dev server
  const vite = await Vite.createServer({
    ...buildClientConfig,
    ...viteServerConfig,
  });

  vite.listen();
}
