import jsonwebtoken from "jsonwebtoken";
import { IAPIMiddleware } from "../index.js";
import { NextFunction, Request, Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

/**
 * A middleware option for a path that requires a JWT token to be present.
 */
export const requireJwt: IAPIMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Read the token from the request cookie
  const token = req.cookies["token"];

  // If no token is found, return an error
  if (!token) {
    return res.status(403).send({
      message: "No token provided! Please log in.",
    });
  }

  // Verify the token
  let jwt: IJwt | undefined = void 0;

  try {
    jwt = jsonwebtoken.verify(token, JWT_SECRET) as IJwt;

    // If the token is expired, return an error
    if (jwt.exp < Date.now() / 1000) {
      return res.status(401).send({
        message: "Expired Token. Please log in again.",
      });
    }
  } catch (err) {
    jwt = void 0;
  }

  if (!jwt) {
    return res.status(401).send({
      message: "Unauthorized! Please log in.",
    });
  }

  // If the token is valid, save the decoded jwt in the request
  // object
  req.session = jwt;
  next();
};
