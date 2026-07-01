import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema(
  {
    shipmentNumber: {
      type: String,
      required: true,
      unique: true,
    },

    exporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    productName: {
      type: String,
      required: true,
    },

    hsnCode: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    unit: {
      type: String,
      required: true,
    },

    originCountry: {
      type: String,
      required: true,
    },

    destinationCountry: {
      type: String,
      required: true,
    },

    portOfLoading: {
      type: String,
      required: true,
    },

    portOfDischarge: {
      type: String,
      required: true,
    },

    expectedShipmentDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Created", "Pre-Shipment Completed", "In Transit", "Customs Clearance", "Delivered"],
      default: "Created",
    },

    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Buyer",
    },

    currentLocation: {
      type: String,
    },

    eta: {
      type: Date,
    },

    assignedForwarderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    assignedChaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    chaAgentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChaAgent",
    },

    letterOfCredit: {
      type: String,
    },

    complianceStatus: {
      type: String,
      default: "Pending",
    },

    complianceNotes: {
      type: String,
    },

    shipmentValue: {
      type: Number,
      default: 0,
    },

    shippingMethod: {
      type: String,
      enum: ['Air', 'Sea', 'Road', 'Rail'],
      default: 'Sea',
    },

    shippingBillVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Shipment",
  shipmentSchema
);