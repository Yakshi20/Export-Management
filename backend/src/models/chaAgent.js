import mongoose from "mongoose";

const chaAgentSchema = new mongoose.Schema(
  {
    chaName: {
      type: String,
      required: true,
    },

    licenseNumber: {
      type: String,
      required: true,
    },

    port: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
    },

    specialization: {
      type: String,
      enum: ["Air", "Sea", "Both"],
      default: "Sea",
    },

    customsCharges: {
      type: String,
    },

    exporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ChaAgent", chaAgentSchema);
