import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import {
  getConsultationRequests,
  updateConsultationStatus,
  createConsultationRequest,
  getMyConsultations,
} from "../../controllers/adviserController.js";

const router = express.Router();

router.get("/consultations", protect, getConsultationRequests);
router.put("/consultations/:id/status", protect, updateConsultationStatus);
router.post("/consultations/request", protect, createConsultationRequest);
router.get("/consultations/my", protect, getMyConsultations);

export default router;
