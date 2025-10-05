import Fastify from "fastify";
import Clerk from "@clerk/fastify";
import { connectOrderDB } from "@repo/order-db";
import { orderRoute } from "./routes/order.js";
import { consumer, producer } from "./utils/kafka.js";
import { runKafkaSubscriptions } from "./utils/subscriptions.js";

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

fastify.register(orderRoute);

const start = async () => {
  try {
    await Promise.all([
      connectOrderDB(),
      producer.connect(),
      consumer.connect(),
    ]);
    await runKafkaSubscriptions();
    await fastify.listen({ port });
    console.log(`Order service is running on port ${port}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();
