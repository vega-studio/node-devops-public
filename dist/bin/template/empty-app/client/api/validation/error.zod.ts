import { validate } from "./validate.js";
import { z } from "zod";

export interface IErrorResponse {
  message: string;
}

export const ErrorZ = {
  generalError: validate<IErrorResponse>(
    z.object({ message: z.string().nullable() }).strict()
  ),
};
