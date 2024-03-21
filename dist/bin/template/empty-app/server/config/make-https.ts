import fs from "fs-extra";
import https from "https";
import makeCert from "make-cert";
import path from "path";
import { chalk } from "../../../util/chalk.js";
import { Express } from "express";
import { keypressCommands } from "./keypress-commands.js";
import { Logging } from "./logging.js";
import { wait } from "../../../util/wait.js";

export async function makeHttps(app: Express) {
  const { PORT = 443, RESOURCE_PATH = "" } = process.env;

  let sign: any;

  // Host our App as an HTTPS endpoint so we can follow protocol up the chain.
  if (fs.existsSync(path.resolve("./.cert.json"))) {
    sign = fs.readJsonSync(path.resolve("./.cert.json"));
  } else {
    sign = makeCert("localhost");
    fs.writeJsonSync(path.resolve("./.cert.json"), sign, { spaces: 2 });
  }

  const httpsServer = https.createServer(sign, app);

  Logging.system.info(
    `App establishing connection at https://localhost:${PORT}/`
  );
  httpsServer.listen(PORT, async () => {
    Logging.system.info(`App running at https://localhost:${PORT}/`);
    Logging.system.info("Hosting files from:", RESOURCE_PATH);

    await wait(1000);
    Logging.system.info("\n\n\n");
    Logging.system.info(
      chalk.cyanBright("*************************************************")
    );
    Logging.system.info([
      chalk.cyanBright("*"),
      "Run",
      chalk.yellowBright("npm run url dev"),
      "in another shell",
      chalk.cyanBright("        *"),
    ]);
    Logging.system.info([
      chalk.cyanBright("*"),
      "Type",
      chalk.yellowBright("thisisunsafe"),
      "within page if using Chrome",
      chalk.cyanBright("*"),
    ]);
    Logging.system.info(
      chalk.cyanBright("*************************************************")
    );
    Logging.system.info("\n");

    // Register any special commands for this server's console
    keypressCommands(app);
    Logging.system.info("\n\n\n");
  });

  return httpsServer;
}
