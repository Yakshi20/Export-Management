import express from "express";
import { protect } from "../../middleware/authMiddleware.js";

import {
  getCountries,
  getProducts,
  checkCompliance,
  addBuyerDetails,
  generateInvoice,
  generateQuotation,
  generateShippingBill,
  generatePackingList,
} from "../../controllers/preShipmentController.js";

const router = express.Router();

// Country Selection
router.get("/countries", protect, getCountries);

// Product Selection
router.get("/products", protect, getProducts);

// Compliance Check
router.post("/compliance", protect, checkCompliance);

// Buyer Details
router.post("/buyer", protect, addBuyerDetails);

// PDF Generation
router.post("/invoice", protect, generateInvoice);
router.post("/quotation", protect, generateQuotation);
router.post("/shipping-bill", protect, generateShippingBill);
router.post("/packing-list", protect, generatePackingList);

export default router;