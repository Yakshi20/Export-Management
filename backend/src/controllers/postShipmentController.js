import Shipment from "../models/shipment.js";
import { successResponse } from "../utils/response.js";

export const trackShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.shipmentId)
      .populate("exporterId", "companyName email")
      .populate("buyerId", "buyerName companyName country");

    if (!shipment) {
      return res.status(404).json({ success: false, message: "Shipment not found" });
    }

    successResponse(res, "Shipment tracked successfully", {
      shipmentId: shipment._id,
      shipmentNumber: shipment.shipmentNumber,
      status: shipment.status,
      currentLocation: shipment.currentLocation || "Not updated",
      eta: shipment.eta || null,
      productName: shipment.productName,
      originCountry: shipment.originCountry,
      destinationCountry: shipment.destinationCountry,
      portOfLoading: shipment.portOfLoading,
      portOfDischarge: shipment.portOfDischarge,
      complianceStatus: shipment.complianceStatus,
      shippingBillVerified: shipment.shippingBillVerified,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCurrencyExchange = (req, res) => {
  res.json({
    success: true,
    rates: {
      USD_INR: 83.45,
      EUR_INR: 91.20,
      GBP_INR: 106.30,
      AED_INR: 22.71,
      JPY_INR: 0.55,
      AUD_INR: 54.80,
      CAD_INR: 61.50,
      SGD_INR: 61.90,
      CNY_INR: 11.52,
      KRW_INR: 0.062,
    },
    updatedAt: new Date().toISOString(),
  });
};

export const getBuyerShipmentDetails = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.shipmentId)
      .populate("buyerId")
      .populate("exporterId", "companyName iecCode email");

    if (!shipment) {
      return res.status(404).json({ success: false, message: "Shipment not found" });
    }

    successResponse(res, "Shipment details fetched successfully", {
      shipmentId: shipment._id,
      shipmentNumber: shipment.shipmentNumber,
      buyer: shipment.buyerId,
      exporter: shipment.exporterId,
      productName: shipment.productName,
      quantity: shipment.quantity,
      unit: shipment.unit,
      status: shipment.status,
      destinationCountry: shipment.destinationCountry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addLetterOfCredit = async (req, res) => {
  try {
    const { shipmentId, lcNumber } = req.body;

    const shipment = await Shipment.findByIdAndUpdate(
      shipmentId,
      { letterOfCredit: lcNumber },
      { new: true }
    );

    if (!shipment) {
      return res.status(404).json({ success: false, message: "Shipment not found" });
    }

    successResponse(res, "Letter of Credit added successfully", {
      shipmentId: shipment._id,
      letterOfCredit: shipment.letterOfCredit,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
