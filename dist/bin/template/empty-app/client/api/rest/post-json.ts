import { ApplicationStore } from "../../store/index.js";
import { IErrorResponse } from "../validation/error.zod.js";
import { responseValidation } from "./response-validation.js";
import { Validation } from "../validation/index.js";

/**
 * Perform a POST request to a REST endpoint.
 */
export const postJSON =
  <T>(app: ApplicationStore) =>
  async (
    url: { path: string; headers?: HeadersInit; fetchOptions?: RequestInit },
    json?: object,
    additionalheaders?: Record<string, string>,
    fetchOptions?: RequestInit
  ): Promise<{ result: T | null; error?: IErrorResponse }> => {
    const headers = {
      "Content-type": "application/json",
      ...additionalheaders,
      ...url.headers,
    };

    try {
      const response = await fetch(url.path, {
        method: "POST",
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
