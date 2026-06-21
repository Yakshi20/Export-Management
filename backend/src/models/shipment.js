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
      default: "Created",
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