import type { IJsonType } from "../util/types.js";
import type { IncomingHttpHeaders } from "http";

declare global {
  export interface IJwt {
    // Fill in with your own custom JWT properties
  }

  namespace Express {
    export interface Request {
      session?: IJwt;
      body: IJsonType;
      headers: IncomingHttpHeaders;
    }
  }
}
