import express from "express";
import { protect } from "../../middleware/authMiddleware.js";

import {
  trackShipment,
  getCurrencyExchange,
  getBuyerShipmentDetails,
  addLetterOfCredit,
} from "../../controllers/postShipmentController.js";

const router = express.Router();

// Shipment Tracking
router.get("/track/:shipmentId", protect, trackShipment);

// Currency Exchange
router.get("/currency", protect, getCurrencyExchange);

// Buyer + Shipment Details
router.get(
  "/buyer/:shipmentId",
  protect,
  getBuyerShipmentDetails
);

// Letter of Credit
router.post("/lc", protect, addLetterOfCredit);

export default router;