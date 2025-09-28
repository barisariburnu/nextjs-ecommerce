import Fastify from "fastify";
import Clerk from "@clerk/fastify";
import { shouldBeUser } from "../middleware/authMiddleware.js";

const fastify = Fastify();
const port = 8001;

fastify.register(Clerk.clerkPlugin);

fastify.get("/health", async (req, reply) => {
  reply.status(200).send({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

fastify.get("/test", { preHandler: shouldBeUser }, async (req, reply) => {
  reply.send({
    message: "Order service is authenticated!",
    userId: req.userId,
  });
});

const start = async () => {
  try {
    await fastify.listen({ port });
    console.log(`Order service is running on port ${port}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();
