import path from "path";
import { EnvBase } from "../../config/env/env.base.js";

let ENV: EnvBase;

export async function getEnv() {
  if (ENV) return ENV;

  ENV = (
    await import(
      process.env.BUILD_MODE
        ? path.resolve(`app/config/env/env.${process.env.BUILD_MODE}.js`)
        : path.resolve("app/config/env/env.js")
    )
  ).ENV;

  return ENV;
}
