import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["beginner", "exporter", "cha","former", "forwarder"],
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    companyName: String,
    iecCode: String,
    gstNumber: String,

    farmerName: String,
    farmLocation: String,
    farmSize: String,
    cropType: String,

    customBrokerLicense: String,
    portCode: String,

    mtoLicenseNumber: String,
    licenseFile: String,

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);