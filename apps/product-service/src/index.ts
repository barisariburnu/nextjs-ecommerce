import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { clerkMiddleware, getAuth } from "@clerk/express";
import { shouldBeUser } from "../middleware/authMiddleware.js";

import categoryRouter from "./routes/category.route.js";
import productRouter from "./routes/product.route.js";

const app = express();
const port = 8000;

app.use(express.json());
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

app.use("/products", productRouter);
app.use("/categories", categoryRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error" });
});

app.listen(port, () => {
  console.log(`Product service is running on port ${port}`);
});
