import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { getChaDirectory } from "../../controllers/chaDirectoryController.js";

const router = express.Router();

router.get("/", protect, getChaDirectory);

export default router;
