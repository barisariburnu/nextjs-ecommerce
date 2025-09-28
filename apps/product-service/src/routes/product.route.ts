import { Router } from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  getProduct,
  deleteProduct,
} from "../controllers/products.controller";

const router: Router = Router();

router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);

export default router;
