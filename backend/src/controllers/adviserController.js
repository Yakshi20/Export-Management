import Consultation from "../models/consultation.js";
import { successResponse } from "../utils/response.js";

export const getConsultationRequests = async (req, res) => {
  try {
    const consultations = await Consultation.find({ adviserId: req.user.id })
      .populate("requesterId", "email mobile companyName");

    successResponse(res, "Consultation requests fetched successfully", consultations);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateConsultationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, scheduledAt, notes } = req.body;

    const consultation = await Consultation.findByIdAndUpdate(
      id,
      { status, scheduledAt, notes },
      { new: true, runValidators: true }
    );

    if (!consultation) {
      return res.status(404).json({ success: false, message: "Consultation not found" });
    }

    successResponse(res, "Consultation status updated successfully", consultation);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createConsultationRequest = async (req, res) => {
  try {
    const { adviserId, topic, description } = req.body;

    const consultation = await Consultation.create({
      adviserId,
      requesterId: req.user.id,
      requesterRole: req.user.role,
      topic,
      description,
    });

    successResponse(res, "Consultation request created successfully", consultation);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({ requesterId: req.user.id })
      .populate("adviserId", "name email specialization");

    successResponse(res, "My consultations fetched successfully", consultations);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
