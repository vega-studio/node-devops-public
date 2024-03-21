import winston from "winston";
import { chalk } from "../../../util/chalk.js";
import { isString } from "../../../util/types.js";

function getLevelColor(level: string) {
  switch (level) {
    case "info":
      return chalk.greenBright;
    case "http":
      return chalk.blueBright;
    case "verbose":
      return chalk.yellowBright;
    case "debug":
      return chalk.magentaBright;
    case "error":
      return chalk.redBrightBold;
    default:
      return chalk.whiteBright;
  }
}

const consoleTransport = (state: Logs) =>
  new winston.transports.Console({
    // We just want the messages printed to the console
    format: winston.format.printf(({ level, message }) => {
      const renderLevel = state.showLevel ? `[${level}]` : "";

      return getLevelColor(level)(
        `${renderLevel}${
          Array.isArray(message)
            ? message.join(" ")
            : isString(message)
            ? message
            : JSON.stringify(message)
        }`
      );
    }),
  });

/**
 * This is where all logging is configured for the application. We can use this
 * central point to configure where logs get stored and set up different logs to
 * apply to different parts of the application.
 */
class Logs {
  /** Adds the level to the log output when transporting to the Console */
  showLevel = false;

  /**
   * Simplifies typechecking and logging actual Error objects from catch
   * statements as caught objects are no longer guaranteed Error types.
   */
  error = (logger: winston.Logger, err: any) => {
    if (err instanceof Error) {
      logger.error(err.stack || err.message);
    }
  };

  /**
   * Logs for the API layer of the server. Generally deals with requests and how
   * they are handled in the mid tier.
   */
  api = winston.createLogger({
    transports: [consoleTransport(this)],
  });

  /**
   * Logs for the LLM layer of the server. This deals with any scripts that work
   * to operate external python code processes or with the python processes
   * themselves.
   */
  llm = winston.createLogger({
    transports: [consoleTransport(this)],
  });

  /**
   * System level logs that deal with connections and establishing the
   * environment.
   */
  system = winston.createLogger({
    transports: [consoleTransport(this)],
  });
}

/** Logs are a singleton */
export const Logging = new Logs();
