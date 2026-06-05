import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  register,
  login,
  profile,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, profile);

export default router;