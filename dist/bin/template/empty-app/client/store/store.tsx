import type { IApplicationStore } from "./application.store.js";

/**
 * This is the base store to ensure a pattern for passing down the application
 * singleton throughout the Store structure to resolve. Every class within the
 * application state should inheret this class.
 */
export class Store {
  /** The application state. */
  application: IApplicationStore;

  constructor(app: IApplicationStore) {
    this.application = app;
  }
}
