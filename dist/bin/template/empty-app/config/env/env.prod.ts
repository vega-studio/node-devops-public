import { EnvBase } from "./env.base.js";

/**
 * See env.ts and env.base.ts for more information.
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
}

export const ENV = new Env().init();
