import { Router } from "express";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategory,
} from "../controllers/category.controller";

const router: Router = Router();

router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);
router.get("/", getCategories);
router.get("/:id", getCategory);

export default router;
