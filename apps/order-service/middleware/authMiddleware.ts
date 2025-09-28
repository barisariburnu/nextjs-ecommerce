import Clerk from "@clerk/fastify";
import { FastifyReply, FastifyRequest } from "fastify";

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
