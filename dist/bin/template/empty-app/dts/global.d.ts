export {};

/**
 * Allows the declaration of expected global properties that will be used in the
 * server project.
 */
declare global {
  interface globalThis {
    fetch: any;
  }
}
