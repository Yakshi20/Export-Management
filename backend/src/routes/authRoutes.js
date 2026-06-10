import express from "express";
import { protect } from "../middleware/authMiddleware.js";


import {
  sendOtp,
  resendOtp,
  verifyOtp,
  register,
  login,
  profile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/resend-otp", resendOtp);
router.post("/verify-otp", verifyOtp);

router.post("/register", register);
router.post("/login", login);

router.get("/profile", protect, profile);
router.put("/profile", protect, updateProfile);
router.put("/change-password",protect,changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;