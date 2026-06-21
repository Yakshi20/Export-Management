import Shipment from "../models/shipment.js";
import { successResponse } from "../utils/response.js";

const ALLOWED_STATUSES = [
  "Created",
  "Pre-Shipment Completed",
  "In Transit",
  "Customs Clearance",
  "Delivered",
];

export const updateShipmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(", ")}`,
      });
    }

    const shipment = await Shipment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!shipment) {
      return res.status(404).json({ success: false, message: "Shipment not found" });
    }

    successResponse(res, "Shipment status updated successfully", shipment);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
