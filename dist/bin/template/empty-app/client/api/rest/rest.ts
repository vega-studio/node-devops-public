import { ApplicationStore } from "../../store/application.store.js";
import { deleteJSON } from "./delete-json.js";
import { getJSON } from "./get-json.js";
import { postJSON } from "./post-json.js";
import { putJSON } from "./put-json.js";

export const REST = <T>(app: ApplicationStore) => ({
  GET: getJSON<T>(app),
  POST: postJSON<T>(app),
  PUT: putJSON<T>(app),
  DELETE: deleteJSON<T>(app),
});
