import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import {
  createShipment,
  getShipments,
  getShipmentById,
  updateShipment,
} from "../../controllers/exporterShipmentController.js";

const router = express.Router();

router.post("/", protect, createShipment);
router.get("/", protect, getShipments);
router.get("/:id", protect, getShipmentById);
router.put("/:id", protect, updateShipment);

export default router;
