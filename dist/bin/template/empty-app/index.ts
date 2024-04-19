import { TemplateSync } from "../types.js";
import path from "path";

export default async (): Promise<TemplateSync> => ({
  defaultTargetPath: path.resolve("./"),
  fileMap: [
    ["./client", "./app/client"],
    ["./config", "./app/config"],
    ["./server", "./app/server"],
    ["./dts", "./dts"],
  ],
});
