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
    },

    mobile: {
      type: String,
      required: true,
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

// Same email can register under different roles, but not the same role twice
userSchema.index({ email: 1, role: 1 }, { unique: true });

export default mongoose.model("User", userSchema);