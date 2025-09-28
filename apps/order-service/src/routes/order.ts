import { FastifyInstance } from "fastify";
import { shouldBeUser, shouldBeAdmin } from "../middleware/authMiddleware";
import { Order } from "@repo/order-db";

export const orderRoute = async (fastify: FastifyInstance) => {
  fastify.get(
    "/user-orders",
    { preHandler: shouldBeUser },
    async (req, reply) => {
      const orders = await Order.find({ userId: req.userId });
      reply.send({
        message: "User orders fetch successfuly",
        data: orders,
      });
    }
  );
  fastify.get("/orders", { preHandler: shouldBeAdmin }, async (req, reply) => {
    const orders = await Order.find();
    reply.send({
      message: "All orders fetch successfuly",
      data: orders,
    });
  });
};
