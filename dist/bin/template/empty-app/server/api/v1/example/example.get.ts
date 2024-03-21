import { api } from "../../index.js";
import type { IErrorResponse } from "../../../../client/api/validation/error.zod.js";
import { StrictType } from "../../../../../util/types.js";
import { validate } from "../../../../client/api/validation/validate.js";
import { z } from "zod";

export interface IExampleGetRequest extends Record<string, string> {
  /**
   * The relative doc path. This is a path that is typically sent to the client
   * and is ambiguously relative for the server to host the desired file.
   */
  prop: string;
}

export interface IExampleGetResponse {
  /**
   * The response message received from the AI
   */
  message: string;
}

/**
 * API to send a message to the LLM.
 */
export const ExampleGet = api(
  [],
  validate<IExampleGetRequest>(z.object({})),
  {
    SUCCESS: {
      status: 200,
      response: (): StrictType<IExampleGetResponse> => ({
        message: "The file requested was not found",
      }),
    },
    SOMETHING_WENT_WRONG: {
      status: 404,
      response: (): StrictType<IErrorResponse> => ({
        message: "The file requested was not found",
      }),
    },
  },
  async (request, respond, _ctx) => {
    // Ensure the file exists
    if (!request.prop) return respond("SOMETHING_WENT_WRONG");

    // Send the file
    return respond("SUCCESS", {
      message: "Sweet!",
    });
  }
);
