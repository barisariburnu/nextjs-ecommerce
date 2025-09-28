import express, { Request, Response } from "express";
import cors from "cors";
import { clerkMiddleware, getAuth } from "@clerk/express";
import { shouldBeUser } from "../middleware/authMiddleware.js";

const app = express();
const port = 8000;

app.use(clerkMiddleware());

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
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

app.get("/test", shouldBeUser, (req: Request, res: Response) => {
  res.json({
    message: "Product service is authenticated!",
    userId: req.userId,
  });
});

app.listen(port, () => {
  console.log(`Product service is running on port ${port}`);
});
