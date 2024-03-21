import { config } from "dotenv";

/**
 * This ensures the environment has all of the necessary configuration variables
 * to make the system work. This also executes the dotenv library to enable env
 * configuration via env file.
 */
export async function configEnv() {
  // Tell dotenv to load the .env file
  config();
}
