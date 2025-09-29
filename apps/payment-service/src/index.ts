import { clerkMiddleware } from "@hono/clerk-auth";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import sessionRoute from "./routes/session.route.js";
import { cors } from "hono/cors";

const app = new Hono();
const port = 8002;

app.use("*", clerkMiddleware());
app.use(
  "*",
  cors({
    origin: "http://localhost:3000",
  })
);

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.route("/session", sessionRoute);

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
