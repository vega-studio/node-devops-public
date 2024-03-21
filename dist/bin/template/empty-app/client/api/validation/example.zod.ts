import z from "zod";

// Example zod interface
export interface IExample {
  example: string;
}

// Example zod validation
export const exampleZod = z.object({
  example: z.string(),
});

// Example zod typeguard
export function isExample(obj: any): obj is IExample {
  if (!exampleZod.safeParse(obj).success) {
    console.warn("Object failed IExample validation");
    return false;
  }

  return true;
}
