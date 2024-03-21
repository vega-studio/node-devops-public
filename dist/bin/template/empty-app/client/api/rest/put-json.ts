import { ApplicationStore } from "../../store/index.js";
import { IErrorResponse } from "../validation/error.zod.js";
import { responseValidation } from "./response-validation.js";
import { Validation } from "../validation/index.js";

/**
 * Perform a PUT request to a REST endpoint.
 */
export const putJSON =
  <T>(app: ApplicationStore) =>
  async (
    url: { path: string; headers?: HeadersInit; fetchOptions?: RequestInit },
    json?: object,
    additionalheaders?: Record<string, string>,
    fetchOptions?: RequestInit
  ): Promise<{ result: T | null; error?: IErrorResponse }> => {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...additionalheaders,
      ...url.headers,
    };

    try {
      const response = await fetch(url.path, {
        method: "PUT",
        headers,
        body: json ? JSON.stringify(json) : undefined,
        ...fetchOptions,
        ...url.fetchOptions,
      });

      const validatedResponse = await responseValidation<T>(app)(response);

      if (!validatedResponse) {
        return {
          result: null,
          error: {
            message: "Response was not valid JSON",
          },
        };
      }

      if (Validation.ErrorZ.generalError(validatedResponse, void 0, false)) {
        return {
          result: null,
          error: validatedResponse,
        };
      }

      return { result: validatedResponse };
    } catch (err) {
      console.warn(err);
      return {
        result: null,
        error: {
          message:
            err instanceof Error
              ? err.stack || err.message
              : (err as object).toString(),
        },
      };
    }
  };
