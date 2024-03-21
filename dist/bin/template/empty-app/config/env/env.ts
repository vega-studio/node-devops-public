import { EnvBase } from "./env.base.js";

/**
 * This environment configures the application to target the developer
 * environment.
 *
 * Mob1 test accounts: 6494, 6490
 */
class Env extends EnvBase {
  hostConfig: EnvBase["hostConfig"] = {
    api: {
      proxyHost: "",
      host: "",
      apiPath: "/api/v${version}",

      headers: {
        get: {
          Accept: "application/json",
          // Authorization: "Bearer ${jwt}",
        },
        post: {
          Accept: "application/json",
          // Authorization: "Bearer ${jwt}",
        },
      },
    },
  };

  /** Dev routes to the root for simplicity */
  baseRoute = "";
  /** Dev route for static resources comes from the root */
  basePublicRoute = "";

  /** Role protections for some */
  roleProtectedRoutes: Record<string, string[]> = {
    "/admin": ["admin"],
  };
}

/**
 * Developer environment variables for targetting resources from a development
 * server.
 */
export const ENV = new Env().init();
