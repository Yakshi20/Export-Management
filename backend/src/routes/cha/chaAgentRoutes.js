import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import {
  createChaAgent,
  getChaAgents,
  getChaAgentById,
  updateChaAgent,
  deleteChaAgent,
} from "../../controllers/chaAgentController.js";

const router = express.Router();

router.post("/", protect, createChaAgent);
router.get("/", protect, getChaAgents);
router.get("/:id", protect, getChaAgentById);
router.put("/:id", protect, updateChaAgent);
router.delete("/:id", protect, deleteChaAgent);

export default router;
