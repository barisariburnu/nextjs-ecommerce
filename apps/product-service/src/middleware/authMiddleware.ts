import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";
import { CustomJwtSessionClaims } from "@repo/types";

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

export const shouldBeAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = getAuth(req);
  const { isAuthenticated, userId } = auth;
  if (!isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const claims = auth.sessionClaims as CustomJwtSessionClaims;

  if (claims.metadata?.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  req.userId = userId;
  next();
};
