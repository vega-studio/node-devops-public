import url from "url";
import { chalk } from "../../../util/chalk.js";
import { createProxyMiddleware, RequestHandler } from "http-proxy-middleware";
import { Express } from "express";
import { getEnv } from "../config/get-env.js";
import { getErrorMessage } from "../../../util/get-error-message.js";
import { IHostConfig, isHostConfig } from "../../config/env/env.base.js";
import { Logging } from "../config/logging.js";
import { mapLookupValues } from "../../../util/look-up.js";
import { template } from "../../../util/template.js";
import { urlJoin } from "../../../util/url-join.js";

/**
 * Configure our server to proxy API calls to the remote API. This bypasses
 * issues where our fetch requests don't include the Cookie from the cross
 * domain problems.
 */
export async function apiProxy(app: Express) {
  const ENV = await getEnv();
  const allHosts = mapLookupValues<
    IHostConfig,
    { key: string; value: IHostConfig }
  >("hosts", isHostConfig, ENV.hostConfig, (key, value) => ({ key, value }));

  const proxies = new Map<string, RequestHandler>();
  const isUsing = new Set<string>();

  Logging.system.info(
    chalk.cyan(`

      Building Proxies.
        - Paths shown will show ExpressJS style paths with dynamic params using it's syntax ':param'
        - Duplicate proxy hosts will only create one proxy for identical paths.

    `)
  );

  allHosts.forEach(({ key, value: hostConfig }) => {
    if (!hostConfig.proxyHost) return;
    Logging.system.info(chalk.yellow(key));
    let proxy = proxies.get(hostConfig.proxyHost);

    // Ensure the proxy server is established for the host
    if (!proxy) {
      const options = {
        // Target host
        target: hostConfig.proxyHost,
        // Needed for virtual hosted sites (helps with https)
        changeOrigin: false,
        secure: false,

        onProxyReq: function (request: any) {
          try {
            request.setHeader("host", url.parse(hostConfig.proxyHost).hostname);
            request.setHeader("referer", hostConfig.proxyHost);
            request.removeHeader("origin");
          } catch (err) {
            Logging.system.error(getErrorMessage(err));
          }
        },

        onProxyRes: function (response: any) {
          Logging.system.info("STATUS:", response.statusCode);
        },
      };

      proxy = createProxyMiddleware(options);
      proxies.set(hostConfig.proxyHost, proxy);
    }

    // Ensure Express is configured to handle the path type correctly. We will
    // replace template values with Express Dynamic variables to make sure all
    // paths that fit the format are captured.
    // For example:
    //   /thing/v${version}/account
    // will be converted to
    //   /thing/v:value/account
    const apiPath =
      hostConfig.proxyHost && hostConfig.proxyAliasPath
        ? urlJoin(hostConfig.proxyAliasPath, hostConfig.apiPath)
        : hostConfig.apiPath;

    if (!isUsing.has(apiPath)) {
      const proxySource = template({
        template: apiPath,
        options: {
          version: ":version",
        },
      }).template;

      Logging.system.info(chalk.cyan("Proxy using path:"), proxySource);
      app.use(
        proxySource,
        (req, _res, next) => {
          if (hostConfig.proxyAliasPath && hostConfig.proxyHost) {
            req.originalUrl = req.originalUrl.replace(
              hostConfig.proxyAliasPath,
              ""
            );
          }

          Logging.system.info(
            chalk.cyanBrightBold(`${req.method} Proxied request`),
            req.originalUrl,
            chalk.cyanBrightBold("to"),
            chalk.greenBright(urlJoin(hostConfig.proxyHost, req.originalUrl))
          );

          delete req.headers.Origin;
          next();
        },
        proxy
      );

      isUsing.add(apiPath);
    }
  });

  Logging.system.info(chalk.cyan("[DONE]\n\n"));
}
