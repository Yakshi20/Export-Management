import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import {
  createBuyer,
  getBuyers,
  getBuyerById,
  updateBuyer,
  deleteBuyer,
} from "../../controllers/buyerController.js";

const router = express.Router();

router.post("/", protect, createBuyer);
router.get("/", protect, getBuyers);
router.get("/:id", protect, getBuyerById);
router.put("/:id", protect, updateBuyer);
router.delete("/:id", protect, deleteBuyer);

export default router;
