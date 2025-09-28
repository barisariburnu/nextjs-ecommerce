import { Router } from "express";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategory,
} from "../controllers/category.controller";
import { shouldBeAdmin } from "../middleware/authMiddleware";

const router: Router = Router();

router.post("/", shouldBeAdmin, createCategory);
router.put("/:id", shouldBeAdmin, updateCategory);
router.delete("/:id", shouldBeAdmin, deleteCategory);
router.get("/", getCategories);
router.get("/:id", getCategory);

export default router;
