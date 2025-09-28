import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const shouldBeUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = getAuth(req);
  const { isAuthenticated, userId } = auth;
  if (!isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.userId = userId;
  next();
};
