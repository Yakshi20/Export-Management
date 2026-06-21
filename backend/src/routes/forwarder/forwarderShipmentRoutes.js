import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import {
  getAssignedShipments,
  updateShipmentLocation,
  updateShipmentStatus,
} from "../../controllers/forwarderController.js";

const router = express.Router();

router.get("/shipments", protect, getAssignedShipments);
router.put("/shipments/:shipmentId/location", protect, updateShipmentLocation);
router.put("/shipments/:shipmentId/status", protect, updateShipmentStatus);

export default router;
