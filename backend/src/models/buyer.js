import mongoose from "mongoose";

const buyerSchema = new mongoose.Schema(
  {
    buyerName: {
      type: String,
      required: true,
    },

    companyName: {
      type: String,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    address: {
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

export default mongoose.model("Buyer", buyerSchema);
