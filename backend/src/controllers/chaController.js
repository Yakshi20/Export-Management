import Shipment from "../models/shipment.js";
import { successResponse } from "../utils/response.js";

export const getAssignedShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find({ assignedChaId: req.user.id })
      .populate("exporterId", "companyName email")
      .populate("buyerId");

    successResponse(res, "Assigned shipments fetched successfully", shipments);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCustomsStatus = async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const { status, complianceNotes } = req.body;

    const shipment = await Shipment.findByIdAndUpdate(
      shipmentId,
      {
        status,
        complianceStatus: "Updated",
        complianceNotes,
      },
      { new: true, runValidators: true }
    );

    if (!shipment) {
      return res.status(404).json({ success: false, message: "Shipment not found" });
    }

    successResponse(res, "Customs status updated successfully", shipment);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyShippingBill = async (req, res) => {
  try {
    const { shipmentId } = req.params;

    const shipment = await Shipment.findByIdAndUpdate(
      shipmentId,
      { shippingBillVerified: true, complianceStatus: "Verified" },
      { new: true }
    );

    if (!shipment) {
      return res.status(404).json({ success: false, message: "Shipment not found" });
    }

    successResponse(res, "Shipping bill verified successfully", shipment);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
