import Clerk from "@clerk/fastify";
import { FastifyReply, FastifyRequest } from "fastify";
import { CustomJwtSessionClaims } from "@repo/types";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
  }
}

export const shouldBeUser = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const auth = Clerk.getAuth(req);
  const { isAuthenticated, userId } = auth;
  if (!isAuthenticated) {
    return reply.status(401).send({ error: "Unauthorized" });
  }
  req.userId = userId;
};

export const shouldBeAdmin = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const auth = Clerk.getAuth(req);
  const { isAuthenticated, userId } = auth;
  if (!isAuthenticated) {
    return reply.status(401).send({ error: "Unauthorized" });
  }

  const claims = auth.sessionClaims as CustomJwtSessionClaims;

  if (claims.metadata?.role !== "admin") {
    return reply.status(403).send({ error: "Forbidden" });
  }
  req.userId = userId;
};
