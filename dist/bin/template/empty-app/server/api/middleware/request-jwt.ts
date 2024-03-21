import jsonwebtoken from "jsonwebtoken";
import { IAPIMiddleware } from "../index.js";
import { NextFunction, Request, Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

/**
 * A middleware option for a path that requests the JWT token be verified but
 * importantly: Does NOT require it. This will just make it available in the
 * request object if it is valid.
 */
export const requestJwt: IAPIMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  // Read the token from the request cookie
  const token = req.cookies["token"];

  // If no token is found, we don't set the session token
  if (!token) {
    next();
    return;
  }

  // Verify the token
  let jwt: IJwt | undefined = void 0;

  try {
    jwt = jsonwebtoken.verify(token, JWT_SECRET) as IJwt;

    // If the token is expired, just set a void session
    if (jwt.exp < Date.now() / 1000) {
      jwt = void 0;
    }
  } catch (err) {
    jwt = void 0;
  }

  // If the token is valid, save the decoded jwt in the request
  // object
  req.session = jwt;
  next();
};
