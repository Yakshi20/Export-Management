import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateAvailability,
} from "../../controllers/farmerController.js";

const router = express.Router();

router.post("/products", protect, createProduct);
router.get("/products", protect, getProducts);
router.get("/products/:id", protect, getProductById);
router.put("/products/:id", protect, updateProduct);
router.delete("/products/:id", protect, deleteProduct);
router.put("/products/:id/availability", protect, updateAvailability);

export default router;
