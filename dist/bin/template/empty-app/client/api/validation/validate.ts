import { ZodTypeAny } from "zod";

export type Validator<TType> = (
  val: any,
  message?: string,
  logErrors?: boolean
) => val is TType;

/**
 * Generates a generic validator Object that consists or a zod validation schema
 * and a type guard method.
 */
export function validate<TType, TZod extends ZodTypeAny = ZodTypeAny>(
  z: TZod
): Validator<TType> {
  return (val: any, message?: string, logErrors = true): val is TType => {
    try {
      z.parse(val);
      return true;
    } catch (e) {
      if (logErrors) {
        if (message) console.warn(message);
        console.warn("Validation failed for object:\n", val);
        if (e instanceof Error) {
          console.warn("Validations errors:");
          console.warn(e.message);
        }
      }

      return false;
    }
  };
}
