import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import { shouldBeAdmin } from "./middleware/authMiddleware.js";
import { clerkMiddleware } from "@clerk/express";

const app = express();
const port = 8003;

app.use(express.json());
app.use(clerkMiddleware());

app.use(
  cors({
    origin: ["http://localhost:3001"],
    credentials: true,
  })
);

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.use("/users", shouldBeAdmin, userRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error" });
});

const start = async () => {
  try {
    app.listen(port, () => {
      console.log(`Auth service is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to Kafka:", error);
    process.exit(1);
  }
};

start();
