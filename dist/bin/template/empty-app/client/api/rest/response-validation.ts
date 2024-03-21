import { ApplicationStore } from "../../store/application.store.js";

/**
 * Validates the response and generically handles any errors that are not
 * expected to be explicitly handled. Also returns the expected data format that
 * should be retrieved from API end points.
 */
export const responseValidation =
  <T>(_app: ApplicationStore) =>
  async (
    raw: Response,
    _errorHandler?: (error: Error, code?: number) => void
  ): Promise<T | null> => {
    const check = await raw.text();
    let json: any = null;

    try {
      json = JSON.parse(check);
    } catch (err) {
      // TODO: Handle parsing errors
      return null;
    }

    return json;
  };
