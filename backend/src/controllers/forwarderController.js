import Shipment from "../models/shipment.js";
import { successResponse } from "../utils/response.js";

export const getAssignedShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find({ assignedForwarderId: req.user.id })
      .populate("exporterId", "companyName email")
      .populate("buyerId");

    successResponse(res, "Assigned shipments fetched successfully", shipments);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateShipmentLocation = async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const { currentLocation, eta } = req.body;

    const shipment = await Shipment.findByIdAndUpdate(
      shipmentId,
      { currentLocation, eta },
      { new: true }
    );

    if (!shipment) {
      return res.status(404).json({ success: false, message: "Shipment not found" });
    }

    successResponse(res, "Shipment location updated successfully", shipment);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateShipmentStatus = async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Created",
      "Pre-Shipment Completed",
      "In Transit",
      "Customs Clearance",
      "Delivered",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const shipment = await Shipment.findByIdAndUpdate(
      shipmentId,
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
