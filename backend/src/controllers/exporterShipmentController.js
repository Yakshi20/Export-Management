import Shipment from "../models/shipment.js";
import { successResponse } from "../utils/response.js";

export const createShipment = async (req, res) => {
  try {
    const {
      shipmentNumber,
      productName,
      hsnCode,
      quantity,
      unit,
      originCountry,
      destinationCountry,
      portOfLoading,
      portOfDischarge,
      expectedShipmentDate,
      shipmentValue,
      shippingMethod,
      buyerId,
      qualityCertificate,
    } = req.body;

    const shipment = await Shipment.create({
      shipmentNumber,
      productName,
      hsnCode,
      quantity,
      unit,
      originCountry,
      destinationCountry,
      portOfLoading,
      portOfDischarge,
      expectedShipmentDate,
      shipmentValue,
      shippingMethod,
      buyerId,
      qualityCertificate,
      exporterId: req.user.id,
    });

    successResponse(res, "Shipment created successfully", shipment);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find({ exporterId: req.user.id })
      .populate("buyerId", "buyerName companyName country")
      .populate("chaAgentId", "chaName port specialization")
      .populate("assignedChaId", "email portCode customBrokerLicense")
      .populate("assignedForwarderId", "email mtoLicenseNumber")
      .sort({ createdAt: -1 });
    successResponse(res, "Shipments fetched successfully", shipments);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getShipmentById = async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ _id: req.params.id, exporterId: req.user.id })
      .populate("buyerId", "buyerName companyName country")
      .populate("chaAgentId", "chaName port specialization");

    if (!shipment) {
      return res.status(404).json({ success: false, message: "Shipment not found" });
    }

    successResponse(res, "Shipment fetched successfully", shipment);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findOneAndUpdate(
      { _id: req.params.id, exporterId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!shipment) {
      return res.status(404).json({ success: false, message: "Shipment not found" });
    }

    successResponse(res, "Shipment updated successfully", shipment);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
