import express from "express";
import { protect } from "../../middleware/authMiddleware.js";

import {
  // sendOtp,
  // verifyOtp,
  register,
  login,
  profile,
  updateProfile,
  changePassword,
} from "../../controllers/authController.js";

const router = express.Router();

// Public Routes
// router.post("/send-otp", sendOtp);
// router.post("/verify-otp", verifyOtp);
router.post("/register", register);
router.post("/login", login);

// Protected Routes
router.get("/profile", protect, profile);
router.put("/profile", protect, updateProfile);
router.put(
  "/change-password",
  protect,
  changePassword
);

export default router;