import cookieParser from "cookie-parser";
import Express, { Application, NextFunction, Request, Response } from "express";
import fs from "fs-extra";
import path from "path";
import { chalk } from "../../../util/chalk.js";
import { Logging } from "../config/logging.js";
import { Validator } from "../../client/api/validation/validate.js";

/**
 * This is how to define middle ware that will be applied to the express app for
 * a given api.
 */
export type IAPIMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Response<any, Record<string, any>> | undefined | void;

/**
 * This is the context handed to any api being built. It will allow the system
 * to better handle DI for api modules to improve unit testing.
 */
export interface IAPIContext<TResponseMap> {
  /** The raw request object */
  request: Request;
  /** The raw response object */
  response: Response;
  /** The map of response keys to their default response object types */
  responseMap: TResponseMap;
}

/**
 * This stores the current router that will be applied when the api targets are
 * called.
 */
let ctx: {
  router: Express.Router;
  routerName: string;
  method: "post" | "get" | "put" | "delete" | "patch";
  path: string;
  moduleCount: number;
};

/**
 * We place all checks here that ensures requests can build their context when
 * executed.
 */
async function initContext() {
  // TODO
}

/**
 * This reads all modules in the API folder and applies them to the express
 * application based on folder structure and file naming conventions.
 *
 * api/
 *   v1/
 *    auth/
 *     heartbeat.get.ts
 *     login.post.ts
 *
 * Will generate the routes:
 *
 * GET: /api/v1/auth/heartbeat
 * POST: /api/v1/auth/login
 *
 * Each of the files should have a single call to the api builder method `api`.
 * Multiple calls in the same file module will throw an error.
 */
export async function applyAPI(app: Application) {
  Logging.api.info(
    chalk.cyan(`

      Building APIs.
        - This will build API routes based on the server/api folder
        - Some files wil be ignored as they are tools for building the API

    `)
  );

  // Make sure all contexts can be established to facilitate API useage.
  await initContext();
  // Parse cookie info
  app.use(cookieParser());
  // To parse json data
  app.use(Express.json());
  // To parse URL-encoded data
  app.use(Express.urlencoded({ extended: true }));

  // Log routes that are being called
  app.use((req, _res, next) => {
    const toLog = {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip || req.ips || req.socket.remoteAddress,
      params: req.params,
      query: req.query,
      body: Object.assign({}, req.body),
      headers: req.headers,
    };

    // Clean out sensitive logs. Namely user passwords.
    if (toLog.body && toLog.body.password) {
      toLog.body.password = "********";
    }

    Logging.api.info(
      `${chalk.grayBrightBold(
        `[Client Request: ${toLog.method} ${toLog.url}]`
      )}`
    );

    Logging.api.http({
      params: toLog.params,
      query: toLog.query,
      body: toLog.body,
    });

    Logging.api.debug({
      ip: toLog.ip,
      headers: toLog.headers,
    });
    next();
  });

  const apiPath = path.resolve("app/server/api");
  // Read ALL of the files in the API folder recursively
  const files = fs
    .readdirSync(apiPath)
    .map((f) => path.join(apiPath, f))
    .filter((f) => !f.endsWith("gql") && !f.endsWith("api/index.ts"));
  // We will generate a router for each folder in the API folder.
  const routers = new Map<string, Express.Router>();
  const usedRouters = new Map<string, Express.Router>();

  for (let i = 0; i < files.length; ++i) {
    const filePath = files[i];

    if (fs.statSync(filePath).isDirectory()) {
      const subFiles = fs.readdirSync(filePath);
      subFiles.forEach((f) => files.push(path.resolve(filePath, f)));

      // We generate a route to handle the directory. The file contents of the
      // directory will use that router to append the REST methods to them.
      const routerName = path.relative(apiPath, path.join(filePath));
      let router = routers.get(routerName);

      if (!router) {
        router = Express.Router();
        routers.set(routerName, router);
        Logging.api.info(
          chalk.greyBrightBold(`[Check Route: api/${routerName}]`)
        );
      }
    }

    // If the file is a ts module, we dynamically import it. This should trigger
    // all of the api modules to execute and gather itself into api targets
    else {
      // Get the router that should be available for this file.
      const routerName = path.relative(
        apiPath,
        path.join(path.dirname(filePath))
      );
      const router = routers.get(routerName);

      if (!router) {
        Logging.api.error("A router was not created for the api module:");
        Logging.api.error(`${filePath}`);
        continue;
      }

      if (
        filePath.endsWith(".get.ts") ||
        filePath.endsWith(".post.ts") ||
        filePath.endsWith(".put.ts") ||
        filePath.endsWith(".delete.ts") ||
        filePath.endsWith(".patch.ts")
      ) {
        usedRouters.set(routerName, router);
        // Get the method type from the file
        const splits = filePath.split(".");
        splits.pop();
        const method = splits.pop();

        if (
          method !== "get" &&
          method !== "post" &&
          method !== "put" &&
          method !== "delete" &&
          method !== "patch"
        ) {
          Logging.api.error(
            "Could not determine the method type for the api module."
          );
          continue;
        }

        // Set the ctx for the api module about to be loaded
        ctx = {
          router,
          routerName,
          moduleCount: 0,
          method,
          path: `/${path.basename(filePath, `.${method}.ts`)}`,
        };

        Logging.api.info(
          `${chalk.yellowBrightBold(
            `[${ctx.method}: api/${routerName}${ctx.path}]`
          )} ${filePath}`
        );

        try {
          await import(filePath);

          if (ctx.moduleCount === 0) {
            Logging.api.error(
              chalk.redBrightBold(
                "The API module did not build any api targets. Make sure to call the api method in the module:"
              )
            );
          }
        } catch (err) {
          // Do nothing as invalid modules are not our concern here.
          Logging.api.error(err);
        }
      }
    }
  }

  const routerPairs = Array.from(usedRouters.entries());
  // longest router names first
  routerPairs.sort(([a], [b]) => b.length - a.length);

  routerPairs.forEach(([routerName, router]) => {
    app.use(`/api/${routerName}`, router);
    Logging.api.info(chalk.cyanBrightBold(`[Router: /api/${routerName}]`));
  });

  Logging.api.info(chalk.cyan("[DONE]\n\n"));
}

