import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["beginner", "exporter", "cha", "farmer", "forwarder", "adviser"],
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
    aadhaarNumber: String,
    productAvailability: {
      type: Boolean,
      default: true,
    },

    // Adviser fields
    name: String,
    specialization: String,
    yearsOfExperience: Number,

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