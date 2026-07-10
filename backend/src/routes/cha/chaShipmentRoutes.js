import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import {
  getAssignedShipments,
  updateCustomsStatus,
  verifyShippingBill,
  assignAgentToShipment,
} from "../../controllers/chaController.js";

const router = express.Router();

router.get("/shipments", protect, getAssignedShipments);
router.put("/shipments/:shipmentId/customs-status", protect, updateCustomsStatus);
router.put("/shipments/:shipmentId/verify-shipping-bill", protect, verifyShippingBill);
router.put("/shipments/:shipmentId/assign-agent", protect, assignAgentToShipment);

export default router;