/**
 * This type is the type assigned to the respond parameter of API
 * implementations. This is a bit complicated as it helps facilitate the allowed
 * keys to be used in the response callback as well as the overriding body
 * object associated with the response.
 */
type Responder<
  T,
  TStatus extends {
    [key: string]: {
      status: number;
      response: () => T;
    };
  },
> = <K extends keyof TStatus>(
  key: K,
  body?: ReturnType<TStatus[K]["response"]>
) => void;

/**
 * Defines the parameters used when constructing a new API interface.
 */
export interface IAPIBuilder<
  T,
  TRequest extends object,
  TStatus extends { [key: string]: { status: number; response: () => T } },
> {
  middleware: IAPIMiddleware[];
  requestType: Validator<TRequest>;
  responses: TStatus;
  handler: (
    request: TRequest,
    respond: Responder<T, TStatus>,
    // TODO: The goal is to make THIS the respond type so a developer has acess
    // to their specific flags as an enum using respond.RESPONSE_FLAG. This
    // currently has a type issue with the selected enum does not properly make
    // the body override type select the specific body type based on the key
    // selected. If a solution for that is resolved, then this can become the
    // new type.
    // respond: Responder<T, TStatus> & Record<keyof TStatus, keyof TStatus>,
    context: IAPIContext<TStatus>
  ) => Promise<void>;
}

/**
 * This builds a new API module. The API must declare it's middle ware and it's
 * responses first. This will help with making API modules be more readable and
 * reliable as it enforces stricter expectations that can easily pinpoint when
 * those expectations are not utilized correctly or not implemented at all.
 */
export function api<
  T,
  TRequest extends object,
  TStatus extends { [key: string]: { status: number; response: () => T } },
>(
  middleware: IAPIBuilder<T, TRequest, TStatus>["middleware"] = [],
  requestType: IAPIBuilder<T, TRequest, TStatus>["requestType"],
  responses: IAPIBuilder<T, TRequest, TStatus>["responses"],
  handler: IAPIBuilder<T, TRequest, TStatus>["handler"]
): IAPIBuilder<T, TRequest, TStatus> {
  ctx.moduleCount++;

  if (ctx.moduleCount > 1) {
    throw new Error(
      "Only one api module can be defined per file. Please make a new file with another api module specified"
    );
  }

  const { router, routerName, method, path } = ctx;
  Logging.api.info(`[Build -> ${method} ${path}]`);

  if (middleware.length === 0) {
    middleware.push((_req, _res, next) => (next(), _res));
  }

  function getStatusColor(status: number) {
    if (status >= 200 && status < 300) {
      return chalk.grayBrightBold;
    } else if (status >= 400) {
      return chalk.redBrightBold;
    } else {
      return chalk.yellowBrightBold;
    }
  }

  function makeResponder<K extends keyof TStatus>(
    _req: Request,
    res: Response
  ) {
    return Object.assign(
      (key: K, body?: ReturnType<TStatus[K]["response"]>) => {
        const { status, response } = responses[key];
        res.status(status).json(body || response());

        Logging.api.http(
          getStatusColor(status)(
            `[${status}] ${JSON.stringify(body || response())}`
          )
        );
      },
      (Object.keys(responses) as K[]).reduce(
        (acc, key: K) => {
          acc[key] = key;
          return acc;
        },
        {} as Record<K, K>
      )
    );
  }

  async function makeHandler(
    req: Request,
    res: Response,
    dataSource: any,
    httpMethod: string,
    next: Function
  ) {
    try {
      if (requestType(dataSource, `${httpMethod} ${routerName}${path}`)) {
        await handler(dataSource, makeResponder(req, res), {
          request: req,
          response: res,
          responseMap: responses,
        }).catch(() => next());
      } else {
        res.status(400).json({
          message: "Invalid request params",
        });
      }
    } catch (err) {
      Logging.api.error(err);
      res.status(500).json({
        message: "Unknown Error",
      });
    }
  }

  switch (method) {
    case "get":
      router.get(path, ...middleware, async (req, res, next) => {
        makeHandler(req, res, req.query, "GET", next);
      });
      break;

    case "post":
      router.post(path, ...middleware, async (req, res, next) => {
        makeHandler(req, res, req.body, "POST", next);
      });
      break;

    case "put":
      router.put(path, ...middleware, async (req, res, next) => {
        makeHandler(req, res, req.params, "PUT", next);
      });
      break;

    case "delete":
      router.delete(path, ...middleware, async (req, res, next) => {
        makeHandler(req, res, req.params, "DELETE", next);
      });
      break;

    case "patch":
      router.patch(path, ...middleware, async (req, res, next) => {
        makeHandler(req, res, req.body, "PATCH", next);
      });
      break;

    default:
      Logging.api.error("Unknown method type for api module.");
      break;
  }

  return {
    handler,
    middleware,
    requestType,
    responses,
  };
}
