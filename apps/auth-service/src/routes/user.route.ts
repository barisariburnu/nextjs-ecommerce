import { Router, Request, Response } from "express";
import { clerkClient } from "@clerk/express";

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
  const users = await clerkClient.users.getUserList();
  res.status(200).json({
    status: "success",
    data: users,
  });
});

router.get("/:id", async (req: Request, res: Response) => {
  const userId = req.params.id as string;
  const user = await clerkClient.users.getUser(userId);
  res.status(200).json({
    status: "success",
    data: user,
  });
});

router.post("/", async (req: Request, res: Response) => {
  type CreateParams = Parameters<typeof clerkClient.users.createUser>[0];
  const newUser: CreateParams = req.body;
  const user = await clerkClient.users.createUser(newUser);
  res.status(201).json({
    status: "success",
    data: user,
  });
});

router.delete("/:id", async (req: Request, res: Response) => {
  const userId = req.params.id as string;
  await clerkClient.users.deleteUser(userId);
  res.status(204).json({
    status: "success",
  });
});

export default router;
