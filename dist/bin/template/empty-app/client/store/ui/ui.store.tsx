import type { ApplicationStore } from "../application.store.js";
import { Store } from "../store.js";

export class UIStore extends Store {
  constructor(app: ApplicationStore) {
    super(app);
  }
}
