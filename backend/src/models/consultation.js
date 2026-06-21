import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
  {
    adviserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    requesterRole: {
      type: String,
    },

    topic: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },

    scheduledAt: {
      type: Date,
    },

    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Consultation", consultationSchema);
