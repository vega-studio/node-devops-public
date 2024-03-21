/**
 * Listens for process exit signals of various types and fires the provided
 * callback when it happens with some easy to handle details.
 */
export function handleProcessExit(
  cb: (message: string, err?: Error) => Promise<void>
) {
  const handleExit = (message: string) => (err?: Error) => {
    cb(message, err);
    if (err) process.exit(1);
    else process.exit(0);
  };

  // Catch when app is closing
  process.on("exit", handleExit("exit"));
  // Catch ctrl+c event
  process.on("SIGINT", handleExit("SIGINT"));
  // Catch "kill pid" (for example: nodemon restart)
  process.on("SIGUSR1", handleExit("SIGUSR1"));
  process.on("SIGUSR2", handleExit("SIGUSR2"));
  process.on("SIGTERM", handleExit("SIGTERM"));
  // Catch uncaught exceptions
  process.on("uncaughtException", handleExit("uncaughtException"));
}
