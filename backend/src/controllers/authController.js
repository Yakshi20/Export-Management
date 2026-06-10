import bcrypt from "bcryptjs";
import { successResponse } from "../utils/response.js";
import generateToken from "../utils/generateToken.js";
import { otpStore } from "../utils/tempStore.js";
import User from "../models/user.js";

// Send OTP
export const sendOtp = (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  otpStore[email] = {otp,expiresAt: Date.now()+10*30*1000,};

  successResponse(res, "OTP Sent", {
    otp,
  });
};

// Verify OTP
export const verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  const storedOtp = otpStore[email];

  if (!storedOtp) {
    return res.status(400).json({
      success: false,
      message: "OTP not found",
    });
  }

  if (Date.now() > storedOtp.expiresAt) {
    delete otpStore[email];

    return res.status(400).json({
      success: false,
      message: "OTP expired",
    });
  }

  if (storedOtp.otp !== otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }
  otpStore[`${email}_verified`] = true;
  delete otpStore[email];
  successResponse(res, "OTP Verified");
};
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
    } = req.body;

    if (role === "exporter") {
    if (!companyName || !iecCode || !gstNumber) {
    return res.status(400).json({
      success: false,
      message:
        "Company Name, IEC Code and GST Number are required",
        });
      }
    }
    
    if (role === "cha") {
    if (!customBrokerLicense || !portCode) {
    return res.status(400).json({
      success: false,
      message:
        "Custom Broker License and Port Code are required",
        });
      }
    }

    if (role === "forwarder") {
    if (!mtoLicenseNumber) {
    return res.status(400).json({
      success: false,
      message: "MTO License Number is required",
      });
      }
    }

    if (!otpStore[`${email}_verified`]) {
      return res.status(400).json({
        success: false,
        message: "Please verify OTP first",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

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
      isVerified: true,
    });

    successResponse(res, "User registered successfully", {
      id: user._id,
      role: user.role,
      email: user.email,
      mobile: user.mobile,
      isVerified: user.isVerified,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { email, mobile, password } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found",
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Account not verified",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = generateToken(user._id);

    successResponse(res, "Login successful", {
      token,
      user: {
        id: user._id,
        role: user.role,
        email: user.email,
        mobile: user.mobile,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Profile
export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    successResponse(res, "Profile fetched", user);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update profile
export const updateProfile = async (req, res) => {
  try {
    const { mobile } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { mobile },
      { new: true }
    ).select("-password");

    successResponse(
      res,
      "Profile updated successfully",
      user
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;

    await user.save();

    successResponse(
      res,
      "Password changed successfully"
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//forgotPassword
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    otpStore[email] = otp;

    successResponse(
      res,
      "Password reset OTP sent",
      { otp }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//reserPasswordsss
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (otpStore[email] !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;

    await user.save();

    delete otpStore[email];

    successResponse(
      res,
      "Password reset successful"
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//resend otp
export const resendOtp = (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  otpStore[email] = {
  otp,
  expiresAt: Date.now() + 5 * 60 * 1000,
  };

  successResponse(
    res,
    "OTP Resent Successfully",
    { otp }
  );
};