export * from "./gql/index.js";
import * as AuthAPI from "./auth.api.js";

export const API = {
  ...AuthAPI,
};
