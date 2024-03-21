import { ApplicationStore } from "../store/application.store.js";
import { ENV } from "config/env/env.js";
import { REST } from "./rest/rest.js";
import type { IExampleGetResponse } from "../../server/api/v1/example/example.get.js";

/**
 * Example of how to write simple APIs that interface with the domain server.
 */
export const ExampleAPI = {
  /**
   * A simple getter!
   */
  example: (app: ApplicationStore) =>
    REST<IExampleGetResponse>(app).GET(
      ENV.useApi(ENV.hostConfig.api, 0, "/v1/example", {}).get
    ),
};
