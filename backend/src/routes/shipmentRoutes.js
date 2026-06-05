import express from "express";

import {
  getShipments,
  getShipmentById,
  createShipment,
  updateShipment,
  deleteShipment,
} from "../controllers/shipmentController.js";

const router = express.Router();

router.get("/", getShipments);
router.get("/:id", getShipmentById);

router.post("/", createShipment);
router.put("/:id", updateShipment);
router.delete("/:id", deleteShipment);

export default router;