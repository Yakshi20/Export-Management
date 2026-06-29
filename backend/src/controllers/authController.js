import bcrypt from "bcryptjs";
import { successResponse } from "../utils/response.js";
import generateToken from "../utils/generateToken.js";
import User from "../models/user.js";

// Register User
export const register = async (req, res) => {
  try {
    const {
      role,
      email,
      mobile,
      password,
      companyName,
      iecCode,
      gstNumber,
      customBrokerLicense,
      portCode,
      mtoLicenseNumber,
      farmerName,
      farmLocation,
      farmSize,
      cropType,
      aadhaarNumber,
      name,
      specialization,
      yearsOfExperience,
    } = req.body;

    if (!email || !mobile || !password) {
      return res.status(400).json({ success: false, message: "Email, mobile and password are required" });
    }

    if (role === "exporter" && (!companyName || !iecCode || !gstNumber)) {
      return res.status(400).json({ success: false, message: "Company Name, IEC Code and GST Number are required" });
    }

    if (role === "cha" && (!customBrokerLicense || !portCode)) {
      return res.status(400).json({ success: false, message: "Custom Broker License and Port Code are required" });
    }

    if (role === "forwarder" && !mtoLicenseNumber) {
      return res.status(400).json({ success: false, message: "MTO License Number is required" });
    }

    if (role === "farmer" && (!farmerName || !aadhaarNumber || !farmLocation || !cropType)) {
      return res.status(400).json({ success: false, message: "Farmer Name, Aadhaar Number, Farm Location and Crop Type are required" });
    }

    const existingUser = await User.findOne({ email, role });
    if (existingUser) {
      return res.status(400).json({ success: false, message: `Already registered as ${role}. Please login.` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      role,
      email,
      mobile,
      password: hashedPassword,
      companyName,
      iecCode,
      gstNumber,
      customBrokerLicense,
      portCode,
      mtoLicenseNumber,
      farmerName,
      farmLocation,
      farmSize,
      cropType,
      aadhaarNumber,
      name,
      specialization,
      yearsOfExperience,
      isVerified: true,
    });

    successResponse(res, "User registered successfully", {
      id: user._id,
      role: user.role,
      email: user.email,
      mobile: user.mobile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { email, mobile, password, role } = req.body;

    const user = await User.findOne({ $or: [{ email, role }, { mobile, role }] });
    if (!user) {
      return res.status(404).json({ success: false, message: `No ${role} account found with this email` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    const token = generateToken(user._id);

    successResponse(res, "Login successful", {
      token,
      user: {
        id: user._id,
        role: user.role,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Profile
export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    successResponse(res, "Profile fetched", user);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { mobile } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { mobile }, { new: true }).select("-password");
    successResponse(res, "Profile updated successfully", user);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    successResponse(res, "Password changed successfully");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Placeholder exports so old route imports don't break
export const sendOtp = (req, res) => res.status(410).json({ success: false, message: "OTP not in use" });
export const verifyOtp = (req, res) => res.status(410).json({ success: false, message: "OTP not in use" });
export const resendOtp = (req, res) => res.status(410).json({ success: false, message: "OTP not in use" });
export const forgotPassword = (req, res) => res.status(410).json({ success: false, message: "Not implemented" });
export const resetPassword = (req, res) => res.status(410).json({ success: false, message: "Not implemented" });
