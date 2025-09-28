import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { shouldBeUser } from "./middleware/authMiddleware.js";

const app = new Hono();
const port = 8002;

app.use("*", clerkMiddleware());

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

const start = async () => {
  try {
    await serve(
      {
        fetch: app.fetch,
        port: port,
      },
      (info) => {
        console.log(
          `Payment service is running on http://localhost:${info.port}`
        );
      }
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();
