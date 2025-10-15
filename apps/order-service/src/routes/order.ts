import { FastifyInstance } from "fastify";
import { shouldBeUser, shouldBeAdmin } from "../middleware/authMiddleware";
import { Order } from "@repo/order-db";
import { startOfMonth, subMonths } from "date-fns";
import { OrderChartType } from "@repo/types";

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
    const { limit } = req.query as { limit: number };
    const orders = await Order.find().limit(limit).sort({ createdAt: -1 });
    reply.send({
      message: "All orders fetch successfuly",
      data: orders,
    });
  });
  fastify.get(
    "/order-chart",
    { preHandler: shouldBeAdmin },
    async (req, reply) => {
      const now = new Date();
      const sixMonthsAgo = startOfMonth(subMonths(now, 5));

      const raw = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: sixMonthsAgo,
              $lte: now,
            },
          },
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            total: { $sum: 1 },
            successful: {
              $sum: { $cond: [{ $eq: ["$status", "success"] }, 1, 0] },
            },
          },
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            total: 1,
            successful: 1,
          },
        },
        {
          $sort: {
            year: 1,
            month: 1,
          },
        },
      ]);

      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const results: OrderChartType[] = [];

      for (let i = 5; i >= 0; i--) {
        const d = subMonths(now, i);
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const data = raw.find(
          (item) => item.month === month && item.year === year
        );
        results.push({
          month: monthNames[month - 1] as string,
          total: data?.total || 0,
          successful: data?.successful || 0,
        });
      }

      return reply.send({
        message: "Order chart fetch successfuly",
        data: results,
      });
    }
  );
};
