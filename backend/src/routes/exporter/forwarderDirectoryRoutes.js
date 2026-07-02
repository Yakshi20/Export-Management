import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { getForwarderDirectory } from "../../controllers/forwarderDirectoryController.js";

const router = express.Router();

router.get("/", protect, getForwarderDirectory);

export default router;
