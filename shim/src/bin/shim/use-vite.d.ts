/// <reference types="cookie-parser" />
/// <reference types="node" resolution-mode="require"/>
import https from "https";
import { NextFunction, Request, Response } from "express";
export type IViteResourceMiddleware = (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined | void;
/**
 * Creates some proxy services for Vite to make HMR available. This ONLY happens
 * during development mode. Use the callback to provide alternate hosting
 * behavior for develpment mode.
 */
export declare function useVite(app: any, server: https.Server, onProduction?: () => void, resourceMiddleWare?: IViteResourceMiddleware[]): Promise<void>;
